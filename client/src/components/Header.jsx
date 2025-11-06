import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { History } from "lucide-react";

// Converted from TSX to JSX: Removed the interface and type annotations.
export function Header({ onViewHistory }) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="w-full py-6 px-6 bg-card shadow-soft border-b border-border"
    >
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">
            AI Resume Analyzer
          </h1>
          <p className="text-muted-foreground text-sm mt-1">
            Get professional feedback on your resume instantly
          </p>
        </div>

        <Button
          variant="outline"
          onClick={onViewHistory}
          className="flex items-center gap-2 hover:shadow-soft transition-shadow"
        >
          <History className="w-4 h-4" />
          View History
        </Button>
      </div>
    </motion.header>
  );
}
