"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";
import type { Student } from "@/types";

// Layout & Shared Components
import Nav from "@/components/layout/Nav";
import Footer from "@/components/layout/Footer";

// Hero & Feature Sections
import HeroScene from "@/components/hero/HeroScene";
import WorkflowSteps from "@/components/sections/WorkflowSteps";
import FixtureBoard from "@/components/sections/FixtureBoard";
import PredictionBoard from "@/components/sections/PredictionBoard";
import Leaderboard from "@/components/sections/Leaderboard";

// Auth Components
import ProfileSetup from "@/components/auth/ProfileSetup";

/* ---------------- Main Landing Page ---------------- */
export default function Landing() {
  const [session, setSession] = useState<Session | null>(null);
  const [student, setStudent] = useState<Student | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

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
      void Promise.resolve().then(() => {
        setStudent(null);
        setLoading(false);
      });
    }
  }, [session]);

  return (
    <div className="dark bg-background text-foreground min-h-screen">
      <Nav />
      <main>
        <HeroScene />

        {!session && <WorkflowSteps />}

        {!session ? null : !student && !loading ? (
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
        ) : null}

        <PredictionBoard
          student={student}
          onLoginRequest={() => {
            router.push("/sign-in");
          }}
        />

        <Leaderboard />
        <FixtureBoard />
      </main>
      <Footer />
    </div>
  );
}
