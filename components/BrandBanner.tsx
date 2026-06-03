"use client";

import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import Image from "next/image";

export default function BrandBanner() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-60px" });

  return (
    <section ref={ref} className="relative bg-black overflow-hidden">
      <motion.div
        initial={{ opacity: 0, scale: 1.05 }}
        animate={isInView ? { opacity: 1, scale: 1 } : {}}
        transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        className="relative w-full"
      >
        <Image
          src="/images/hero-banner.png"
          alt="NITECAP — Open The Moment. The Potato mascot with the full cocktail and mocktail lineup"
          width={1774}
          height={887}
          className="w-full h-auto"
          priority
        />
        {/* Fade edges into black */}
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(180deg, rgba(0,0,0,0.6) 0%, transparent 20%, transparent 80%, rgba(0,0,0,0.8) 100%)",
          }}
        />
        <div className="absolute inset-0 pointer-events-none"
          style={{
            background: "linear-gradient(90deg, rgba(0,0,0,0.4) 0%, transparent 15%, transparent 85%, rgba(0,0,0,0.4) 100%)",
          }}
        />
      </motion.div>
    </section>
  );
}
