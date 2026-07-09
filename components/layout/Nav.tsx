"use client";

/** Sticky navigation bar that appears on scroll */
import { useState, useEffect } from "react";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled ? "backdrop-blur-xl bg-background/70 border-b border-border/60" : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-glow">
            <span className="font-display text-primary-foreground text-lg">P</span>
          </div>
          <span className="font-display text-xl tracking-widest">
            PREDICT<span className="text-primary">26</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Fixtures", "Matches", "Leaderboard", "My Predictions", "Rules"].map((l) => (
            <a
              key={l}
              href={`#${l.toLowerCase().replace(" ", "-")}`}
              className="relative text-muted-foreground hover:text-foreground transition-colors after:content-[''] after:absolute after:left-0 after:-bottom-1 after:h-0.5 after:w-0 after:bg-primary after:transition-all hover:after:w-full"
            >
              {l}
            </a>
          ))}
        </nav>
        <div className="flex items-center gap-3">
          <a
            href="#fixtures"
            className="inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-4 py-2 text-sm font-semibold text-primary transition hover:bg-primary/20"
          >
            Fixtures
          </a>
          <a
            href="#register"
            className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
          >
            Sign In
            <span aria-hidden>→</span>
          </a>
        </div>
      </div>
    </header>
  );
}
