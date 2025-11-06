import { motion } from "framer-motion";
import { cn } from "@/lib/utils"; // We'll use our utility function

// Converted from TSX to JSX
export function SkillBadge({ skill, index, variant = 'technical' }) {
  const variants = {
    technical: "bg-primary/10 text-primary border-primary/20",
    soft: "bg-accent/50 text-accent-foreground border-border"
  };

  return (
    <motion.span
      initial={{ opacity: 0, scale: 0.8 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{
        duration: 0.3,
        delay: index * 0.05 // A slightly faster delay
      }}
      className={cn(
        "inline-block px-3 py-1.5 rounded-full text-sm font-medium border transition-all duration-normal hover:scale-105 hover:shadow-soft",
        variants[variant]
      )}
    >
      {skill}
    </motion.span>
  );
}
