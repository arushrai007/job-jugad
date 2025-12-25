"use client";

import { useState, useEffect, Suspense } from "react";
import { motion } from "framer-motion";
import { 
  Search, 
  MapPin, 
  Briefcase, 
  DollarSign, 
  Filter,
  ArrowRight,
  Zap
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { supabase } from "@/lib/supabase";
import { useSearchParams } from "next/navigation";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min: number | null;
  salary_max: number | null;
  apply_link: string;
  created_at: string;
  posted_at: string;
}

function JobsList() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get("q") || "";
  
  const [jobs, setJobs] = useState<Job[]>([]);
  const [search, setSearch] = useState(initialSearch);
  const [loading, setLoading] = useState(true);
  const [indiaOnly, setIndiaOnly] = useState(true);
  const [recentOnly, setRecentOnly] = useState(true);

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const { data, error } = await supabase
        .from('jobs')
        .select('*')
        .order('posted_at', { ascending: false });
      
      if (error) throw error;
      setJobs(data || []);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const matchesSearch = 
      job.title?.toLowerCase().includes(search.toLowerCase()) || 
      job.company?.toLowerCase().includes(search.toLowerCase()) ||
      job.location?.toLowerCase().includes(search.toLowerCase());
    
    const isIndia = job.location?.toLowerCase().includes('india') || job.location?.toLowerCase().includes('remote');
    const matchesIndia = !indiaOnly || isIndia;

    const postDate = new Date(job.posted_at || job.created_at);
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    const isRecent = postDate >= fourDaysAgo;
    const matchesRecent = !recentOnly || isRecent;

    return matchesSearch && matchesIndia && matchesRecent;
  });

  return (
    <div className="container mx-auto px-4">
      <div className="flex flex-col md:flex-row justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Job Discovery</h1>
          <p className="text-muted-foreground mt-2">Explore {filteredJobs.length} verified roles in India (last 4 days).</p>
        </div>
        <div className="flex flex-col w-full md:w-auto gap-4">
          <div className="flex gap-2">
            <Button 
              variant={indiaOnly ? "default" : "outline"} 
              size="sm" 
              className="rounded-full"
              onClick={() => setIndiaOnly(!indiaOnly)}
            >
              🇮🇳 India Only
            </Button>
            <Button 
              variant={recentOnly ? "default" : "outline"} 
              size="sm" 
              className="rounded-full"
              onClick={() => setRecentOnly(!recentOnly)}
            >
              🕒 Last 4 Days
            </Button>
          </div>
          <div className="flex w-full md:w-auto gap-3">
            <div className="relative flex-1 md:w-80">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <Input 
                placeholder="Search jobs..." 
                className="pl-10 rounded-xl"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>
        </div>
      </div>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-64 bg-muted animate-pulse rounded-2xl" />
          ))}
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredJobs.length > 0 ? (
            filteredJobs.map((job, i) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.05 }}
              >
                <Card className="rounded-2xl border-zinc-200 dark:border-zinc-800 hover:shadow-xl transition-all h-full flex flex-col group">
                  <CardHeader>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex gap-2">
                        <Badge variant="secondary">Full Time</Badge>
                        {new Date(job.posted_at) >= new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) && (
                          <Badge className="bg-orange-500 hover:bg-orange-600">New</Badge>
                        )}
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {new Date(job.posted_at || job.created_at).toLocaleDateString()}
                      </span>
                    </div>
                    <CardTitle className="text-xl group-hover:text-primary transition-colors line-clamp-1">{job.title}</CardTitle>
                    <CardDescription className="flex items-center gap-1 font-medium">
                      <Briefcase className="h-3.5 w-3.5" /> {job.company}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="flex-1">
                    <div className="space-y-3 mb-4">
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <MapPin className="h-4 w-4" /> {job.location}
                      </div>
                      <div className="flex items-center gap-2 text-sm text-emerald-600 dark:text-emerald-400 font-semibold">
                        <DollarSign className="h-4 w-4" /> 
                        {job.salary_min ? (
                          `₹${(job.salary_min / 100000).toFixed(1)}L ${job.salary_max ? `- ${(job.salary_max / 100000).toFixed(1)}L` : '+'}`
                        ) : (
                          "Competitive Pay"
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-muted-foreground line-clamp-2">
                      {job.description}
                    </p>
                  </CardContent>
                  <CardFooter className="pt-0">
                    <Button 
                      className="w-full rounded-xl" 
                      variant="outline" 
                      onClick={() => window.open(job.apply_link, "_blank", "noopener,noreferrer")}
                    >
                      Apply Now <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full text-center py-20">
              <p className="text-xl text-muted-foreground">No jobs found matching your search.</p>
              <Button variant="link" onClick={() => setSearch("")}>Clear search</Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default function JobsPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 pt-32 pb-20">
      <Suspense fallback={<div className="container mx-auto px-4 pt-20 text-center">Loading jobs...</div>}>
        <JobsList />
      </Suspense>
      
      <div className="fixed bottom-8 right-8">
        <Button className="rounded-full h-14 w-14 shadow-2xl" onClick={() => window.location.href = "/feed"}>
          <Zap className="h-6 w-6" />
        </Button>
      </div>
    </div>
  );
}
