import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET() {
  try {
    const jobs: any[] = [];

    // 1. Fetch from Jobicy (Good for location filtering)
    const jobicyRes = await fetch('https://jobicy.com/api/v2/remote-jobs?count=20&geo=india');
    if (jobicyRes.ok) {
      const data = await jobicyRes.json();
      if (data.jobs) {
        data.jobs.forEach((job: any) => {
          jobs.push({
            title: job.jobTitle,
            company: job.companyName,
            location: job.jobGeo || 'India',
            description: job.jobExcerpt || job.jobDescription?.replace(/<[^>]*>?/gm, '').substring(0, 1000),
            salary_min: job.annualSalaryMin ? parseInt(job.annualSalaryMin) : null,
            salary_max: job.annualSalaryMax ? parseInt(job.annualSalaryMax) : null,
            apply_link: job.url,
            posted_at: job.pubDate ? new Date(job.pubDate).toISOString() : new Date().toISOString(),
          });
        });
      }
    }

    // 2. Fetch from Arbeitnow (Filter for India)
    const arbeitnowRes = await fetch('https://www.arbeitnow.com/api/job-board-api');
    if (arbeitnowRes.ok) {
      const data = await arbeitnowRes.json();
      data.data.forEach((job: any) => {
        // Only include if location mentions India or it's remote
        const isIndia = job.location.toLowerCase().includes('india') || job.remote;
        if (isIndia) {
          jobs.push({
            title: job.title,
            company: job.company_name,
            location: job.location,
            description: job.description.replace(/<[^>]*>?/gm, '').substring(0, 1000),
            salary_min: null,
            salary_max: null,
            apply_link: job.url,
            posted_at: job.created_at ? new Date(job.created_at * 1000).toISOString() : new Date().toISOString(),
          });
        }
      });
    }

    // 3. Fetch from Remotive (Remote Jobs)
    const remotiveRes = await fetch('https://remotive.com/api/remote-jobs?limit=10');
    if (remotiveRes.ok) {
      const data = await remotiveRes.json();
      data.jobs.forEach((job: any) => {
        jobs.push({
          title: job.title,
          company: job.company_name,
          location: job.candidate_required_location || 'Remote',
          description: job.description.replace(/<[^>]*>?/gm, '').substring(0, 1000),
          salary_min: job.salary ? parseInt(job.salary.split('-')[0].replace(/\D/g, '')) * 1000 : null,
          salary_max: job.salary ? parseInt(job.salary.split('-')[1]?.replace(/\D/g, '') || '0') * 1000 : null,
          apply_link: job.url,
          posted_at: job.publication_date ? new Date(job.publication_date).toISOString() : new Date().toISOString(),
        });
      });
    }

    // Upsert into Supabase
    if (jobs.length > 0) {
      const { data, error } = await supabase
        .from('jobs')
        .upsert(jobs, { onConflict: 'apply_link' });

      if (error) {
        console.error('Supabase Upsert Error:', error);
        return NextResponse.json({ error: error.message }, { status: 500 });
      }
    }

    return NextResponse.json({ 
      success: true, 
      count: jobs.length,
      message: `Synced ${jobs.length} jobs from Remotive and Arbeitnow.`
    });

  } catch (error: any) {
    console.error('Sync Error:', error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
