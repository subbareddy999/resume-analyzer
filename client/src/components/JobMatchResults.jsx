import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion } from "framer-motion";
import { AlertTriangle, CheckCircle, Target } from "lucide-react";

// This component displays the results of the job match analysis.
export function JobMatchResults({ data }) {
  if (!data) return null;

  const getScoreColor = (score) => {
    if (score >= 80) return "text-success";
    if (score >= 60) return "text-warning";
    return "text-destructive";
  };

  return (
    <Card className="shadow-medium">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Target className="w-5 h-5 text-primary" />
          Job Match Analysis
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Match Score */}
        <div className="text-center p-4 bg-accent/30 rounded-lg">
          <div className={`text-4xl font-bold ${getScoreColor(data.matchScore)}`}>
            {data.matchScore}%
          </div>
          <p className="text-sm text-muted-foreground">Job Match Score</p>
        </div>

        {/* Summary */}
        <div>
          <h4 className="font-semibold text-foreground mb-2">
            Tailoring Summary
          </h4>
          <p className="text-sm text-foreground">{data.summary}</p>
        </div>

        {/* Matching Keywords */}
        <div>
          <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-success" />
            Matching Keywords
          </h4>
          <div className="flex flex-wrap gap-2">
            {data.matchingKeywords.map((skill, index) => (
              <Badge key={index} variant="secondary" className="bg-success/10 text-success border-success/20">
                {skill}
              </Badge>
            ))}
          </div>
        </div>

        {/* Missing Keywords */}
        {data.missingKeywords.length > 0 && (
          <div>
            <h4 className="font-semibold text-foreground mb-2 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-warning" />
              Keywords to Add
            </h4>
            <div className="flex flex-wrap gap-2">
              {data.missingKeywords.map((skill, index) => (
                <Badge key={index} variant="secondary" className="bg-warning/10 text-warning border-warning/20">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
