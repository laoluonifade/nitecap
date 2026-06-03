"use client";

export default function Footer() {
  return (
    <footer className="bg-black border-t border-white/5 py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-5 md:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-10">

          {/* Brand */}
          <div>
            <div
              className="text-3xl font-display text-white mb-2"
              style={{ fontFamily: "'Bebas Neue', Impact, sans-serif", letterSpacing: "0.1em" }}
            >
              NITECAP
            </div>
            <div className="text-white/30 text-xs tracking-[0.2em] uppercase">Open The Moment</div>
          </div>

          {/* Links */}
          <div className="flex flex-wrap gap-6 text-sm text-white/40">
            {[
              { label: "Products", href: "#products" },
              { label: "Story", href: "#story" },
              { label: "The World", href: "#world" },
              { label: "FAQ", href: "#faq" },
              { label: "Instagram", href: "https://instagram.com/nitecapcocktail" },
            ].map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noopener noreferrer" : undefined}
                className="hover:text-white transition-colors tracking-wide"
              >
                {link.label}
              </a>
            ))}
          </div>

          {/* CTA */}
          <a
            href="https://paystack.shop/nitecapcocktail"
            target="_blank"
            rel="noopener noreferrer"
            className="shrink-0 bg-purple-700/30 hover:bg-purple-600 border border-purple-700/50 text-purple-200 hover:text-white text-xs font-bold tracking-[0.2em] uppercase px-6 py-3 rounded-full transition-all duration-300"
          >
            Order Now
          </a>
        </div>

        <div className="mt-12 pt-8 border-t border-white/5 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <p className="text-white/15 text-xs">
            © {new Date().getFullYear()} NITECAP. All rights reserved.
          </p>
          <p className="text-white/15 text-xs">
            Drink Responsibly. 18+ only. 🥔
          </p>
        </div>
      </div>
    </footer>
  );
}
