import { motion } from "framer-motion";

// Converted from TSX to JSX
export function CircularProgress({ score, size = 120, strokeWidth = 8 }) {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Convert score from 1-10 scale to percentage for the circle
  const offset = circumference - (score / 10) * circumference;

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        className="transform -rotate-90"
      >
        {/* Background circle */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--muted))"
          strokeWidth={strokeWidth}
          fill="transparent"
        />

        {/* Progress circle */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--primary))"
          strokeWidth={strokeWidth}
          fill="transparent"
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset: offset }}
          transition={{
            duration: 1.5,
            ease: "easeOut",
            delay: 0.5
          }}
        />
      </svg>

      {/* Score text */}
      <motion.div
        initial={{ opacity: 0, scale: 0.5 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 1 }}
        className="absolute inset-0 flex items-center justify-center"
      >
        <div className="text-center">
          <div className="text-3xl font-bold text-foreground">
            {score}
          </div>
          <div className="text-sm text-muted-foreground">
            / 10
          </div>
        </div>
      </motion.div>
    </div>
  );
}
