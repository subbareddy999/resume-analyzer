import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle, AlertTriangle, XCircle, Shield } from "lucide-react";

// Converted from TSX and adapted for our project
export function ATSCompatibilityCheck({ data }) {
  if (!data) return null;
  const { issues, overallScore } = data;

  const getScoreColor = (score) => {
    if (score >= 85) return "text-success";
    if (score >= 70) return "text-warning";
    return "text-destructive";
  };

  const getScoreLabel = (score) => {
    if (score >= 85) return "ATS Friendly";
    if (score >= 70) return "Needs Improvement";
    return "High Risk";
  };

  const getIssueIcon = (type) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-success flex-shrink-0" />;
      case 'warning':
        return <AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" />;
      case 'error':
        return <XCircle className="w-4 h-4 text-destructive flex-shrink-0" />;
      default:
        return null;
    }
  };

  const getIssueBadgeStyle = (type) => {
    switch (type) {
      case 'success':
        return "bg-success/10 text-success border-success/20";
      case 'warning':
        return "bg-warning/10 text-warning border-warning/20";
      case 'error':
        return "bg-destructive/10 text-destructive border-destructive/20";
      default:
        return "";
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.4, delay: 0.5 }}
    >
      <Card className="shadow-medium">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            ATS Compatibility Check
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Overall Score */}
          <div className="text-center p-4 bg-accent/30 rounded-lg">
            <div className={`text-3xl font-bold ${getScoreColor(overallScore)}`}>
              {overallScore}%
            </div>
            <p className="text-sm text-muted-foreground">
              {getScoreLabel(overallScore)}
            </p>
          </div>

          {/* Issues List */}
          <div className="space-y-3">
            <h4 className="font-semibold text-foreground">
              Compatibility Analysis
            </h4>
            {issues.map((issue, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 * index }}
                className="flex items-start gap-3 p-3 rounded-lg border border-border/50"
              >
                {getIssueIcon(issue.type)}
                <div className="flex-1">
                  <Badge variant="outline" className={getIssueBadgeStyle(issue.type)}>
                    {issue.category}
                  </Badge>
                  <p className="text-sm text-foreground mt-1">{issue.message}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
