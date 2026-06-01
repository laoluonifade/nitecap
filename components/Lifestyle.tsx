"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

const photos = [
  {
    id: "hero",
    src: "https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=1200&q=85",
    alt: "Rooftop party with city lights",
    label: "Rooftop Szn",
    sub: "City lights hit different with a NITECAP in hand.",
    col: "md:col-span-2 md:row-span-2",
    aspect: "aspect-[4/3] md:aspect-auto md:h-full",
    textSize: "text-2xl md:text-3xl",
  },
  {
    id: "festival",
    src: "https://images.unsplash.com/photo-1506157786151-b8491531f063?w=800&q=85",
    alt: "Music festival crowd at night",
    label: "Festival Ready",
    sub: "The only thing lighter than your bag.",
    col: "",
    aspect: "aspect-[4/3]",
    textSize: "text-lg",
  },
  {
    id: "beach",
    src: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=800&q=85",
    alt: "Beach day golden hour",
    label: "Beach Day",
    sub: "Sand, sun, NITECAP. Classic.",
    col: "",
    aspect: "aspect-[4/3]",
    textSize: "text-lg",
  },
  {
    id: "party",
    src: "https://images.unsplash.com/photo-1529156069935-4d463a986e12?w=800&q=85",
    alt: "Friends at a house party",
    label: "House Party",
    sub: "The drink everyone asks about.",
    col: "",
    aspect: "aspect-[4/3]",
    textSize: "text-lg",
  },
  {
    id: "night",
    src: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&q=85",
    alt: "Night out city energy",
    label: "The After-After",
    sub: "Still going? Same.",
    col: "",
    aspect: "aspect-[4/3]",
    textSize: "text-lg",
  },
];

const strip = [
  {
    src: "https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=600&q=80",
    alt: "DJ at night event",
    label: "Lagos Nights",
  },
  {
    src: "https://images.unsplash.com/photo-1528495612343-9ca9f755e9e7?w=600&q=80",
    alt: "Friends cheersing drinks",
    label: "The Crew",
  },
  {
    src: "https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=600&q=80",
    alt: "Concert lights and crowd",
    label: "Festival Season",
  },
  {
    src: "https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=600&q=80",
    alt: "Rooftop evening gathering",
    label: "Rooftop Vibes",
  },
  {
    src: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=600&q=80",
    alt: "Colourful drinks flat lay",
    label: "The Drinks",
  },
  {
    src: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=600&q=80",
    alt: "Airplane window night travel",
    label: "Night Travels",
  },
];

export default function Lifestyle() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section id="world" ref={ref} className="relative py-24 md:py-36 bg-[#050505] overflow-hidden">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/3 right-1/4 w-[500px] h-[500px] rounded-full bg-purple-900/8 blur-[120px]" />
      </div>

      <div className="max-w-7xl mx-auto px-5 md:px-8">
        {/* Header */}
        <div className="mb-14">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
            className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
          >
            The World of Nitecap
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="font-display text-[clamp(48px,8vw,90px)] leading-[0.92] text-white"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            THE FUNCTION
            <br />
            <span className="text-gradient">STARTS HERE.</span>
          </motion.h2>
        </div>

        {/* Main photo grid */}
        <div className="grid md:grid-cols-4 md:grid-rows-2 gap-3 md:h-[600px]">
          {photos.map((photo, i) => (
            <motion.div
              key={photo.id}
              initial={{ opacity: 0, scale: 0.97 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.1 + i * 0.1, ease: [0.16, 1, 0.3, 1] }}
              className={`group relative overflow-hidden rounded-2xl ${photo.col} ${photo.aspect}`}
            >
              <Image
                src={photo.src}
                alt={photo.alt}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {/* Dark overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
              {/* Purple tint on hover */}
              <div className="absolute inset-0 bg-purple-900/0 group-hover:bg-purple-900/20 transition-colors duration-500" />
              {/* Text */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className={`font-bold text-white leading-tight mb-1 ${photo.textSize}`}>
                  {photo.label}
                </div>
                <div className="text-white/50 text-xs leading-relaxed opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                  {photo.sub}
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Strip row */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 0.7 }}
          className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-3"
        >
          {strip.map((tile, i) => (
            <motion.div
              key={tile.label}
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.75 + i * 0.06 }}
              className="group relative aspect-square rounded-xl overflow-hidden"
            >
              <Image
                src={tile.src}
                alt={tile.alt}
                fill
                sizes="(max-width: 768px) 33vw, 17vw"
                className="object-cover transition-transform duration-500 group-hover:scale-110"
              />
              <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors duration-300" />
              <div className="absolute inset-0 flex items-end p-2">
                <span className="text-white/70 text-[10px] font-medium tracking-wide leading-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                  {tile.label}
                </span>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Editorial quote */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7, delay: 1 }}
          className="mt-20 text-center"
        >
          <p
            className="font-display text-[clamp(28px,5vw,56px)] leading-tight text-white/80 max-w-3xl mx-auto"
            style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
          >
            &ldquo;THE DRINK IS JUST THE INVITATION.
            <span className="text-purple-400"> THE MEMORY IS THE PRODUCT.</span>&rdquo;
          </p>
        </motion.div>
      </div>
    </section>
  );
}
