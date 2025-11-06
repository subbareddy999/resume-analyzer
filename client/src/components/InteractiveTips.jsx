import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Check, Lightbulb } from "lucide-react";

export function InteractiveTips({ tips }) {
  // --- ADDED CHECK ---
  // This prevents the component from crashing if 'tips' isn't a list.
  if (!Array.isArray(tips)) {
    console.error("InteractiveTips expects the 'tips' prop to be an array, but received:", tips);
    return null;
  }
  // -------------------

  if (!tips || tips.length === 0) return null;

  const [completedTips, setCompletedTips] = useState([]);

  const toggleTipCompletion = (index) => {
    if (completedTips.includes(index)) {
      setCompletedTips(completedTips.filter((i) => i !== index));
    } else {
      setCompletedTips([...completedTips, index]);
    }
  };

  const completedCount = completedTips.length;
  const progressPercentage = (completedCount / tips.length) * 100;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      <Card className="shadow-medium">
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-primary" />
              Actionable Improvement Tips
            </CardTitle>
            <div className="text-sm text-muted-foreground font-medium">
              {completedCount} / {tips.length} Completed
            </div>
          </div>

          <div className="w-full bg-muted rounded-full h-2 mt-3">
            <motion.div
              className="bg-primary h-2 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${progressPercentage}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {tips.map((tip, index) => {
            const isCompleted = completedTips.includes(index);
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
                onClick={() => toggleTipCompletion(index)}
                className={`border rounded-lg p-3 cursor-pointer transition-all duration-200 flex items-start gap-3
                  ${isCompleted ? 'bg-success/5 border-success/20' : 'bg-card border-border hover:border-primary/30'}
                `}
              >
                <div
                  className={`mt-1 h-5 w-5 rounded-full flex-shrink-0 flex items-center justify-center border-2 transition-all
                    ${isCompleted ? 'bg-success border-success text-success-foreground' : 'border-muted-foreground'}
                  `}
                >
                  {isCompleted && <Check className="w-3 h-3" />}
                </div>
                <p className={`flex-1 ${isCompleted ? 'line-through text-muted-foreground' : 'text-foreground'}`}>
                  {tip}
                </p>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
