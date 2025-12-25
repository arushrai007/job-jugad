"use client";

import { useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { motion, AnimatePresence } from "framer-motion";
import { 
  FileText, 
  Upload, 
  CheckCircle2, 
  Sparkles,
  Zap,
  Briefcase,
  AlertCircle,
  Loader2,
  FileUp,
  X
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { toast } from "sonner";

export default function ResumePage() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [score, setScore] = useState<number | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [foundSkills, setFoundSkills] = useState<string[]>([]);
  const [missingSkills, setMissingSkills] = useState<string[]>([]);
  const [resumeText, setResumeText] = useState("");
  const [jobDesc, setJobDesc] = useState("");
  const [fileName, setFileName] = useState<string | null>(null);
  const [isManualMode, setIsManualMode] = useState(false);

  const onDrop = useCallback(async (acceptedFiles: File[]) => {
    const file = acceptedFiles[0];
    if (!file) return;

    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported for now");
      return;
    }

    setUploading(true);
    setFileName(file.name);
    setIsManualMode(false);
    
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/resume/extract", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) throw new Error("Failed to extract text");

      const data = await res.json();
      setResumeText(data.text);
      toast.success("Resume text extracted successfully!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to parse resume PDF");
      setFileName(null);
    } finally {
      setUploading(false);
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'application/pdf': ['.pdf'] },
    multiple: false,
    disabled: uploading
  });

  const handleMatch = async () => {
    if (!resumeText.trim() || !jobDesc.trim()) {
      toast.error("Please provide both resume and job description");
      return;
    }
    
    setLoading(true);
    try {
      const res = await fetch("/api/resume/match", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          resume_text: resumeText,
          job_description: jobDesc
        })
      });
      
      if (!res.ok) throw new Error("Match failed");
      
      const data = await res.json();
      setScore(data.match_score);
      setAnalysis(data.analysis);
      setFoundSkills(data.found_skills || []);
      setMissingSkills(data.missing_skills || []);
      toast.success("Match analysis complete!");
    } catch (err) {
      console.error(err);
      toast.error("Failed to connect to AI service");
    } finally {
      setLoading(false);
    }
  };

  const clearResume = () => {
    setResumeText("");
    setFileName(null);
    setIsManualMode(false);
    setScore(null);
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-white selection:bg-primary pt-32 pb-20">
      <div className="container mx-auto px-4 max-w-5xl">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <Badge className="mb-4 bg-primary/20 text-primary hover:bg-primary/30 border-primary/20">
            Resume Matcher AI
          </Badge>
          <h1 className="text-5xl md:text-6xl font-black tracking-tight mb-6">
            Score Your <span className="text-primary">Skills</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Our NLP model analyzes your resume against any job description to give you a real-time compatibility score.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-10">
          <div className="space-y-6">
            <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <FileText className="text-primary h-5 w-5" />
                  <h3 className="font-bold">Your Resume</h3>
                </div>
                {fileName && (
                  <Badge variant="secondary" className="bg-white/5 text-zinc-400 flex items-center gap-1 py-1">
                    <CheckCircle2 className="h-3 w-3 text-emerald-500" />
                    {fileName}
                    <button onClick={clearResume} className="ml-1 hover:text-white">
                      <X className="h-3 w-3" />
                    </button>
                  </Badge>
                )}
              </div>

              {!resumeText && !isManualMode ? (
                <div 
                  {...getRootProps()} 
                  className={`
                    h-64 rounded-2xl border-2 border-dashed transition-all flex flex-col items-center justify-center cursor-pointer
                    ${isDragActive ? "border-primary bg-primary/5" : "border-white/5 bg-zinc-800 hover:border-white/20"}
                    ${uploading ? "pointer-events-none opacity-50" : ""}
                  `}
                >
                  <input {...getInputProps()} />
                  {uploading ? (
                    <>
                      <Loader2 className="h-10 w-10 text-primary animate-spin mb-4" />
                      <p className="text-zinc-400 animate-pulse">Extracting text...</p>
                    </>
                  ) : (
                    <>
                      <div className="p-4 rounded-full bg-primary/10 mb-4 group-hover:scale-110 transition-transform">
                        <FileUp className="h-8 w-8 text-primary" />
                      </div>
                      <p className="font-medium mb-1">Upload PDF Resume</p>
                      <p className="text-xs text-zinc-500">Drag & drop or click to select</p>
                    </>
                  )}
                </div>
              ) : (
                <div className="relative group animate-in fade-in zoom-in duration-300">
                  <textarea 
                    className="w-full h-64 bg-zinc-800 rounded-2xl border-white/5 p-4 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-none"
                    placeholder="Paste or edit your resume text here..."
                    value={resumeText}
                    onChange={(e) => setResumeText(e.target.value)}
                  />
                  <div className="absolute top-2 right-2 flex gap-2">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="text-zinc-500 hover:text-white h-8 bg-zinc-900/50 backdrop-blur-sm"
                      onClick={clearResume}
                    >
                      {fileName ? "Clear File" : "Back to Upload"}
                    </Button>
                  </div>
                </div>
              )}
              
              {!resumeText && !isManualMode && (
                <div className="mt-4 text-center">
                  <button 
                    onClick={() => setIsManualMode(true)} 
                    className="text-xs text-zinc-500 hover:text-primary transition-colors underline underline-offset-4"
                  >
                    Or paste text manually
                  </button>
                </div>
              )}
            </div>
            
            <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10">
              <div className="flex items-center gap-3 mb-4">
                <Briefcase className="text-primary h-5 w-5" />
                <h3 className="font-bold">Job Description</h3>
              </div>
              <textarea 
                className="w-full h-64 bg-zinc-800 rounded-2xl border-white/5 p-4 text-sm text-zinc-300 focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                placeholder="Paste the job requirements here..."
                value={jobDesc}
                onChange={(e) => setJobDesc(e.target.value)}
              />
            </div>
          </div>

          <div className="relative">
            <div className="sticky top-32 space-y-8">
              <Button 
                onClick={handleMatch}
                disabled={loading || uploading}
                className="w-full h-16 rounded-3xl text-xl font-bold shadow-2xl shadow-primary/20 group"
              >
                {loading ? "AI is Analyzing..." : "Calculate Match Score"}
                <Zap className="ml-2 h-6 w-6 group-hover:scale-125 transition-transform" />
              </Button>

              <AnimatePresence mode="wait">
                {score !== null ? (
                  <motion.div 
                    key="results"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    className="p-10 rounded-[3rem] bg-zinc-900 border border-white/10 text-center relative overflow-hidden"
                  >
                    <div className="absolute inset-0 bg-primary/5 blur-[80px] -z-10" />
                    <h4 className="text-zinc-500 font-medium mb-2 uppercase tracking-widest text-xs">Match Probability</h4>
                    <div className="text-8xl font-black text-white mb-6">
                      {score}%
                    </div>
                    <Progress value={score} className="h-4 rounded-full mb-8 bg-zinc-800" />
                    
                    {analysis && (
                      <div className="p-6 rounded-2xl bg-primary/5 border border-primary/10 text-sm text-zinc-300 mb-8 text-left">
                        {analysis}
                      </div>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-left mb-8">
                      <div className="p-4 rounded-2xl bg-white/5">
                        <CheckCircle2 className="h-5 w-5 text-emerald-500 mb-2" />
                        <div className="text-xs text-zinc-500">Keywords Found</div>
                          <div className="font-bold text-sm truncate">
                            {(foundSkills?.length ?? 0) > 0 ? foundSkills.slice(0, 3).join(", ") + (foundSkills.length > 3 ? "..." : "") : "None"}
                          </div>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5">
                          <AlertCircle className="h-5 w-5 text-yellow-500 mb-2" />
                          <div className="text-xs text-zinc-500">Missing Skills</div>
                          <div className="font-bold text-sm truncate">
                            {(missingSkills?.length ?? 0) > 0 ? missingSkills.slice(0, 3).join(", ") + (missingSkills.length > 3 ? "..." : "") : "None"}
                          </div>
                        </div>
                      </div>
  
                      {((foundSkills?.length ?? 0) > 0 || (missingSkills?.length ?? 0) > 0) && (
                        <div className="space-y-4 text-left">
                          {(foundSkills?.length ?? 0) > 0 && (
                            <div>
                              <p className="text-xs text-zinc-500 mb-2 uppercase tracking-tighter">Matching Strengths</p>
                              <div className="flex flex-wrap gap-2">
                                {foundSkills.map(skill => (
                                  <Badge key={skill} variant="secondary" className="bg-emerald-500/10 text-emerald-500 border-none px-2 py-0.5 text-[10px]">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                          {(missingSkills?.length ?? 0) > 0 && (
                            <div>
                              <p className="text-xs text-zinc-500 mb-2 uppercase tracking-tighter">Areas to Improve</p>
                              <div className="flex flex-wrap gap-2">
                                {missingSkills.map(skill => (
                                  <Badge key={skill} variant="secondary" className="bg-rose-500/10 text-rose-500 border-none px-2 py-0.5 text-[10px]">
                                    {skill}
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      )}
  
                      {score < 90 && (
                        <div className="mt-8 pt-8 border-t border-white/5 text-left">
                          <div className="flex items-center gap-2 mb-4">
                            <Sparkles className="h-4 w-4 text-primary" />
                            <h5 className="text-xs font-bold uppercase tracking-widest text-primary">How to reach 90%+</h5>
                          </div>
                          <ul className="space-y-3">
                            <li className="flex gap-3 text-xs text-zinc-400">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                              <span>Integrate the <b>{missingSkills.slice(0, 2).join(" & ")}</b> missing keywords into your "Experience" section.</span>
                            </li>
                            <li className="flex gap-3 text-xs text-zinc-400">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                              <span>Use quantitative metrics (e.g., "Improved performance by 20%") to increase semantic weight.</span>
                            </li>
                            <li className="flex gap-3 text-xs text-zinc-400">
                              <div className="h-1.5 w-1.5 rounded-full bg-primary mt-1 shrink-0" />
                              <span>Ensure your professional summary highlights <b>{foundSkills[0]}</b> as a core competency.</span>
                            </li>
                          </ul>
                        </div>
                      )}
                  </motion.div>
                ) : (
                  <motion.div 
                    key="empty"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="p-10 rounded-[3rem] border border-dashed border-white/10 flex flex-col items-center justify-center text-center h-[500px]"
                  >
                    <Sparkles className="h-16 w-16 text-zinc-800 mb-6" />
                    <p className="text-zinc-600 max-w-xs italic text-lg">
                      Upload your resume and enter the job description to get a comprehensive match analysis.
                    </p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </div>
      
      <div className="fixed top-8 left-8">
        <Button variant="ghost" onClick={() => window.location.href = "/"} className="text-zinc-500 hover:text-white">
          ← Back
        </Button>
      </div>
    </div>
  );
}
