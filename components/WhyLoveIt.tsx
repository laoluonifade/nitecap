"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function WhyLoveIt() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-36 bg-black">
      {/* Purple gradient top */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-14 lg:gap-20 items-center">

          {/* Left — Text */}
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
              className="text-white/50 text-base leading-relaxed max-w-sm mb-8"
            >
              A whole cocktail in your pocket. Goes where you go.
              Morning, noon, or nite. We&apos;re not your calendar.
            </motion.p>

            {/* Quick benefit pills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.4 }}
              className="flex flex-wrap gap-3 mb-8"
            >
              {[
                { emoji: "🎒", text: "Fits in your bag" },
                { emoji: "⚡", text: "Ready instantly" },
                { emoji: "🎉", text: "Festival-friendly" },
                { emoji: "🏖️", text: "Beach-approved" },
              ].map((pill) => (
                <div
                  key={pill.text}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2"
                >
                  <span className="text-sm">{pill.emoji}</span>
                  <span className="text-white/60 text-xs font-medium">{pill.text}</span>
                </div>
              ))}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="p-5 rounded-2xl bg-purple-950/20 border border-purple-700/30"
            >
              <div className="text-3xl mb-2">🥔</div>
              <blockquote className="text-white/70 text-sm italic leading-relaxed">
                &ldquo;They called it a nightcap. I drink it at brunch. No cap.&rdquo;
              </blockquote>
              <div className="mt-3 text-purple-400 text-xs font-semibold tracking-widest uppercase">
                — The Potato Mascot
              </div>
            </motion.div>
          </div>

          {/* Right — Visual */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative"
          >
            {/* Main pouch photo */}
            <div className="relative rounded-3xl overflow-hidden border border-purple-700/20"
              style={{ boxShadow: "0 0 60px rgba(124,58,237,0.15)" }}
            >
              <Image
                src="/images/pouch-photo.jpg"
                alt="NITECAP cocktail pouch — Chapman flavor"
                width={800}
                height={1000}
                className="w-full h-auto"
              />
            </div>

            {/* Floating sticker chips */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: -10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: 6 } : {}}
              transition={{ delay: 0.7, duration: 0.4, ease: "backOut" }}
              className="absolute -top-4 -right-3 md:-right-6 z-10"
            >
              <motion.div
                animate={{ y: [0, -5, 0], rotate: [6, 3, 6] }}
                transition={{ duration: 4, repeat: Infinity }}
                className="bg-purple-600 text-white text-xs font-bold tracking-wider px-4 py-2 rounded-full shadow-lg"
                style={{ boxShadow: "0 4px 20px rgba(168,85,247,0.5)" }}
              >
                NO MIXING 🙅‍♂️
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 10 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: -4 } : {}}
              transition={{ delay: 0.9, duration: 0.4, ease: "backOut" }}
              className="absolute -bottom-3 -left-3 md:-left-6 z-10"
            >
              <motion.div
                animate={{ y: [0, -4, 0], rotate: [-4, -8, -4] }}
                transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                className="bg-fuchsia-600 text-white text-xs font-bold tracking-wider px-4 py-2 rounded-full shadow-lg"
                style={{ boxShadow: "0 4px 20px rgba(217,70,239,0.4)" }}
              >
                JUST OPEN IT 🍹
              </motion.div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 1.1, duration: 0.4, ease: "backOut" }}
              className="absolute top-1/2 -right-2 md:-right-8 z-10"
            >
              <motion.div
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                className="bg-violet-600 text-white text-xs font-bold tracking-wider px-4 py-2 rounded-full shadow-lg"
                style={{ boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
              >
                PORTABLE AF 🎒
              </motion.div>
            </motion.div>

            {/* Potato sticker overlay — bottom right */}
            <motion.div
              initial={{ opacity: 0, scale: 0, rotate: 20 }}
              animate={isInView ? { opacity: 1, scale: 1, rotate: -8 } : {}}
              transition={{ delay: 1.2, duration: 0.5, ease: "backOut" }}
              className="absolute -bottom-6 -right-4 md:-right-10 w-24 md:w-32 z-10"
            >
              <Image
                src="/images/potato-sticker.png"
                alt="NITECAP potato mascot sticker"
                width={280}
                height={280}
                className="w-full h-auto drop-shadow-2xl"
              />
            </motion.div>
          </motion.div>

        </div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />
    </section>
  );
}
