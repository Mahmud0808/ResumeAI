"use client";

import React from "react";
import { motion } from "framer-motion";
import { Brain, Sparkles } from "lucide-react";

/**
 * Loading indicator for "Generate from AI" buttons: a thinking brain with a
 * pulsing glow and popping sparks, paired with shimmering label text.
 */
export const AiLoader = ({ size = 16 }: { size?: number }) => (
  <span
    className="relative inline-flex items-center justify-center"
    style={{ width: size + 4, height: size + 4 }}
  >
    <motion.span
      className="absolute inset-0 rounded-full bg-primary-400/50 blur-[5px]"
      animate={{ scale: [1, 1.7, 1], opacity: [0.35, 0.9, 0.35] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    />
    <motion.span
      className="relative inline-flex"
      animate={{ scale: [1, 1.12, 1], rotate: [0, -8, 8, 0] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Brain size={size} className="text-primary-600" />
    </motion.span>
    <motion.span
      className="absolute -right-1.5 -top-1.5"
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, 90] }}
      transition={{ duration: 1.2, repeat: Infinity, ease: "easeInOut" }}
    >
      <Sparkles size={Math.round(size * 0.55)} className="text-amber-400" />
    </motion.span>
    <motion.span
      className="absolute -bottom-1 -left-1.5"
      animate={{ scale: [0, 1, 0], opacity: [0, 1, 0], rotate: [0, -90] }}
      transition={{
        duration: 1.2,
        repeat: Infinity,
        ease: "easeInOut",
        delay: 0.6,
      }}
    >
      <Sparkles size={Math.round(size * 0.45)} className="text-sky-400" />
    </motion.span>
  </span>
);

/** Shimmering "Thinking…" label to pair with AiLoader. */
export const AiThinkingText = ({ text = "Thinking..." }: { text?: string }) => (
  <span className="ai-thinking-text font-medium">{text}</span>
);

export default AiLoader;
