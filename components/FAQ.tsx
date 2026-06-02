"use client";

import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { Plus, Minus } from "lucide-react";

const faqs = [
  {
    q: "Where do you deliver?",
    a: "We deliver across Nigeria. Wherever you are, we&apos;ll get it to you. Follow @nitecapcocktail for updates on new locations and pop-ups.",
  },
  {
    q: "How do I order?",
    a: "Click any 'Order Now' button on this page. It takes you directly to our secure Paystack checkout. Simple, fast, no app needed.",
  },
  {
    q: "Do you have non-alcoholic options?",
    a: "Yes! NITECAP Zero is our Hibiscus Citrus mocktail. Zero alcohol, all the vibes. Perfect for designated drivers, sober-curious nights, or anyone who just wants to enjoy the moment without the ABV.",
  },
  {
    q: "What's the alcohol content?",
    a: "Our wine and spirit-based cocktails (Chapman and Pineapple Rum) are 14% ALC/VOL. Real cocktail energy in every 200ml pouch. NITECAP Zero is 0%.",
  },
  {
    q: "Can I order in bulk for events?",
    a: "Absolutely. We do bulk orders for parties, events, festivals, and corporate functions. DM us on Instagram @nitecapcocktail or email us. The more, the better.",
  },
  {
    q: "How long does delivery take?",
    a: "Delivery times depend on your location across Nigeria. You&apos;ll get a confirmation as soon as your order is placed with tracking details.",
  },
  {
    q: "How should I store NITECAP?",
    a: "Best served chilled. Store in the fridge or pack with ice for outdoor events. Once opened, consume immediately. But you won't have a problem finishing it.",
  },
  {
    q: "Is NITECAP available at events or pop-ups?",
    a: "We show up where the vibe is. Follow @nitecapcocktail to stay updated on festivals, markets, and events we're at. You might catch us at your next function.",
  },
];

function FAQItem({ faq, index }: { faq: { q: string; a: string }; index: number }) {
  const [open, setOpen] = useState(false);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06 }}
      className="border-b border-white/5"
    >
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between py-6 text-left gap-4 group"
      >
        <span className={`text-base md:text-lg font-medium transition-colors duration-200 ${open ? "text-white" : "text-white/60 group-hover:text-white/80"}`}>
          {faq.q}
        </span>
        <span
          className="shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300"
          style={{
            background: open ? "rgba(124,58,237,0.8)" : "rgba(255,255,255,0.05)",
            border: open ? "1px solid rgba(168,85,247,0.5)" : "1px solid rgba(255,255,255,0.08)",
          }}
        >
          {open ? <Minus size={14} className="text-white" /> : <Plus size={14} className="text-white/50" />}
        </span>
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.35, ease: [0.4, 0, 0.2, 1] }}
            className="overflow-hidden"
          >
            <p className="pb-6 text-white/50 text-sm md:text-base leading-relaxed max-w-2xl">
              {faq.a}
            </p>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

export default function FAQ() {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section id="faq" ref={ref} className="relative py-24 md:py-36 bg-black overflow-hidden">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-px bg-gradient-to-r from-transparent via-purple-700/40 to-transparent" />

      <div className="max-w-5xl mx-auto px-5 md:px-8">
        <div className="grid md:grid-cols-[1fr_2fr] gap-16 md:gap-20">

          {/* Left */}
          <div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6 }}
              className="text-purple-400 text-xs font-semibold tracking-[0.3em] uppercase mb-4"
            >
              Got Questions
            </motion.div>
            <motion.h2
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.7, delay: 0.1 }}
              className="font-display text-[clamp(48px,6vw,72px)] leading-[0.92] text-white mb-8"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif" }}
            >
              WE&apos;VE
              <br />
              GOT
              <br />
              <span className="text-gradient">ANSWERS.</span>
            </motion.h2>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.6, delay: 0.35 }}
              className="p-5 rounded-2xl bg-purple-950/20 border border-purple-700/30"
            >
              <p className="text-white/50 text-sm leading-relaxed mb-4">
                Still have questions? We're real people. Hit us up.
              </p>
              <a
                href="https://instagram.com/nitecapcocktail"
                target="_blank"
                rel="noopener noreferrer"
                className="text-purple-400 text-sm font-semibold hover:text-purple-300 transition-colors"
              >
                @nitecapcocktail →
              </a>
            </motion.div>
          </div>

          {/* Right — Accordion */}
          <div>
            {faqs.map((faq, i) => (
              <FAQItem key={i} faq={faq} index={i} />
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}
