"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
const ORDER_LINK = "https://paystack.shop/nitecapcocktail";

const mocktails = [
  {
    id: "chapman",
    name: "CHAPMAN",
    tagline: "Smooth Nights. Easy Stories.",
    description: "The Nigerian classic. No alcohol, all the flavor. Still carrying the country. No cap.",
    accentColor: "#DC143C",
    glowColor: "rgba(220,20,60,0.25)",
    badge: "Mocktail",
    badgeColor: "bg-red-900/50 text-red-300 border-red-700/40",
    alc: "0%",
  },
  {
    id: "virgin-mojito",
    name: "VIRGIN MOJITO",
    tagline: "Fresh Mind. Clear Plans.",
    description: "Minty. Fresh. Dangerously sensible. For people who have plans tomorrow.",
    accentColor: "#22C55E",
    glowColor: "rgba(34,197,94,0.25)",
    badge: "Mocktail",
    badgeColor: "bg-green-900/50 text-green-300 border-green-700/40",
    alc: "0%",
  },
  {
    id: "amaretto-sour-virgin",
    name: "AMARETTO SOUR (VIRGIN)",
    tagline: "Sweet Today. Decisions Later.",
    description: "Sweet. Citrusy. Confident. No alcohol. All the attitude. This still counts as networking.",
    accentColor: "#F59E0B",
    glowColor: "rgba(245,158,11,0.25)",
    badge: "Mocktail",
    badgeColor: "bg-amber-900/50 text-amber-300 border-amber-700/40",
    alc: "0%",
  },
];

const cocktails = [
  {
    id: "amaretto-sour",
    name: "AMARETTO SOUR",
    tagline: "Smooth Sip. Soft Life.",
    description: "Sweet. Nutty. Citrusy. The smooth talker of the lineup. Soft life energy in every sip.",
    accentColor: "#DC143C",
    glowColor: "rgba(220,20,60,0.25)",
    badge: "Cocktail",
    badgeColor: "bg-red-900/50 text-red-300 border-red-700/40",
    alc: "14%",
  },
  {
    id: "sex-on-the-beach",
    name: "SEX ON THE BEACH",
    tagline: "Bold Nights. No Regrets.",
    description: "Fruity. Tropical. Suspiciously easy to finish. The group chat story in a pouch.",
    accentColor: "#F97316",
    glowColor: "rgba(249,115,22,0.25)",
    badge: "Cocktail",
    badgeColor: "bg-orange-900/50 text-orange-300 border-orange-700/40",
    alc: "14%",
  },
  {
    id: "pornstar-martini",
    name: "PORNSTAR MARTINI",
    tagline: "Made Different. Remembered Always.",
    description: "Bold. Smooth. Unforgettable. The main character energy you didn't know you needed.",
    accentColor: "#A855F7",
    glowColor: "rgba(168,85,247,0.25)",
    badge: "Cocktail",
    badgeColor: "bg-purple-900/50 text-purple-300 border-purple-700/40",
    alc: "14%",
  },
];

function ProductCard({ product, i, isInView }: { product: typeof mocktails[0]; i: number; isInView: boolean }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={isInView ? { opacity: 1, y: 0 } : {}}
      transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
      className="group relative p-5 rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-opacity-100 transition-all duration-300 hover:-translate-y-1"
      style={{ borderColor: "#1a1a1a" }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = `${product.accentColor}40`;
        (e.currentTarget as HTMLElement).style.boxShadow = `0 20px 50px ${product.glowColor}`;
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLElement).style.borderColor = "#1a1a1a";
        (e.currentTarget as HTMLElement).style.boxShadow = "none";
      }}
    >
      <div className="flex items-start justify-between mb-3">
        <div>
          <div
            className="font-display text-lg text-white mb-0.5 leading-tight"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: "0.03em" }}
          >
            {product.name}
          </div>
          <div className="text-white/40 text-xs italic">{product.tagline}</div>
        </div>
        <span className={`text-xs font-bold tracking-wider px-3 py-1.5 rounded-full border shrink-0 ${product.badgeColor}`}>
          {product.badge}
        </span>
      </div>

      <p className="text-white/45 text-sm leading-relaxed mb-4 group-hover:text-white/60 transition-colors">
        {product.description}
      </p>

      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="text-xs text-white/30">
            <span className="font-bold text-white/60">{product.alc}</span> ALC
          </div>
          <div className="w-px h-3 bg-white/10" />
          <div className="text-xs text-white/30">
            <span className="font-bold text-white/60">200</span>ml
          </div>
        </div>
        <a
          href={ORDER_LINK}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[10px] font-bold tracking-[0.15em] uppercase px-4 py-2 rounded-full transition-all duration-300 border"
          style={{ borderColor: `${product.accentColor}30`, color: product.accentColor }}
          onMouseEnter={(e) => {
            (e.currentTarget as HTMLElement).style.background = product.accentColor;
            (e.currentTarget as HTMLElement).style.color = "#fff";
          }}
          onMouseLeave={(e) => {
            (e.currentTarget as HTMLElement).style.background = "transparent";
            (e.currentTarget as HTMLElement).style.color = product.accentColor;
          }}
        >
          Order
        </a>
      </div>
    </motion.div>
  );
}

export default function Products() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="products" ref={ref} className="relative py-24 md:py-36 bg-black overflow-hidden">
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-purple-900/6 blur-[120px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-16 md:mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
          >
            The Collection
          </motion.div>
          <div className="flex flex-col md:flex-row md:items-end md:justify-between gap-6">
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,8vw,90px)] leading-[0.92] text-white"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              PICK YOUR
              <br />
              <span className="text-gradient">POISON.</span>
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.25 }}
              className="text-white/40 text-sm max-w-xs leading-relaxed"
            >
              6 flavors. Zero mixing required.
              <br />
              Powered by poor decisions and great stories.
            </motion.p>
          </div>
        </div>

        {/* Mocktails Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-6 flex items-center gap-4"
        >
          <div
            className="font-display text-2xl md:text-3xl text-white tracking-wide"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            🍹 MOCKTAILS
          </div>
          <div className="text-white/20 text-xs tracking-widest uppercase">Calmer by NITECAP</div>
          <div className="flex-1 h-px bg-white/5" />
          <div className="text-white/30 text-sm font-bold">0% ALC</div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-14">
          {mocktails.map((product, i) => (
            <ProductCard key={product.id} product={product} i={i} isInView={isInView} />
          ))}
        </div>

        {/* Cocktails Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="mb-6 flex items-center gap-4"
        >
          <div
            className="font-display text-2xl md:text-3xl text-white tracking-wide"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            ⭐ COCKTAILS
          </div>
          <div className="text-white/20 text-xs tracking-widest uppercase">Bolder by NITECAP</div>
          <div className="flex-1 h-px bg-white/5" />
          <div className="text-white/30 text-sm font-bold">14% ALC</div>
        </motion.div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {cocktails.map((product, i) => (
            <ProductCard key={product.id} product={product} i={i + 3} isInView={isInView} />
          ))}
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.9 }}
          className="mt-12 text-center"
        >
          <a
            href={ORDER_LINK}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-purple-600 hover:bg-purple-500 text-white font-bold tracking-[0.15em] uppercase text-sm px-10 py-4 rounded-full transition-all duration-300 hover:scale-105"
            style={{ boxShadow: "0 0 30px rgba(168,85,247,0.35)" }}
          >
            Order Now
            <span>→</span>
          </a>
          <p className="mt-4 text-white/20 text-xs tracking-widest uppercase">
            Drink Responsibly. 18+ only.
          </p>
        </motion.div>
      </div>
    </section>
  );
}
