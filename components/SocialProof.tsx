"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    handle: "@temi.ade",
    name: "Temi A.",
    review:
      "Brought these to a rooftop party and everyone lost their minds 🔥 The Sex On The Beach went first. We finished all six in 20 minutes.",
    stars: 5,
    tag: "Sex On The Beach",
    tagColor: "#F97316",
    time: "2d ago",
  },
  {
    handle: "@kemi.lagos",
    name: "Kemi B.",
    review:
      "Finally a drink that fits in my bag. No more lukewarm bottles. No more spillage. Just vibes in a pouch. NITECAP really understood the assignment 💜",
    stars: 5,
    tag: "All Flavors",
    tagColor: "#7C3AED",
    time: "2w ago",
  },
];

function StarRating({ count }: { count: number }) {
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} size={12} className="fill-purple-400 text-purple-400" />
      ))}
    </div>
  );
}

export default function SocialProof() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-36 bg-[#050505] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-16 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            >
              The Reviews
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,7vw,80px)] leading-[0.92] text-white"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              THEY&apos;RE
              <br />
              <span className="text-gradient">TALKING.</span>
            </motion.h2>
          </div>
        </div>

        {/* Review Grid */}
        <div className="grid md:grid-cols-2 gap-5 max-w-3xl mx-auto">
          {reviews.map((review, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.1 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="group relative p-6 rounded-2xl bg-[#0f0f0f] border border-[#1a1a1a] hover:border-purple-700/30 transition-all duration-300"
            >
              {/* Top */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  {/* Avatar */}
                  <div
                    className="w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shrink-0"
                    style={{ background: `linear-gradient(135deg, ${review.tagColor}60, rgba(124,58,237,0.4))` }}
                  >
                    {review.name[0]}
                  </div>
                  <div>
                    <div className="text-white text-sm font-semibold">{review.name}</div>
                    <div className="text-white/30 text-xs">{review.handle}</div>
                  </div>
                </div>
                <div className="text-white/20 text-xs">{review.time}</div>
              </div>

              <StarRating count={review.stars} />

              <p className="mt-3 text-white/60 text-sm leading-relaxed mb-4 group-hover:text-white/75 transition-colors">
                &ldquo;{review.review}&rdquo;
              </p>

              <span
                className="text-xs font-semibold px-3 py-1 rounded-full"
                style={{
                  background: review.tagColor + "20",
                  color: review.tagColor,
                  border: `1px solid ${review.tagColor}30`,
                }}
              >
                {review.tag}
              </span>
            </motion.div>
          ))}
        </div>

        {/* UGC CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-12 text-center"
        >
          <p className="text-white/30 text-sm mb-2">
            Tag <span className="text-purple-400 font-semibold">@nitecapcocktail</span> to be featured
          </p>
          <p className="text-white/20 text-xs tracking-widest uppercase">
            Your moment could be next
          </p>
        </motion.div>
      </div>
    </section>
  );
}
