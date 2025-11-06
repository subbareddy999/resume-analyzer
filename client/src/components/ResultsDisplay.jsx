import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Briefcase, Code, GraduationCap, Lightbulb, Star, Target, User } from "lucide-react";
import { ATSCompatibilityCheck } from "./ATSCompatibilityCheck";
import { CircularProgress } from "./CircularProgress";
import { JobMatchResults } from "./JobMatchResults";
import { SkillBadge } from "./SkillBadge";
import { InteractiveTips } from "./InteractiveTips";
import { SkillsChart } from "./SkillsChart";
import { Badge } from "@/components/ui/badge";
import React from "react";

// This component now receives accordion state from its parent (Index.jsx)
export function ResultsDisplay({ analysis, openAccordionItems, setOpenAccordionItems }) {
  if (!analysis) return null;

  const {
    personalDetails = {},
    resumeContent = {},
    skills = {},
    aiFeedback = {},
    jobMatchAnalysis,
    atsAnalysis,
    skillsAnalysis,
  } = analysis;

  return (
    // The ID is here so the PDF export logic in Index.jsx can find it
    <motion.div
      id="analysis-report"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="w-full max-w-7xl mx-auto space-y-8"
    >
      {jobMatchAnalysis && (
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <JobMatchResults data={jobMatchAnalysis} />
        </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.2 }}>
        <Card className="shadow-medium">
          <CardHeader className="pb-6"><CardTitle className="flex items-center gap-2"><Target className="w-5 h-5 text-primary" />AI Feedback & Analysis</CardTitle></CardHeader>
          <CardContent>
              <div className="flex flex-col lg:flex-row gap-8 items-center">
              <div className="flex flex-col items-center">
                  <CircularProgress score={aiFeedback.rating || 0} />
                  <p className="text-sm text-muted-foreground mt-2 font-medium">Resume Score</p>
              </div>
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-x-8 gap-y-6">
                  {aiFeedback.improvementAreas && aiFeedback.improvementAreas.length > 0 && (
                      <div className="md:col-span-2">
                        <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Target className="w-4 h-4 text-primary" />Key Improvement Areas</h4>
                        <ul className="space-y-2">
                        {aiFeedback.improvementAreas.map((tip, index) => (
                            <li key={index} className="text-foreground flex items-start gap-2">
                                <span className="w-1.5 h-1.5 bg-primary rounded-full mt-2 flex-shrink-0" />
                                {tip}
                            </li>
                        ))}
                        </ul>
                      </div>
                  )}
                  <div>
                    <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Lightbulb className="w-4 h-4 text-primary" />Upskilling Suggestions</h4>
                    <ul className="space-y-2">{aiFeedback.upskillingSuggestions?.map((suggestion, index) => (<motion.li key={index} initial={{ opacity: 0, x: 10 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3, delay: 0.5 + index * 0.1 }} className="text-foreground flex items-start gap-2"><span className="w-1.5 h-1.5 bg-success rounded-full mt-2 flex-shrink-0" />{suggestion}</motion.li>))}</ul>
                  </div>
                  {aiFeedback.targetedRoles && aiFeedback.targetedRoles.length > 0 && (
                  <div>
                      <h4 className="font-semibold text-foreground mb-3 flex items-center gap-2"><Star className="w-4 h-4 text-primary" />Targeted Role Suggestions</h4>
                      <div className="flex flex-wrap gap-2">
                      {aiFeedback.targetedRoles.map((role, index) => (
                          <motion.div key={index} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3, delay: 0.7 + index * 0.1 }}>
                          <Badge variant="secondary">{role}</Badge>
                          </motion.div>
                      ))}
                      </div>
                  </div>
                  )}
              </div>
              </div>
          </CardContent>
        </Card>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.3 }}>
             <Card className="shadow-medium h-full">
               <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-primary" />Personal Details</CardTitle></CardHeader>
               <CardContent className="space-y-3">
                 <p className="font-semibold text-foreground text-lg">{personalDetails.name}</p>
                 {personalDetails.email && <p className="text-foreground text-sm">{personalDetails.email}</p>}
                 {personalDetails.phone && <p className="text-foreground text-sm">{personalDetails.phone}</p>}
                 <div className="flex flex-wrap items-center gap-4 pt-2">
                    {personalDetails.linkedin && (
                      <a href={personalDetails.linkedin} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-linkedin"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
                        LinkedIn
                      </a>
                    )}
                    {personalDetails.github && (
                      <a href={personalDetails.github} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-github"><path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4"/></svg>
                        GitHub
                      </a>
                    )}
                    {personalDetails.portfolio && (
                      <a href={personalDetails.portfolio} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 text-sm text-primary hover:underline">
                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-link"><path d="M10 13a5 5 0 0 0 7.54.54l3-3a5 5 0 0 0-7.07-7.07l-1.72 1.72"/><path d="M14 11a5 5 0 0 0-7.54-.54l-3 3a5 5 0 0 0 7.07 7.07l1.72-1.72"/></svg>
                        Portfolio
                      </a>
                    )}
                  </div>
               </CardContent>
             </Card>
          </motion.div>

          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.4 }}>
             <Card className="shadow-medium h-full">
                <CardHeader className="pb-4"><CardTitle className="flex items-center gap-2"><Code className="w-5 h-5 text-primary" />Skills</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h4 className="font-medium text-foreground mb-2">Technical Skills</h4>
                    <div className="flex flex-wrap gap-2">{skills.technicalSkills?.map((skill, index) => (<SkillBadge key={index} skill={skill} index={index} variant="technical" />))}</div>
                  </div>
                  {skills.softSkills && skills.softSkills.length > 0 && (
                    <div>
                      <h4 className="font-medium text-foreground mb-2">Soft Skills</h4>
                      <div className="flex flex-wrap gap-2">{skills.softSkills?.map((skill, index) => (<SkillBadge key={index} skill={skill} index={index} variant="soft" />))}</div>
                    </div>
                  )}
                </CardContent>
             </Card>
          </motion.div>
          {atsAnalysis && (
            <ATSCompatibilityCheck data={atsAnalysis} />
          )}
      </div>

      {aiFeedback.improvementAreas && aiFeedback.improvementAreas.length > 0 && (
        <InteractiveTips tips={aiFeedback.improvementAreas} />
      )}

      {skillsAnalysis && skillsAnalysis.technicalSkills && skillsAnalysis.technicalSkills.length > 0 && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.5 }}>
            <SkillsChart data={skillsAnalysis.technicalSkills} />
          </motion.div>
      )}

      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4, delay: 0.6 }}>
        <Card className="shadow-medium">
          <CardHeader><CardTitle>Detailed Resume Content</CardTitle></CardHeader>
          <CardContent>
            <Accordion type="multiple" value={openAccordionItems} onValueChange={setOpenAccordionItems} className="w-full">
              <AccordionItem value="experience">
                <AccordionTrigger className="text-left"><div className="flex items-center gap-2"><Briefcase className="w-4 h-4 text-primary" />Work Experience ({resumeContent.workExperience?.length || 0})</div></AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">{resumeContent.workExperience?.map((exp, index) => (<div key={index} className="border-l-2 border-primary/20 pl-4"><h4 className="font-semibold text-foreground">{exp.role}</h4><p className="text-primary font-medium">{exp.company}</p><p className="text-sm text-muted-foreground mb-2">{exp.dates}</p><ul className="space-y-1">{exp.description?.map((desc, i) => (<li key={i} className="text-sm text-foreground flex items-start gap-2"><span className="w-1 h-1 bg-muted-foreground rounded-full mt-2 flex-shrink-0" />{desc}</li>))}</ul></div>))}</div>
                </AccordionContent>
              </AccordionItem>
              <AccordionItem value="education">
                <AccordionTrigger className="text-left"><div className="flex items-center gap-2"><GraduationCap className="w-4 h-4 text-primary" />Education ({resumeContent.education?.length || 0})</div></AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-3">{resumeContent.education?.map((edu, index) => (<div key={index} className="border-l-2 border-primary/20 pl-4"><h4 className="font-semibold text-foreground">{edu.degree}</h4><p className="text-primary font-medium">{edu.institution}</p><p className="text-sm text-muted-foreground">{edu.dates}</p></div>))}</div>
                </AccordionContent>
              </AccordionItem>
               <AccordionItem value="projects">
                <AccordionTrigger className="text-left"><div className="flex items-center gap-2"><Code className="w-4 h-4 text-primary" />Projects ({resumeContent.projects?.length || 0})</div></AccordionTrigger>
                <AccordionContent>
                  <div className="space-y-4">{resumeContent.projects?.map((project, index) => (<div key={index} className="border-l-2 border-primary/20 pl-4"><h4 className="font-semibold text-foreground">{project.name}</h4><p className="text-foreground">{project.description}</p></div>))}</div>
                </AccordionContent>
              </AccordionItem>
            </Accordion>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
