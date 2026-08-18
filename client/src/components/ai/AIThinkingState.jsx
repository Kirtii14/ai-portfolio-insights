import { Sparkles } from "lucide-react";
import { motion } from "motion/react";

function AIThinkingState() {
  return (
    <div
      className="flex items-center gap-3 text-sm text-[var(--color-text-secondary)]"
      aria-live="polite"
    >
      <motion.span
        animate={{
          opacity: [0.35, 1, 0.35],
        }}
        transition={{
          duration: 1.2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles
          size={15}
          strokeWidth={1.8}
          className="text-[var(--color-ai)]"
        />
      </motion.span>

      <span>AURA is analyzing your portfolio…</span>
    </div>
  );
}

export default AIThinkingState;
