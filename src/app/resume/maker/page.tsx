"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Plus, 
  Trash2, 
  Download, 
  Layout, 
  User, 
  Briefcase, 
  GraduationCap, 
  Wrench, 
  Eye, 
  FileText,
  ChevronLeft,
  ChevronRight,
  Templates,
  Upload,
  Loader2,
  Sparkles,
  ExternalLink,
  Award,
  Languages,
  Certificate,
  Globe
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import Link from "next/link";

interface ResumeData {
  personalInfo: {
    fullName: string;
    email: string;
    phone: string;
    location: string;
    website: string;
    summary: string;
  };
  experience: {
    company: string;
    position: string;
    duration: string;
    description: string;
    link?: string;
  }[];
  projects: {
    name: string;
    link: string;
    duration: string;
    description: string;
  }[];
  education: {
    school: string;
    degree: string;
    duration: string;
    description: string;
  }[];
  skills: string[];
  certifications: {
    name: string;
    issuer: string;
    date: string;
  }[];
  languages: {
    name: string;
    proficiency: string;
  }[];
  awards: {
    title: string;
    date: string;
    description: string;
  }[];
}

const initialData: ResumeData = {
  personalInfo: {
    fullName: "John Doe",
    email: "john@example.com",
    phone: "+91 98765 43210",
    location: "Mumbai, India",
    website: "linkedin.com/in/johndoe",
    summary: "Aspiring software developer with a passion for building scalable web applications and solving complex problems."
  },
  experience: [
    {
      company: "Tech Solutions Inc.",
      position: "Junior Developer Intern",
      duration: "Jan 2024 - Present",
      description: "Working on React and Next.js applications, improving performance by 20%."
    }
  ],
  projects: [
    {
      name: "Portfolio Website",
      link: "https://portfolio.me",
      duration: "2023",
      description: "A high-performance portfolio built with Next.js and Framer Motion."
    }
  ],
  education: [
    {
      school: "University of Technology",
      degree: "B.Tech in Computer Science",
      duration: "2020 - 2024",
      description: "GPA: 3.8/4.0. Relevant coursework: Data Structures, Algorithms, Web Dev."
    }
  ],
  skills: ["React", "TypeScript", "Node.js", "Tailwind CSS", "Python"],
  certifications: [
    { name: "AWS Certified Developer", issuer: "Amazon Web Services", date: "2023" }
  ],
  languages: [
    { name: "English", proficiency: "Native" },
    { name: "Hindi", proficiency: "Fluent" }
  ],
  awards: [
    { title: "Dean's List", date: "2022", description: "Top 5% of the class for academic excellence." }
  ]
};

const sampleResumes = [
  {
    id: "software-engineer",
    name: "Software Engineer",
    role: "Tech",
    data: {
      ...initialData,
      personalInfo: {
        fullName: "Aryan Sharma",
        email: "aryan.sharma@example.com",
        phone: "+91 99999 88888",
        location: "Bengaluru, India",
        website: "github.com/aryans",
        summary: "Full-stack developer with 3+ years of experience in building scalable microservices and responsive web applications. Expert in React, Node.js, and Cloud architectures."
      },
      experience: [
        {
          company: "Unicorn Tech",
          position: "SDE-2",
          duration: "June 2022 - Present",
          description: "Led the development of a real-time analytics dashboard using Next.js and Go.\nOptimized database queries reducing latency by 40%."
        }
      ],
      skills: ["Go", "React", "PostgreSQL", "Docker", "AWS", "Redis", "TypeScript"]
    }
  },
  {
    id: "marketing",
    name: "Marketing Specialist",
    role: "Business",
    data: {
      ...initialData,
      personalInfo: {
        fullName: "Priya Singh",
        email: "priya.mkt@example.com",
        phone: "+91 88888 77777",
        location: "Delhi, India",
        website: "priyamarketing.com",
        summary: "Creative marketing professional with a track record of increasing brand engagement by 150% through data-driven campaigns and social media strategy."
      },
      experience: [
        {
          company: "Global Brands Co.",
          position: "Senior Marketing Manager",
          duration: "Mar 2021 - Present",
          description: "Managed a budget of ₹50L for digital marketing campaigns across social media.\nIncreased organic traffic by 200% in 12 months."
        }
      ],
      skills: ["SEO", "Content Strategy", "Google Analytics", "Brand Management", "Social Media", "Copywriting"]
    }
  }
];

const templates = [
  { id: "modern", name: "Modern Professional", preview: "bg-zinc-100" },
  { id: "minimal", name: "Minimalist", preview: "bg-white" },
  { id: "creative", name: "Creative Bold", preview: "bg-primary/5" },
  { id: "ats", name: "Classic ATS", preview: "bg-zinc-50 border-dashed" },
  { id: "executive", name: "Executive", preview: "bg-slate-900" }
];

export default function ResumeMaker() {
  const [data, setData] = useState<ResumeData>(initialData);
  const [activeTemplate, setActiveTemplate] = useState("modern");
  const [activeTab, setActiveTab] = useState("personal");
  const [showPreview, setShowPreview] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const resumeRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handlePersonalInfoChange = (field: keyof ResumeData["personalInfo"], value: string) => {
    setData(prev => ({
      ...prev,
      personalInfo: { ...prev.personalInfo, [field]: value }
    }));
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const response = await fetch("/api/resume/extract", {
        method: "POST",
        body: formData,
      });

      if (response.ok) {
        const { text } = await response.json();
        setData(prev => ({
          ...prev,
          personalInfo: {
            ...prev.personalInfo,
            summary: text.slice(0, 500) + "..."
          }
        }));
        setActiveTab("personal");
        alert("Text extracted! We've updated your summary with the content.");
      }
    } catch (error) {
      console.error("Upload error:", error);
      alert("Failed to extract text from resume.");
    } finally {
      setIsUploading(false);
    }
  };

  const loadSample = (sample: any) => {
    setData(sample.data);
    setActiveTab("personal");
  };

  const handleExperienceChange = (index: number, field: string, value: string) => {
    const newExp = [...data.experience];
    newExp[index] = { ...newExp[index], [field]: value };
    setData(prev => ({ ...prev, experience: newExp }));
  };

  const addExperience = () => {
    setData(prev => ({
      ...prev,
      experience: [...prev.experience, { company: "", position: "", duration: "", description: "" }]
    }));
  };

  const removeExperience = (index: number) => {
    setData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index)
    }));
  };

  const handleProjectChange = (index: number, field: string, value: string) => {
    const newProj = [...data.projects];
    newProj[index] = { ...newProj[index], [field]: value };
    setData(prev => ({ ...prev, projects: newProj }));
  };

  const addProject = () => {
    setData(prev => ({
      ...prev,
      projects: [...prev.projects, { name: "", link: "", duration: "", description: "" }]
    }));
  };

  const removeProject = (index: number) => {
    setData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index)
    }));
  };

  const handleEducationChange = (index: number, field: string, value: string) => {
    const newEdu = [...data.education];
    newEdu[index] = { ...newEdu[index], [field]: value };
    setData(prev => ({ ...prev, education: newEdu }));
  };

  const addEducation = () => {
    setData(prev => ({
      ...prev,
      education: [...prev.education, { school: "", degree: "", duration: "", description: "" }]
    }));
  };

  const removeEducation = (index: number) => {
    setData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== index)
    }));
  };

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...data.skills];
    newSkills[index] = value;
    setData(prev => ({ ...prev, skills: newSkills }));
  };

  const addSkill = () => {
    setData(prev => ({ ...prev, skills: [...prev.skills, ""] }));
  };

  const removeSkill = (index: number) => {
    setData(prev => ({ ...prev, skills: prev.skills.filter((_, i) => i !== index) }));
  };

  const handleCertificationChange = (index: number, field: string, value: string) => {
    const newCert = [...data.certifications];
    newCert[index] = { ...newCert[index], [field]: value };
    setData(prev => ({ ...prev, certifications: newCert }));
  };

  const addCertification = () => {
    setData(prev => ({
      ...prev,
      certifications: [...prev.certifications, { name: "", issuer: "", date: "" }]
    }));
  };

  const removeCertification = (index: number) => {
    setData(prev => ({
      ...prev,
      certifications: prev.certifications.filter((_, i) => i !== index)
    }));
  };

  const handleLanguageChange = (index: number, field: string, value: string) => {
    const newLang = [...data.languages];
    newLang[index] = { ...newLang[index], [field]: value };
    setData(prev => ({ ...prev, languages: newLang }));
  };

  const addLanguage = () => {
    setData(prev => ({
      ...prev,
      languages: [...prev.languages, { name: "", proficiency: "" }]
    }));
  };

  const removeLanguage = (index: number) => {
    setData(prev => ({
      ...prev,
      languages: prev.languages.filter((_, i) => i !== index)
    }));
  };

  const handleAwardChange = (index: number, field: string, value: string) => {
    const newAward = [...data.awards];
    newAward[index] = { ...newAward[index], [field]: value };
    setData(prev => ({ ...prev, awards: newAward }));
  };

  const addAward = () => {
    setData(prev => ({
      ...prev,
      awards: [...prev.awards, { title: "", date: "", description: "" }]
    }));
  };

  const removeAward = (index: number) => {
    setData(prev => ({
      ...prev,
      awards: prev.awards.filter((_, i) => i !== index)
    }));
  };

  const fetchAIRecipes = async () => {
    setIsUploading(true);
    setTimeout(() => {
      setData(prev => ({
        ...prev,
        personalInfo: {
          ...prev.personalInfo,
          summary: "Highly motivated " + (data.experience[0]?.position || "professional") + " with a proven track record of success in building impactful solutions. Expert in leveraging modern technologies to drive efficiency and innovation."
        },
        skills: [...new Set([...prev.skills, "AI Prompting", "Problem Solving", "Strategic Planning"])]
      }));
      setIsUploading(false);
      alert("AI suggestions applied to your summary and skills!");
    }, 1500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-background text-foreground">
      <nav className="fixed top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md print:hidden">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Link href="/">
              <Button variant="ghost" size="sm">
                <ChevronLeft className="mr-2 h-4 w-4" /> Back
              </Button>
            </Link>
            <div className="h-6 w-px bg-border" />
            <h1 className="font-bold text-lg hidden md:block">Resume Maker AI</h1>
          </div>

          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setShowPreview(!showPreview)}
              className="md:hidden"
            >
              {showPreview ? <Layout className="mr-2 h-4 w-4" /> : <Eye className="mr-2 h-4 w-4" />}
              {showPreview ? "Editor" : "Preview"}
            </Button>
            <Button variant="default" size="sm" onClick={handlePrint}>
              <Download className="mr-2 h-4 w-4" /> Export PDF
            </Button>
          </div>
        </div>
      </nav>

      <div className="container mx-auto pt-24 pb-12 px-4 grid md:grid-cols-2 gap-8 items-start">
        <div className={`space-y-6 print:hidden ${showPreview ? "hidden" : "block"} md:block`}>
          <Card className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid grid-cols-4 lg:grid-cols-7 mb-8 gap-1 h-auto">
                <TabsTrigger value="samples" className="py-2"><Sparkles className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="personal" className="py-2"><User className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="experience" className="py-2"><Briefcase className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="projects" className="py-2"><Globe className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="education" className="py-2"><GraduationCap className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="skills" className="py-2"><Wrench className="h-4 w-4" /></TabsTrigger>
                <TabsTrigger value="extras" className="py-2"><Award className="h-4 w-4" /></TabsTrigger>
              </TabsList>

              <TabsContent value="samples" className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Import Existing Resume</Label>
                    <input type="file" ref={fileInputRef} className="hidden" accept=".pdf" onChange={handleFileUpload} />
                    <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()} disabled={isUploading}>
                      {isUploading ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Upload className="mr-2 h-4 w-4" />}
                      Upload PDF
                    </Button>
                  </div>
                  <Button variant="secondary" size="sm" className="w-full" onClick={fetchAIRecipes} disabled={isUploading}>
                    <Sparkles className="mr-2 h-4 w-4" /> Fetch AI Suggestions
                  </Button>
                </div>

                <div className="space-y-4 pt-4 border-t">
                  <Label className="text-base font-bold">Quick Start Samples</Label>
                  <div className="grid grid-cols-1 gap-3">
                    {sampleResumes.map((sample) => (
                      <button key={sample.id} onClick={() => loadSample(sample)} className="flex items-center justify-between p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 transition-all group">
                        <div className="flex items-center gap-3">
                          <div className="p-2 rounded-lg bg-primary/10 text-primary"><FileText className="h-5 w-5" /></div>
                          <div className="text-left">
                            <p className="font-semibold">{sample.name}</p>
                            <Badge variant="secondary" className="text-[10px] uppercase tracking-wider">{sample.role}</Badge>
                          </div>
                        </div>
                        <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-colors" />
                      </button>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="personal" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Full Name</Label><Input value={data.personalInfo.fullName} onChange={(e) => handlePersonalInfoChange("fullName", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Email</Label><Input value={data.personalInfo.email} onChange={(e) => handlePersonalInfoChange("email", e.target.value)} /></div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2"><Label>Phone</Label><Input value={data.personalInfo.phone} onChange={(e) => handlePersonalInfoChange("phone", e.target.value)} /></div>
                  <div className="space-y-2"><Label>Location</Label><Input value={data.personalInfo.location} onChange={(e) => handlePersonalInfoChange("location", e.target.value)} /></div>
                </div>
                <div className="space-y-2"><Label>Website / LinkedIn</Label><Input value={data.personalInfo.website} onChange={(e) => handlePersonalInfoChange("website", e.target.value)} /></div>
                <div className="space-y-2"><Label>Professional Summary</Label><Textarea rows={4} value={data.personalInfo.summary} onChange={(e) => handlePersonalInfoChange("summary", e.target.value)} /></div>
              </TabsContent>

              <TabsContent value="experience" className="space-y-6">
                {data.experience.map((exp, index) => (
                  <div key={index} className="p-4 border rounded-xl relative group">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => removeExperience(index)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2"><Label>Company</Label><Input value={exp.company} onChange={(e) => handleExperienceChange(index, "company", e.target.value)} /></div>
                      <div className="space-y-2"><Label>Position</Label><Input value={exp.position} onChange={(e) => handleExperienceChange(index, "position", e.target.value)} /></div>
                    </div>
                    <div className="space-y-2 mb-4"><Label>Duration</Label><Input value={exp.duration} onChange={(e) => handleExperienceChange(index, "duration", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={exp.description} onChange={(e) => handleExperienceChange(index, "description", e.target.value)} /></div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addExperience}><Plus className="mr-2 h-4 w-4" /> Add Experience</Button>
              </TabsContent>

              <TabsContent value="projects" className="space-y-6">
                {data.projects.map((proj, index) => (
                  <div key={index} className="p-4 border rounded-xl relative group">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => removeProject(index)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2"><Label>Project Name</Label><Input value={proj.name} onChange={(e) => handleProjectChange(index, "name", e.target.value)} /></div>
                      <div className="space-y-2"><Label>Link</Label><Input value={proj.link} onChange={(e) => handleProjectChange(index, "link", e.target.value)} /></div>
                    </div>
                    <div className="space-y-2 mb-4"><Label>Duration</Label><Input value={proj.duration} onChange={(e) => handleProjectChange(index, "duration", e.target.value)} /></div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={proj.description} onChange={(e) => handleProjectChange(index, "description", e.target.value)} /></div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addProject}><Plus className="mr-2 h-4 w-4" /> Add Project</Button>
              </TabsContent>

              <TabsContent value="education" className="space-y-6">
                {data.education.map((edu, index) => (
                  <div key={index} className="p-4 border rounded-xl relative group">
                    <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => removeEducation(index)}><Trash2 className="h-4 w-4" /></Button>
                    <div className="grid grid-cols-2 gap-4 mb-4">
                      <div className="space-y-2"><Label>School</Label><Input value={edu.school} onChange={(e) => handleEducationChange(index, "school", e.target.value)} /></div>
                      <div className="space-y-2"><Label>Degree</Label><Input value={edu.degree} onChange={(e) => handleEducationChange(index, "degree", e.target.value)} /></div>
                    </div>
                    <div className="space-y-2"><Label>Description</Label><Textarea value={edu.description} onChange={(e) => handleEducationChange(index, "description", e.target.value)} /></div>
                  </div>
                ))}
                <Button variant="outline" className="w-full" onClick={addEducation}><Plus className="mr-2 h-4 w-4" /> Add Education</Button>
              </TabsContent>

              <TabsContent value="skills" className="space-y-4">
                <div className="flex flex-wrap gap-2">
                  {data.skills.map((skill, index) => (
                    <div key={index} className="flex items-center gap-2 bg-muted p-1 rounded-lg">
                      <Input value={skill} onChange={(e) => handleSkillChange(index, e.target.value)} className="h-8 w-32 border-none bg-transparent focus-visible:ring-0 px-2" />
                      <Button variant="ghost" size="icon" className="h-6 w-6 text-destructive" onClick={() => removeSkill(index)}><Trash2 className="h-3 w-3" /></Button>
                    </div>
                  ))}
                  <Button variant="outline" size="sm" onClick={addSkill}><Plus className="h-4 w-4" /></Button>
                </div>
              </TabsContent>

              <TabsContent value="extras" className="space-y-8">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Certifications</Label>
                    <Button variant="outline" size="sm" onClick={addCertification}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                  </div>
                  {data.certifications.map((cert, index) => (
                    <div key={index} className="p-4 border rounded-xl relative group bg-muted/30">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => removeCertification(index)}><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-xs">Certificate Name</Label><Input value={cert.name} onChange={(e) => handleCertificationChange(index, "name", e.target.value)} /></div>
                        <div className="space-y-2"><Label className="text-xs">Issuer</Label><Input value={cert.issuer} onChange={(e) => handleCertificationChange(index, "issuer", e.target.value)} /></div>
                      </div>
                      <div className="mt-2 space-y-2"><Label className="text-xs">Date</Label><Input value={cert.date} onChange={(e) => handleCertificationChange(index, "date", e.target.value)} /></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Languages</Label>
                    <Button variant="outline" size="sm" onClick={addLanguage}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                  </div>
                  {data.languages.map((lang, index) => (
                    <div key={index} className="flex gap-4 items-end bg-muted/30 p-4 rounded-xl relative group">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => removeLanguage(index)}><Trash2 className="h-4 w-4" /></Button>
                      <div className="flex-1 space-y-2"><Label className="text-xs">Language</Label><Input value={lang.name} onChange={(e) => handleLanguageChange(index, "name", e.target.value)} /></div>
                      <div className="flex-1 space-y-2"><Label className="text-xs">Proficiency</Label><Input value={lang.proficiency} onChange={(e) => handleLanguageChange(index, "proficiency", e.target.value)} /></div>
                    </div>
                  ))}
                </div>
                <div className="space-y-4 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <Label className="text-base font-bold">Awards</Label>
                    <Button variant="outline" size="sm" onClick={addAward}><Plus className="h-4 w-4 mr-2" /> Add</Button>
                  </div>
                  {data.awards.map((award, index) => (
                    <div key={index} className="p-4 border rounded-xl relative group bg-muted/30">
                      <Button variant="ghost" size="icon" className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity text-destructive" onClick={() => removeAward(index)}><Trash2 className="h-4 w-4" /></Button>
                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2"><Label className="text-xs">Award Title</Label><Input value={award.title} onChange={(e) => handleAwardChange(index, "title", e.target.value)} /></div>
                        <div className="space-y-2"><Label className="text-xs">Date</Label><Input value={award.date} onChange={(e) => handleAwardChange(index, "date", e.target.value)} /></div>
                      </div>
                      <div className="mt-2 space-y-2"><Label className="text-xs">Description</Label><Textarea value={award.description} onChange={(e) => handleAwardChange(index, "description", e.target.value)} /></div>
                    </div>
                  ))}
                </div>
              </TabsContent>
            </Tabs>
          </Card>

          <div className="space-y-4">
            <Label className="text-lg font-bold">Choose Template</Label>
            <div className="grid grid-cols-3 gap-4">
              {templates.map((t) => (
                <button key={t.id} onClick={() => setActiveTemplate(t.id)} className={`p-4 rounded-xl border-2 transition-all text-left ${activeTemplate === t.id ? "border-primary bg-primary/5" : "border-border hover:border-primary/50"}`}>
                  <div className={`aspect-[3/4] rounded-md mb-2 ${t.preview} border`} />
                  <span className="text-xs font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className={`sticky top-24 ${!showPreview ? "hidden" : "block"} md:block print:static print:block`}>
          <div ref={resumeRef} className={`w-full min-h-[1100px] bg-white shadow-2xl p-12 text-black origin-top transition-transform print:shadow-none print:w-full print:p-0 print:m-0 ${activeTemplate === "modern" ? "font-sans" : activeTemplate === "minimal" ? "font-serif" : activeTemplate === "ats" ? "font-sans" : "font-mono"}`} style={{ color: "black" }}>
            <div className={`h-full flex flex-col ${activeTemplate === "ats" ? "max-w-[800px] mx-auto" : ""}`}>
              {activeTemplate === "ats" ? (
                <div className="text-center border-b-2 border-black pb-4 mb-6">
                  <h2 className="text-3xl font-bold uppercase mb-1">{data.personalInfo.fullName}</h2>
                  <div className="flex justify-center gap-3 text-sm">
                    <span>{data.personalInfo.email}</span> | <span>{data.personalInfo.phone}</span> | <span>{data.personalInfo.location}</span>
                  </div>
                  {data.personalInfo.website && <div className="text-sm mt-1">{data.personalInfo.website}</div>}
                </div>
              ) : (
                <div className={`mb-8 ${activeTemplate === "creative" ? "bg-zinc-900 text-white p-8 -mx-12 -mt-12 mb-12" : activeTemplate === "executive" ? "bg-slate-900 text-white p-10 -mx-12 -mt-12 mb-12 border-b-8 border-[#D4AF37]" : ""}`}>
                  <h2 className="text-4xl font-black mb-2 uppercase tracking-tight">{data.personalInfo.fullName}</h2>
                  <div className="flex flex-wrap gap-4 text-sm opacity-80">
                    <span>{data.personalInfo.email}</span>
                    <span>{data.personalInfo.phone}</span>
                    <span>{data.personalInfo.location}</span>
                    {data.personalInfo.website && <span className="flex items-center gap-1 hover:underline cursor-pointer"><ExternalLink className="h-3 w-3" /> {data.personalInfo.website}</span>}
                  </div>
                </div>
              )}

              {data.personalInfo.summary && (
                <div className="mb-6">
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-2 ${activeTemplate === "modern" ? "text-primary" : "border-b pb-1"}`}>Summary</h3>
                  <p className="text-sm leading-relaxed text-zinc-800">{data.personalInfo.summary}</p>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${activeTemplate === "modern" ? "text-primary" : "border-b pb-1"}`}>Experience</h3>
                <div className="space-y-4">
                  {data.experience.map((exp, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold">{exp.position}</h4>
                        <span className="text-xs font-medium text-zinc-600">{exp.duration}</span>
                      </div>
                      <p className="text-sm font-semibold italic">{exp.company}</p>
                      <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-line mt-1">{exp.description}</p>
                    </div>
                  ))}
                </div>
              </div>

              {data.projects.length > 0 && (
                <div className="mb-6">
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${activeTemplate === "modern" ? "text-primary" : "border-b pb-1"}`}>Projects</h3>
                  <div className="space-y-4">
                    {data.projects.map((proj, i) => (
                      <div key={i}>
                        <div className="flex justify-between items-baseline">
                          <div className="flex items-center gap-2">
                            <h4 className="font-bold">{proj.name}</h4>
                            {proj.link && <span className="text-[10px] text-blue-600 hover:underline flex items-center gap-1"><ExternalLink className="h-2 w-2" /> Link</span>}
                          </div>
                          <span className="text-xs font-medium text-zinc-600">{proj.duration}</span>
                        </div>
                        <p className="text-sm text-zinc-800 leading-relaxed whitespace-pre-line mt-1">{proj.description}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mb-6">
                <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${activeTemplate === "modern" ? "text-primary" : "border-b pb-1"}`}>Education</h3>
                <div className="space-y-3">
                  {data.education.map((edu, i) => (
                    <div key={i}>
                      <div className="flex justify-between items-baseline">
                        <h4 className="font-bold">{edu.degree}</h4>
                        <span className="text-xs font-medium text-zinc-600">{edu.duration}</span>
                      </div>
                      <p className="text-sm font-semibold italic">{edu.school}</p>
                      {edu.description && <p className="text-sm text-zinc-800 leading-relaxed mt-1">{edu.description}</p>}
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div>
                  <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${activeTemplate === "modern" ? "text-primary" : "border-b pb-1"}`}>Skills</h3>
                  <div className="flex flex-wrap gap-x-2 gap-y-1">
                    {data.skills.map((skill, i) => (
                      <span key={i} className="text-sm">• {skill}</span>
                    ))}
                  </div>
                </div>
                {(data.languages.length > 0 || data.certifications.length > 0 || data.awards.length > 0) && (
                  <div>
                    <h3 className={`text-sm font-bold uppercase tracking-widest mb-3 ${activeTemplate === "modern" ? "text-primary" : "border-b pb-1"}`}>Additional</h3>
                    <div className="space-y-4">
                      {data.languages.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase mb-1">Languages</h4>
                          <div className="flex flex-wrap gap-x-2 gap-y-1">
                            {data.languages.map((lang, i) => (
                              <span key={i} className="text-xs">• {lang.name} ({lang.proficiency})</span>
                            ))}
                          </div>
                        </div>
                      )}
                      {data.certifications.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase mb-1">Certifications</h4>
                          {data.certifications.map((cert, i) => (
                            <p key={i} className="text-xs">• {cert.name} ({cert.issuer})</p>
                          ))}
                        </div>
                      )}
                      {data.awards.length > 0 && (
                        <div>
                          <h4 className="text-[10px] font-bold uppercase mb-1">Awards</h4>
                          {data.awards.map((award, i) => (
                            <p key={i} className="text-xs">• {award.title} ({award.date})</p>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @media print {
          body * { visibility: hidden; }
          .print\:block, .print\:block * { visibility: visible; }
          .print\:block { position: absolute; left: 0; top: 0; width: 100%; padding: 40px !important; }
          @page { size: A4; margin: 0; }
        }
      `}</style>
    </div>
  );
}
