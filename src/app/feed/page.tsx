"use client";

import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Heart, 
  Share2, 
  Briefcase, 
  MapPin, 
  DollarSign, 
  ChevronUp, 
  ChevronDown,
  Sparkles,
  ExternalLink
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

interface Job {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  salary_min: number;
  salary_max: number;
  apply_link: string;
}

export default function FeedPage() {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
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
      
      if (data) {
        setJobs(data as Job[]);
      }
    } catch (err) {
      console.error("Failed to fetch jobs", err);
      toast.error("Failed to load jobs. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  const filteredJobs = jobs.filter(job => {
    const isIndia = job.location?.toLowerCase().includes('india') || job.location?.toLowerCase().includes('remote');
    const matchesIndia = !indiaOnly || isIndia;

    const postDate = new Date((job as any).posted_at || (job as any).created_at);
    const fourDaysAgo = new Date();
    fourDaysAgo.setDate(fourDaysAgo.getDate() - 4);
    const isRecent = postDate >= fourDaysAgo;
    const matchesRecent = !recentOnly || isRecent;

    return matchesIndia && matchesRecent;
  });

  const nextJob = () => {
    if (currentIndex < filteredJobs.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      toast.info("You've reached the end of the feed!");
    }
  };

  const prevJob = () => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-zinc-950 text-white">
        <Sparkles className="h-12 w-12 animate-pulse text-primary" />
      </div>
    );
  }

  if (filteredJobs.length === 0) {
    return (
      <div className="flex h-screen flex-col items-center justify-center bg-zinc-950 text-white gap-4">
        <h2 className="text-2xl font-bold">No jobs found</h2>
        <div className="flex gap-4">
          <Button variant="outline" onClick={() => window.open(filteredJobs[currentIndex].apply_link, "_blank", "noopener,noreferrer")}>Reset Filters</Button>
          <Button onClick={() => window.location.href = "/"}>Back to Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen w-full bg-zinc-950 overflow-hidden relative font-sans">
      {/* Background Glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-[20%] left-[10%] h-[400px] w-[400px] rounded-full bg-primary/20 blur-[120px]" />
        <div className="absolute bottom-[20%] right-[10%] h-[400px] w-[400px] rounded-full bg-purple-600/10 blur-[120px]" />
      </div>

      {/* Filter Overlay */}
      <div className="absolute top-24 left-1/2 -translate-x-1/2 z-50 flex gap-2">
        <Button 
          variant={indiaOnly ? "default" : "outline"} 
          size="sm" 
          className="rounded-full bg-zinc-900/50 border-white/20 text-white"
          onClick={() => { setIndiaOnly(!indiaOnly); setCurrentIndex(0); }}
        >
          🇮🇳 India
        </Button>
        <Button 
          variant={recentOnly ? "default" : "outline"} 
          size="sm" 
          className="rounded-full bg-zinc-900/50 border-white/20 text-white"
          onClick={() => { setRecentOnly(!recentOnly); setCurrentIndex(0); }}
        >
          🕒 Last 4 Days
        </Button>
      </div>

      {/* Navigation Controls */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 z-50 flex flex-col gap-4">
        <Button 
          variant="outline" 
          size="icon" 
          onClick={prevJob}
          className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12"
          disabled={currentIndex === 0}
        >
          <ChevronUp />
        </Button>
        <Button 
          variant="outline" 
          size="icon" 
          onClick={nextJob}
          className="rounded-full bg-white/10 border-white/20 text-white hover:bg-white/20 h-12 w-12"
          disabled={currentIndex === filteredJobs.length - 1}
        >
          <ChevronDown />
        </Button>
      </div>

      <div className="h-full w-full flex items-center justify-center p-4">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentIndex}
            initial={{ opacity: 0, y: 100 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full max-w-lg aspect-[9/16] max-h-[850px] relative rounded-[2.5rem] overflow-hidden border border-white/10 shadow-2xl bg-zinc-900 group"
          >
            {/* Job Header Info */}
            <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent flex flex-col justify-end p-8 gap-6">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2 }}
              >
                <div className="flex gap-2 mb-4">
                  <Badge className="bg-primary hover:bg-primary/90 text-white px-3 py-1">
                    Fresher Role
                  </Badge>
                  {new Date((filteredJobs[currentIndex] as any).posted_at) >= new Date(Date.now() - 4 * 24 * 60 * 60 * 1000) && (
                    <Badge className="bg-orange-500 hover:bg-orange-600 text-white px-3 py-1">
                      New
                    </Badge>
                  )}
                </div>
                <h2 className="text-4xl font-extrabold text-white tracking-tight mb-2">
                  {filteredJobs[currentIndex].title}
                </h2>
                <div className="flex items-center gap-2 text-zinc-300 font-medium text-lg">
                  <Briefcase className="h-5 w-5 text-primary" />
                  {filteredJobs[currentIndex].company}
                </div>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="flex flex-wrap gap-3"
              >
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm border border-white/10">
                  <MapPin className="h-4 w-4" /> {filteredJobs[currentIndex].location}
                </div>
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white/10 backdrop-blur-md text-white text-sm border border-white/10">
                    <DollarSign className="h-4 w-4" /> {filteredJobs[currentIndex].salary_min ? `₹${(filteredJobs[currentIndex].salary_min / 100000).toFixed(1)}L+` : 'Competitive Pay'}
                  </div>
                </motion.div>

                <motion.p 
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-zinc-400 text-sm line-clamp-3 leading-relaxed"
                >
                  {filteredJobs[currentIndex].description}
                </motion.p>

                <motion.div 
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="flex gap-3"
                >
                  <Button 
                    className="flex-1 h-14 rounded-2xl text-lg font-bold shadow-lg"
                    onClick={() => window.parent.postMessage({ type: "OPEN_EXTERNAL_URL", data: { url: filteredJobs[currentIndex].apply_link } }, "*")}
                  >
                    Apply Now <ExternalLink className="ml-2 h-5 w-5" />
                  </Button>

                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 rounded-2xl border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  <Heart className="h-6 w-6" />
                </Button>
                <Button 
                  variant="outline" 
                  size="icon" 
                  className="h-14 w-14 rounded-2xl border-white/20 bg-white/10 hover:bg-white/20 text-white"
                >
                  <Share2 className="h-6 w-6" />
                </Button>
              </motion.div>
            </div>
            
            {/* Visual Flare */}
            <div className="absolute top-8 left-8">
              <div className="h-12 w-12 rounded-2xl bg-white/10 backdrop-blur-xl border border-white/20 flex items-center justify-center font-bold text-white text-xl">
                JJ
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Header Overlay */}
      <div className="absolute top-8 left-8 z-50 hidden md:block">
        <h1 className="text-white text-2xl font-bold flex items-center gap-2">
          <Sparkles className="text-primary h-6 w-6" /> Job Reels
        </h1>
      </div>

      {/* Back Button */}
      <div className="absolute top-8 right-8 z-50">
        <Button 
          variant="ghost" 
          className="text-white hover:bg-white/10"
          onClick={() => window.location.href = "/"}
        >
          Back to Home
        </Button>
      </div>
    </div>
  );
}
