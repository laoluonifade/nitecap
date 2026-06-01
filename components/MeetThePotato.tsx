"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const traits = [
  { label: "Knows where the function is. Always.", icon: "📍" },
  { label: "Shows up uninvited. Nobody complains.", icon: "👋" },
  { label: "Brings drinks, not drama.", icon: "🎁" },
  { label: "Wears sunglasses indoors. Pulls it off.", icon: "😎" },
  { label: "Makes any moment cap-worthy.", icon: "✨" },
];

export default function MeetThePotato() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-36 bg-black overflow-hidden">
      {/* Background glow */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-800/10 blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* Left — Potato Mascot Image */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
            className="flex justify-center lg:justify-end"
          >
            <div className="relative w-full max-w-md">
              {/* Glow behind image */}
              <div
                className="absolute inset-0 rounded-3xl blur-3xl -z-10"
                style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.3) 0%, transparent 70%)" }}
              />

              {/* Main mascot image */}
              <motion.div
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
                className="relative rounded-3xl overflow-hidden border border-purple-700/30"
                style={{ boxShadow: "0 0 60px rgba(124,58,237,0.25)" }}
              >
                <Image
                  src="/images/potato-mascot.png"
                  alt="The NITECAP Potato — leaning on a purple lowrider in sunglasses and sneakers"
                  width={768}
                  height={512}
                  className="w-full h-auto"
                  priority
                />
              </motion.div>

              {/* Floating sticker overlay — bottom right */}
              <motion.div
                initial={{ opacity: 0, scale: 0, rotate: -20 }}
                animate={isInView ? { opacity: 1, scale: 1, rotate: 6 } : {}}
                transition={{ delay: 0.6, duration: 0.5, ease: "backOut" }}
                className="absolute -bottom-6 -right-4 md:-right-8 w-28 md:w-36 z-10"
              >
                <Image
                  src="/images/potato-sticker.png"
                  alt="NITECAP sticker — Ready for a NITECAP?"
                  width={280}
                  height={280}
                  className="w-full h-auto drop-shadow-2xl"
                />
              </motion.div>

              {/* Speech bubble */}
              <motion.div
                initial={{ opacity: 0, scale: 0.8, y: 10 }}
                animate={isInView ? { opacity: 1, scale: 1, y: 0 } : {}}
                transition={{ delay: 0.8, duration: 0.4, ease: "backOut" }}
                className="absolute -top-4 -left-4 md:-left-8 bg-purple-600 text-white text-xs md:text-sm font-bold tracking-wide px-4 py-2.5 rounded-2xl rounded-bl-sm z-10"
                style={{ boxShadow: "0 4px 20px rgba(168,85,247,0.5)" }}
              >
                sup. i brought drinks. 🥔
              </motion.div>
            </div>
          </motion.div>

          {/* Right — Text */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            >
              Meet The Mascot
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,7vw,80px)] leading-[0.92] text-white mb-6"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              THIS IS
              <br />
              <span className="text-gradient">THE POTATO.</span>
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 }}
              className="text-white/60 text-base md:text-lg leading-relaxed mb-10 max-w-lg"
            >
              The Potato isn&apos;t a mascot. The Potato is that friend.
              Shows up anywhere, anytime, always with the good stuff.
              Sunglasses on at noon? Obviously.
            </motion.p>

            {/* Trait list */}
            <div className="space-y-3 mb-10">
              {traits.map((trait, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ duration: 0.5, delay: 0.4 + i * 0.09 }}
                  className="flex items-center gap-4 group"
                >
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center text-lg shrink-0"
                    style={{ background: "rgba(124,58,237,0.15)", border: "1px solid rgba(168,85,247,0.2)" }}
                  >
                    {trait.icon}
                  </div>
                  <div className="text-white/60 text-sm group-hover:text-white/90 transition-colors">{trait.label}</div>
                </motion.div>
              ))}
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.9 }}
              className="inline-flex items-center gap-3 border border-purple-700/40 bg-purple-950/20 text-purple-300 text-sm font-semibold px-6 py-3 rounded-full"
            >
              <span>🥔</span>
              <span>Merch coming soon. The Potato era is just starting.</span>
            </motion.div>
          </div>

        </div>
      </div>
    </section>
  );
}
