"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const lines = [
  { text: "The spontaneous brunch.", delay: 0 },
  { text: "The rooftop after work.", delay: 0.1 },
  { text: "The beach day that went sideways.", delay: 0.2 },
  { text: "The random Tuesday hangout.", delay: 0.3 },
  { text: "The house party nobody planned.", delay: 0.4 },
  { text: "The moment you cap it all off.", delay: 0.5, highlight: true },
];

export default function WhatIsNitecap() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="story" ref={ref} className="relative py-24 md:py-36 bg-black overflow-hidden">
      {/* Background */}
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full bg-purple-900/8 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-16 lg:gap-24 items-center">

          {/* Left — Story */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="mb-3 text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase"
            >
              What Is Nitecap
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,8vw,80px)] leading-[0.92] text-white mb-10"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              WE DON&apos;T SELL
              <br />
              <span className="text-gradient">COCKTAILS.</span>
              <br />
              WE SELL
              <br />
              MOMENTS.
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/50 text-base md:text-lg leading-relaxed mb-8 max-w-lg"
            >
              NITECAP is a premixed cocktail in a pouch. Built for spontaneous
              moments, not scheduled ones. Brunch, beach, rooftop, random Tuesday. We don&apos;t judge.
            </motion.p>

            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="flex flex-wrap gap-3"
            >
              {["No Cap", "All Vibes", "Any Moment"].map((tag) => (
                <span
                  key={tag}
                  className="border border-purple-700/40 bg-purple-950/20 text-purple-300 text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full"
                >
                  {tag}
                </span>
              ))}
            </motion.div>
          </div>

          {/* Right — The Moment Lines */}
          <div>
            <motion.div
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="mb-6 text-white/30 text-xs tracking-[0.3em] uppercase font-semibold"
            >
              Cap-worthy moments include:
            </motion.div>

            <div className="space-y-1">
              {lines.map((line, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -30 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.6, delay: 0.4 + line.delay, ease: [0.16, 1, 0.3, 1] }}
                  className={`text-2xl md:text-3xl lg:text-4xl font-light py-3 border-b border-white/5 ${
                    line.highlight ? "text-purple-400 font-medium" : "text-white/70"
                  }`}
                >
                  {line.text}
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 1.2 }}
              className="mt-10 p-6 rounded-2xl border border-purple-700/30 bg-purple-950/20"
            >
              <div
                className="text-3xl md:text-4xl font-display text-white mb-2"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
              >
                OPEN THE MOMENT.
              </div>
              <p className="text-white/40 text-sm leading-relaxed">
                Every pouch is an invitation. Open it at noon, at sunset,
                at 2am. We named it NITECAP, not a curfew.
              </p>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
