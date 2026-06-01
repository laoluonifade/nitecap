"use client";

import { motion } from "framer-motion";

const phrases = [
  "OPEN THE MOMENT",
  "NO CAP. JUST NITECAP.",
  "PACKED FOR THE PLOT",
  "CAP IT OFF RIGHT",
  "ANYTIME. ANYWHERE.",
  "POUR DECISIONS WELCOME",
  "READY FOR A NITECAP?",
];

export default function Marquee() {
  const content = [...phrases, ...phrases, ...phrases];

  return (
    <div className="relative w-full bg-purple-700 py-4 overflow-hidden border-y border-purple-500/30">
      <div className="flex">
        <motion.div
          className="flex shrink-0 items-center gap-12"
          animate={{ x: "-50%" }}
          transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        >
          {content.map((phrase, i) => (
            <span key={i} className="flex items-center gap-12 whitespace-nowrap">
              <span
                className="text-sm font-bold tracking-[0.25em] text-white uppercase"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", fontSize: "1rem" }}
              >
                {phrase}
              </span>
              <span className="text-purple-300 text-sm">✦</span>
            </span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
