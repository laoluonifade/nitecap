"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";


export default function WhyLoveIt() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-36 bg-black">
      {/* Purple gradient top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="max-w-2xl">

          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            >
              Why People Love It
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,7vw,80px)] leading-[0.92] text-white mb-8"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              NO GLASS.
              <br />
              NO MIXER.
              <br />
              <span className="text-gradient">NO CAP.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/50 text-base leading-relaxed max-w-sm"
            >
              A whole cocktail in your pocket. Goes where you go.
              Morning, noon, or nite — we&apos;re not your calendar.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.45 }}
              className="mt-10 p-6 rounded-2xl bg-purple-950/20 border border-purple-700/30"
            >
              <div className="text-4xl mb-3">🥔</div>
              <blockquote className="text-white/70 text-sm italic leading-relaxed">
                &ldquo;They called it a nightcap. I drink it at brunch. No cap.&rdquo;
              </blockquote>
              <div className="mt-3 text-purple-400 text-xs font-semibold tracking-widest uppercase">
                — The Potato Mascot
              </div>
            </motion.div>
          </div>

        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />
    </section>
  );
}
