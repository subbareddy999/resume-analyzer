import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Target } from "lucide-react";

// Converted from TSX and simplified for our use case.
export function JobMatchAnalyzer({ jobDescription, setJobDescription }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="h-full"
    >
      <Card className="shadow-medium h-full flex flex-col">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="w-5 h-5 text-primary" />
            Optional: Add Job Description
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 flex-grow flex flex-col">
          <div>
            <Textarea
              placeholder="Paste the job description here to get a tailored analysis and match score..."
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
              className="min-h-40 resize-y flex-grow"
            />
             <p className="text-sm text-muted-foreground mt-2">
              Providing a job description will enable a more detailed analysis and a job match score.
            </p>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
