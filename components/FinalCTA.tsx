"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const ORDER_LINK = "https://paystack.shop/pay/nitecapcocktail";

export default function FinalCTA() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative py-32 md:py-48 bg-black overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div
          className="w-[700px] h-[700px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(124,58,237,0.25) 0%, transparent 70%)" }}
        />
      </div>

      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto px-5 md:px-8 text-center">
        {/* Potato emoji floating */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="text-6xl mb-8 inline-block animate-float"
        >
          🥔
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-6"
        >
          Open The Moment
        </motion.div>

        <div className="overflow-hidden mb-2">
          <motion.h2
            initial={{ y: 100 }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(56px,12vw,130px)] leading-[0.9] text-white"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            READY FOR
          </motion.h2>
        </div>
        <div className="overflow-hidden mb-2">
          <motion.h2
            initial={{ y: 100 }}
            animate={isInView ? { y: 0 } : {}}
            transition={{ duration: 0.8, delay: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="font-display text-[clamp(56px,12vw,130px)] leading-[0.9] text-gradient"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            A NITECAP?
          </motion.h2>
        </div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-white/40 text-base md:text-lg mt-6 mb-12 max-w-md mx-auto"
        >
          Any moment. Any time. Any excuse.
          <br />
          (You don&apos;t even need an excuse.)
        </motion.p>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4"
        >
          <a
            href={ORDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-[0.2em] uppercase text-base px-12 py-5 rounded-full transition-all duration-300 hover:scale-105"
            style={{ boxShadow: "0 0 50px rgba(168,85,247,0.5), 0 0 100px rgba(168,85,247,0.2)" }}
          >
            <span>ORDER NOW</span>
            <span className="group-hover:translate-x-1 transition-transform text-lg">→</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-16 flex flex-wrap items-center justify-center gap-6 text-white/20 text-xs tracking-widest uppercase"
        >
          <span>🍒 Chapman</span>
          <span className="text-purple-700">✦</span>
          <span>🍊 Sex On The Beach</span>
          <span className="text-purple-700">✦</span>
          <span>💙 Sea Breeze</span>
          <span className="text-purple-700">✦</span>
          <span>🟢 Virgin Mojito</span>
          <span className="text-purple-700">✦</span>
          <span>🥃 Amaretto Sour</span>
        </motion.div>
      </div>
    </section>
  );
}
