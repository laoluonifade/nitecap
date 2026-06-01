"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const gallery = [
  {
    src: "https://images.unsplash.com/photo-1543807535-eceef0bc6599?w=800&q=85&fit=crop",
    alt: "Young Black woman laughing at a rooftop party",
    span: "col-span-2 row-span-2",
    aspect: "aspect-[4/3] md:aspect-auto md:h-full",
    label: "THE ROOFTOP CREW",
  },
  {
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=600&q=85&fit=crop",
    alt: "Young people dancing at a party with lights",
    span: "",
    aspect: "aspect-square",
    label: "MAIN CHARACTER ENERGY",
  },
  {
    src: "https://images.unsplash.com/photo-1598387993281-cecf8b71a8f8?w=600&q=85&fit=crop",
    alt: "Young Black man smiling with sunglasses",
    span: "",
    aspect: "aspect-square",
    label: "POUR DECISIONS",
  },
  {
    src: "https://images.unsplash.com/photo-1531545514256-b1400bc00f31?w=600&q=85&fit=crop",
    alt: "Group of diverse young friends hanging out together",
    span: "",
    aspect: "aspect-square",
    label: "SQUAD GOALS",
  },
  {
    src: "https://images.unsplash.com/photo-1517457373958-b7bdd4587205?w=800&q=85&fit=crop",
    alt: "Young people at a music festival with neon lights",
    span: "col-span-2",
    aspect: "aspect-[2/1]",
    label: "NO CAP. JUST NITECAP.",
  },
  {
    src: "https://images.unsplash.com/photo-1582213782179-e0d53f98f2ca?w=600&q=85&fit=crop",
    alt: "Friends with arms around each other from behind",
    span: "",
    aspect: "aspect-square",
    label: "THE FUNCTION",
  },
];

const bottomStrip = [
  {
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=500&q=80",
    alt: "DJ spinning at a night event",
  },
  {
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=500&q=80",
    alt: "Concert crowd with purple lights",
  },
  {
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=500&q=80",
    alt: "Music festival crowd at sunset",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=500&q=80",
    alt: "Party sparklers at night",
  },
];

export default function LifestyleGallery() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="relative py-24 md:py-36 bg-[#050505] overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-14 flex flex-col md:flex-row md:items-end md:justify-between gap-6">
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            >
              The Culture
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,8vw,90px)] leading-[0.92] text-white"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              MADE FOR
              <br />
              <span className="text-gradient">YOUR PEOPLE.</span>
            </motion.h2>
          </div>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-white/40 text-sm max-w-xs leading-relaxed"
          >
            Rooftops. Dorm rooms. Beach days.
            <br />
            Wherever the vibe is, NITECAP&apos;s already there.
          </motion.p>
        </div>

        {/* Photo grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 auto-rows-auto">
          {gallery.map((photo, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.15 + i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative rounded-2xl overflow-hidden cursor-pointer ${photo.span} ${photo.aspect}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
              <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/20 transition-colors duration-500" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <motion.div
                  className="text-white font-bold text-xs md:text-sm tracking-[0.1em] uppercase opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300"
                >
                  {photo.label}
                </motion.div>
              </div>

              {/* Purple corner accent on hover */}
              <div className="absolute top-3 right-3 w-2 h-2 rounded-full bg-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </motion.div>
          ))}
        </div>

        {/* Bottom strip — cinematic thin photos */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="grid grid-cols-4 gap-2 mt-3"
        >
          {bottomStrip.map((photo, i) => (
            <div key={i} className="relative aspect-[3/2] rounded-xl overflow-hidden group">
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="25vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110 saturate-[0.6] group-hover:saturate-100"
              />
              <div className="absolute inset-0 bg-purple-900/30 group-hover:bg-purple-900/10 transition-colors duration-300" />
            </div>
          ))}
        </motion.div>

        {/* Tagline */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6, delay: 1 }}
          className="mt-14 text-center"
        >
          <p
            className="font-display text-[clamp(24px,4vw,48px)] leading-tight text-white/70 max-w-2xl mx-auto"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            &ldquo;THE DRINK IS JUST THE INVITATION.
            <span className="text-purple-400"> THE MOMENT IS THE PRODUCT.</span>&rdquo;
          </p>
          <p className="text-white/25 text-xs tracking-widest uppercase mt-4">
            Tag <span className="text-purple-400/60">@nitecapcocktail</span> to be featured
          </p>
        </motion.div>
      </div>

      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />
    </section>
  );
}
