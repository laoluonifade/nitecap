"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const ORDER_LINK = "https://paystack.shop/pay/nitecapcocktail";

const products = [
  {
    id: "chapman",
    name: "BAD DECISIONS, GOOD STORIES",
    flavor: "Chapman",
    description: "The Nigerian classic. Deep ruby red. The one that started it all. No cap.",
    accentColor: "#DC143C",
    glowColor: "rgba(220,20,60,0.25)",
    badge: "Signature",
    badgeColor: "bg-red-900/50 text-red-300 border-red-700/40",
    alc: "14%",
  },
  {
    id: "sex-on-the-beach",
    name: "TEXT THEM TOMORROW",
    flavor: "Sex On The Beach",
    description: "Golden. Tropical. Dangerously easy to drink. Pour decisions you'll gladly make again.",
    accentColor: "#F59E0B",
    glowColor: "rgba(245,158,11,0.25)",
    badge: "Fan Favourite",
    badgeColor: "bg-amber-900/50 text-amber-300 border-amber-700/40",
    alc: "14%",
  },
  {
    id: "sea-breeze",
    name: "LAST ROUND ENERGY",
    flavor: "Sea Breeze",
    description: "Cool blue. Crisp. The kind of energy that keeps the night going. Or the afternoon, we don't judge.",
    accentColor: "#1E90FF",
    glowColor: "rgba(30,144,255,0.25)",
    badge: "Refreshing",
    badgeColor: "bg-blue-900/50 text-blue-300 border-blue-700/40",
    alc: "14%",
  },
  {
    id: "virgin-mojito",
    name: "THE DESIGNATED LEGEND",
    flavor: "Virgin Mojito",
    description: "Zero alcohol. Full respect. The sober one who still makes it a story worth telling.",
    accentColor: "#22C55E",
    glowColor: "rgba(34,197,94,0.25)",
    badge: "Alcohol-Free",
    badgeColor: "bg-green-900/50 text-green-300 border-green-700/40",
    alc: "0%",
  },
  {
    id: "gentle-sea-breeze",
    name: "SOFT LIFE ONLY",
    flavor: "Gentle Sea Breeze",
    description: "Teal calm. Smooth vibes. For the moments when you want the soft life and nothing else.",
    accentColor: "#06B6D4",
    glowColor: "rgba(6,182,212,0.25)",
    badge: "Mellow",
    badgeColor: "bg-cyan-900/50 text-cyan-300 border-cyan-700/40",
    alc: "14%",
  },
  {
    id: "amaretto-sour",
    name: "ONE MORE FOR THE ROAD",
    flavor: "Amaretto Sour",
    description: "Golden amber. Sweet and tangy. The one you say is your last. It never is.",
    accentColor: "#D97706",
    glowColor: "rgba(217,119,6,0.25)",
    badge: "Bold",
    badgeColor: "bg-orange-900/50 text-orange-300 border-orange-700/40",
    alc: "14%",
  },
];

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
              Your pour decisions, pre-made.
            </motion.p>
          </div>
        </div>

        {/* Full product lineup image */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mb-16 rounded-3xl overflow-hidden border border-purple-700/20"
          style={{ boxShadow: "0 0 80px rgba(124,58,237,0.15)" }}
        >
          <Image
            src="/images/product-lineup.png"
            alt="NITECAP full product lineup — six premixed cocktail pouches"
            width={1086}
            height={1448}
            className="w-full h-auto"
            priority
          />
        </motion.div>

        {/* Product info cards */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product, i) => (
            <motion.div
              key={product.id}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.3 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-5 rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-opacity-100 transition-all duration-300 hover:-translate-y-1"
              style={{
                borderColor: `${product.accentColor}00`,
              }}
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
                  <div className="text-white/30 text-xs tracking-widest uppercase">{product.flavor}</div>
                </div>
                <span className={`text-[10px] font-semibold tracking-wider px-2.5 py-1 rounded-full border shrink-0 ${product.badgeColor}`}>
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
                  style={{
                    borderColor: `${product.accentColor}30`,
                    color: product.accentColor,
                  }}
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
        </motion.div>
      </div>
    </section>
  );
}
