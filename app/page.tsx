"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { Student } from "@/types";

// Layout & Shared Components
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";
import Section3D from "@/components/shared/Section3D";

// Hero & Feature Sections
import HeroScene from "@/components/hero/HeroScene";
import WorkflowSteps from "@/components/sections/WorkflowSteps";
import FixtureBoard from "@/components/sections/FixtureBoard";
import PredictionBoard from "@/components/sections/PredictionBoard";
import Leaderboard from "@/components/sections/Leaderboard";

// Auth Components
import EmailAuth from "@/components/auth/EmailAuth";
import ProfileSetup from "@/components/auth/ProfileSetup";

/* ---------------- Main Landing Page ---------------- */
export default function Landing() {
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
    });
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });
    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session?.user?.id) {
      supabase
        .from("students")
        .select("*")
        .eq("auth_id", session.user.id)
        .single()
        .then(({ data }) => {
          setStudent(data);
          setLoading(false);
        });
    } else {
      setStudent(null);
      setLoading(false);
    }
  }, [session]);

  const handleSignOut = () => supabase.auth.signOut();

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <Nav />
      <main>
        <HeroScene />

        {!session && <WorkflowSteps />}

        <FixtureBoard />

        {!session ? (
          <EmailAuth onAuthenticated={() => {}} />
        ) : !student && !loading ? (
          <ProfileSetup
            session={session}
            onComplete={() => {
              supabase
                .from("students")
                .select("*")
                .eq("auth_id", session.user.id)
                .single()
                .then(({ data }) => setStudent(data));
            }}
          />
        ) : (
          student && (
            <Section3D
              id="welcome"
              className="py-8 bg-primary/10 border-y border-primary/20 text-center"
            >
              <p className="text-primary font-semibold text-lg">Welcome back, {student.name}!</p>
              <button
                onClick={handleSignOut}
                className="text-xs underline mt-2 text-muted-foreground hover:text-foreground"
              >
                Sign Out
              </button>
            </Section3D>
          )
        )}

        <PredictionBoard
          student={student}
          onLoginRequest={() => {
            alert("Please log in or complete your profile to lock in predictions!");
            const el = document.getElementById("register") || document.getElementById("profile");
            if (el) el.scrollIntoView({ behavior: "smooth" });
          }}
        />

        <Leaderboard />
      </main>
      <Footer />
    </div>
  );
}
