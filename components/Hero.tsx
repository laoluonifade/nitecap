"use client";

import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion";
import { useRef, useState, useEffect } from "react";
import { ArrowDown } from "lucide-react";

const ORDER_LINK = "https://paystack.shop/pay/nitecapcocktail";

const floatingStickers = [
  { emoji: "🍹", x: "8%", y: "12%", size: "text-3xl", delay: 0, duration: 5, rotate: 12 },
  { emoji: "🥔", x: "82%", y: "8%", size: "text-4xl", delay: 0.3, duration: 6, rotate: -15 },
  { emoji: "🍍", x: "88%", y: "55%", size: "text-2xl", delay: 0.6, duration: 4.5, rotate: 20 },
  { emoji: "✨", x: "5%", y: "60%", size: "text-2xl", delay: 0.9, duration: 5.5, rotate: -8 },
  { emoji: "🔥", x: "75%", y: "82%", size: "text-2xl", delay: 1.2, duration: 4, rotate: 10 },
  { emoji: "💜", x: "15%", y: "85%", size: "text-xl", delay: 0.4, duration: 5, rotate: -20 },
];

const rotatingWords = ["ANYTIME", "ANYWHERE", "NO CAP", "JUST VIBES", "IN A POUCH", "OPEN IT"];

function RotatingText() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % rotatingWords.length);
    }, 2000);
    return () => clearInterval(interval);
  }, []);

  return (
    <span className="inline-block relative h-[1.1em] overflow-hidden align-bottom min-w-[260px] md:min-w-[380px] lg:min-w-[480px]">
      <AnimatePresence mode="wait">
        <motion.span
          key={rotatingWords[index]}
          initial={{ y: 40, opacity: 0, rotateX: -45 }}
          animate={{ y: 0, opacity: 1, rotateX: 0 }}
          exit={{ y: -40, opacity: 0, rotateX: 45 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="absolute left-0 text-gradient whitespace-nowrap"
        >
          {rotatingWords[index]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

function CircularText() {
  const text = "OPEN THE MOMENT • NO CAP • NITECAP • ";
  return (
    <div className="absolute w-[180px] h-[180px] md:w-[220px] md:h-[220px] animate-spin-slow">
      <svg viewBox="0 0 200 200" className="w-full h-full">
        <defs>
          <path id="circlePath" d="M 100, 100 m -80, 0 a 80,80 0 1,1 160,0 a 80,80 0 1,1 -160,0" />
        </defs>
        <text className="fill-purple-400/40" style={{ fontSize: "12px", letterSpacing: "4px", fontFamily: "'Space Grotesk', monospace" }}>
          <textPath href="#circlePath">{text}</textPath>
        </text>
      </svg>
    </div>
  );
}

export default function Hero() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 150]);
  const opacity = useTransform(scrollYProgress, [0, 0.6], [1, 0]);

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-black"
    >
      {/* Animated gradient blobs */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div
          animate={{
            x: [0, 30, -20, 0],
            y: [0, -40, 20, 0],
            scale: [1, 1.2, 0.9, 1],
          }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[30%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full bg-purple-600/20 blur-[100px] md:blur-[120px]"
        />
        <motion.div
          animate={{
            x: [0, -25, 15, 0],
            y: [0, 30, -30, 0],
            scale: [1, 0.8, 1.1, 1],
          }}
          transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[20%] right-[10%] w-[250px] h-[250px] md:w-[400px] md:h-[400px] rounded-full bg-fuchsia-700/15 blur-[80px] md:blur-[100px]"
        />
        <motion.div
          animate={{
            x: [0, 20, -30, 0],
            y: [0, -20, 25, 0],
          }}
          transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 2 }}
          className="absolute top-[50%] left-[5%] w-[200px] h-[200px] rounded-full bg-violet-800/10 blur-[80px]"
        />
      </div>

      {/* Grid lines */}
      <div
        className="absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(168,85,247,1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(168,85,247,1) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Floating sticker emojis — visible on mobile */}
      {floatingStickers.map((sticker, i) => (
        <motion.div
          key={i}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.8 + sticker.delay, duration: 0.5, ease: "backOut" }}
          className={`absolute ${sticker.size} select-none pointer-events-none z-20`}
          style={{ left: sticker.x, top: sticker.y }}
        >
          <motion.div
            animate={{
              y: [0, -12, 0],
              rotate: [sticker.rotate, -sticker.rotate, sticker.rotate],
            }}
            transition={{ duration: sticker.duration, repeat: Infinity, ease: "easeInOut" }}
          >
            {sticker.emoji}
          </motion.div>
        </motion.div>
      ))}

      <motion.div style={{ y, opacity }} className="relative z-10 w-full max-w-7xl mx-auto px-5 md:px-8 pt-20 md:pt-24 pb-16">
        <div className="flex flex-col lg:flex-row items-center gap-6 lg:gap-0 min-h-[85vh]">

          {/* Mobile-first: Pouch visual FIRST on mobile, text second */}
          <div className="flex-1 flex items-center justify-center relative order-1 lg:order-2 pt-2 lg:pt-0">
            {/* Circular rotating text */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="absolute flex items-center justify-center"
            >
              <CircularText />
            </motion.div>

            {/* Glow behind product */}
            <motion.div
              animate={{ scale: [1, 1.15, 1] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              className="absolute w-48 h-48 md:w-72 md:h-72 rounded-full bg-purple-600/25 blur-[60px] md:blur-[80px]"
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.6, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
              className="relative"
            >
              <motion.div
                animate={{ y: [0, -10, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              >
                {/* Pouch */}
                <div className="relative w-36 h-52 md:w-56 md:h-80 lg:w-64 lg:h-96">
                  {/* Pouch body */}
                  <div
                    className="absolute inset-x-3 bottom-0 top-5 overflow-hidden"
                    style={{
                      borderRadius: "40% 40% 45% 45% / 8% 8% 25% 25%",
                      background: "linear-gradient(160deg, rgba(120,0,200,0.15) 0%, rgba(80,0,180,0.6) 40%, rgba(50,0,120,0.8) 100%)",
                      border: "1px solid rgba(168,85,247,0.4)",
                      boxShadow: "0 20px 60px rgba(100,0,200,0.4), inset 0 0 40px rgba(168,85,247,0.15)",
                    }}
                  >
                    {/* Liquid fill */}
                    <motion.div
                      animate={{ y: [0, -3, 0] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                      className="absolute inset-0 top-[15%]"
                      style={{
                        background: "linear-gradient(180deg, transparent 0%, rgba(139,0,80,0.6) 20%, rgba(100,0,60,0.9) 100%)",
                      }}
                    />

                    {/* Label */}
                    <div className="absolute inset-x-3 top-1/4 bottom-1/4 flex flex-col items-center justify-center">
                      <div
                        className="w-full py-3 px-2 rounded-xl flex flex-col items-center gap-0.5"
                        style={{
                          background: "rgba(100, 0, 200, 0.7)",
                          border: "1px solid rgba(168,85,247,0.5)",
                          backdropFilter: "blur(8px)",
                        }}
                      >
                        <span
                          className="text-white tracking-[0.2em] text-sm md:text-lg font-bold"
                          style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
                        >
                          NITECAP
                        </span>
                        <span className="text-purple-200/80 text-[7px] md:text-[9px] tracking-[0.15em] uppercase text-center">
                          Premixed Cocktails
                        </span>
                      </div>
                    </div>

                    {/* Shimmer sweep */}
                    <motion.div
                      animate={{ x: ["-100%", "200%"] }}
                      transition={{ duration: 3, repeat: Infinity, ease: "easeInOut", repeatDelay: 2 }}
                      className="absolute top-0 bottom-0 w-8 opacity-15"
                      style={{
                        background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)",
                      }}
                    />
                  </div>

                  {/* Spout */}
                  <div className="absolute top-0 left-1/2 -translate-x-1/2 flex flex-col items-center">
                    <div className="w-5 h-6 md:w-6 md:h-8 bg-white/90 rounded-t-md" />
                    <div className="w-9 h-2 md:w-12 md:h-3 bg-white/70 rounded-full -mt-0.5" />
                  </div>
                </div>
              </motion.div>

              {/* Floating sticker chips around pouch */}
              <motion.div
                initial={{ opacity: 0, scale: 0, x: -20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.0, duration: 0.4, ease: "backOut" }}
                className="absolute -left-8 md:-left-20 top-[20%] z-10"
              >
                <motion.div
                  animate={{ y: [0, -5, 0], rotate: [-3, 3, -3] }}
                  transition={{ duration: 4, repeat: Infinity }}
                  className="bg-purple-600 text-white text-[10px] md:text-xs font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg"
                  style={{ boxShadow: "0 4px 20px rgba(168,85,247,0.5)" }}
                >
                  NO CAP 🧢
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 0 }}
                transition={{ delay: 1.2, duration: 0.4, ease: "backOut" }}
                className="absolute -right-6 md:-right-16 top-[45%] z-10"
              >
                <motion.div
                  animate={{ y: [0, -7, 0], rotate: [2, -2, 2] }}
                  transition={{ duration: 5, repeat: Infinity, delay: 0.5 }}
                  className="bg-fuchsia-600 text-white text-[10px] md:text-xs font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg"
                  style={{ boxShadow: "0 4px 20px rgba(217,70,239,0.4)" }}
                >
                  14% ALC 🔥
                </motion.div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{ delay: 1.4, duration: 0.4, ease: "backOut" }}
                className="absolute left-1/2 -translate-x-1/2 -bottom-4 md:-bottom-6 z-10"
              >
                <motion.div
                  animate={{ y: [0, -4, 0], rotate: [-2, 2, -2] }}
                  transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
                  className="bg-violet-600 text-white text-[10px] md:text-xs font-bold tracking-wider px-3 py-1.5 rounded-full shadow-lg whitespace-nowrap"
                  style={{ boxShadow: "0 4px 20px rgba(124,58,237,0.4)" }}
                >
                  300ml POUCH 🍹
                </motion.div>
              </motion.div>
            </motion.div>
          </div>

          {/* Text content */}
          <div className="flex-1 flex flex-col items-center lg:items-start justify-center order-2 lg:order-1 text-center lg:text-left">

            {/* Headline */}
            <div className="overflow-hidden mb-1">
              <motion.h1
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.2, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(56px,16vw,160px)] leading-[0.88] text-white"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
              >
                OPEN
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-1">
              <motion.h1
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.3, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(56px,16vw,160px)] leading-[0.88]"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
              >
                <RotatingText />
              </motion.h1>
            </div>
            <div className="overflow-hidden mb-6">
              <motion.h1
                initial={{ y: 120 }}
                animate={{ y: 0 }}
                transition={{ delay: 0.4, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="font-display text-[clamp(56px,16vw,160px)] leading-[0.88] text-white"
                style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
              >
                MOMENT.
              </motion.h1>
            </div>

            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7, duration: 0.6 }}
              className="text-white/50 text-sm md:text-base max-w-sm mb-8 leading-relaxed"
            >
              Premixed cocktails & mocktails in a pouch.
              <br />
              No cap. Just NITECAP.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.85, duration: 0.6 }}
              className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto"
            >
              <a
                href={ORDER_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-[0.15em] uppercase text-sm px-8 py-4 rounded-full transition-all duration-300 hover:scale-105"
                style={{ boxShadow: "0 0 30px rgba(168,85,247,0.4), 0 0 60px rgba(168,85,247,0.15)" }}
              >
                <span>Order Now</span>
                <motion.span
                  animate={{ x: [0, 4, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-lg"
                >
                  →
                </motion.span>
              </a>
              <a
                href="#products"
                className="inline-flex items-center justify-center gap-2 border border-white/10 hover:border-purple-500/50 text-white/70 hover:text-white font-medium text-sm px-8 py-4 rounded-full transition-all duration-300"
              >
                Explore Flavors
              </a>
            </motion.div>

            {/* Stats — pill style on mobile */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
              className="flex items-center gap-3 md:gap-6 mt-10 flex-wrap justify-center lg:justify-start"
            >
              {[
                { value: "6", label: "Flavors", emoji: "🍹" },
                { value: "14%", label: "ALC", emoji: "🔥" },
                { value: "300ml", label: "Pouch", emoji: "📦" },
              ].map((stat) => (
                <motion.div
                  key={stat.label}
                  whileHover={{ scale: 1.05 }}
                  className="flex items-center gap-2 bg-white/5 border border-white/10 rounded-full px-4 py-2"
                >
                  <span className="text-sm">{stat.emoji}</span>
                  <span className="text-sm font-bold text-white">{stat.value}</span>
                  <span className="text-xs text-white/40 uppercase tracking-wider">{stat.label}</span>
                </motion.div>
              ))}
            </motion.div>
          </div>

        </div>
      </motion.div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2 }}
        className="absolute bottom-6 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2"
      >
        <motion.div
          animate={{ y: [0, 8, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
          className="text-white/20"
        >
          <ArrowDown size={16} />
        </motion.div>
      </motion.div>
    </section>
  );
}
