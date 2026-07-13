"use client";

/** Sticky navigation bar that appears on scroll */
import { useState, useEffect } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { Student } from "@/types";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<Student | null>(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (!session?.user?.id) {
      setStudent(null);
      return;
    }

    supabase
      .from("students")
      .select("*")
      .eq("auth_id", session.user.id)
      .maybeSingle()
      .then(({ data }) => {
        setStudent(data);
      });
  }, [session]);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setStudent(null);
    setSession(null);
  };

  const displayName =
    student?.name || session?.user?.user_metadata?.full_name || "Member";

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-300 ${
        scrolled
          ? "backdrop-blur-xl bg-background/70 border-b border-border/60"
          : "bg-transparent"
      }`}
    >
      <div className="mx-auto max-w-7xl px-6 h-16 flex items-center justify-between">
        <a href="#top" className="flex items-center gap-2 group">
          <div className="relative h-8 w-8 rounded-full bg-primary flex items-center justify-center shadow-glow">
            <span className="font-display text-primary-foreground text-lg">
              P
            </span>
          </div>
          <span className="font-display text-xl tracking-widest">
            PREDICT<span className="text-primary">26</span>
          </span>
        </a>
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
          {["Matches", "Leaderboard", "Rules"].map((l) => (
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
          {session ? (
            <>
              <div className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-card/80 px-4 py-2 text-sm font-semibold text-foreground">
                <span
                  className="h-2 w-2 rounded-full bg-primary shadow-glow"
                  aria-hidden
                />
                {displayName}
              </div>
              <button
                type="button"
                onClick={handleSignOut}
                className="text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
              >
                Sign Out
              </button>
            </>
          ) : (
            <Link
              href="/sign-in"
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground shadow-glow hover:scale-105 transition-transform"
            >
              Sign In
              <span aria-hidden>→</span>
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
