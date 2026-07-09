"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import ProfileSetup from "@/components/auth/ProfileSetup";

export default function ProfileSetupPage() {
  const router = useRouter();
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, nextSession) => {
      setSession(nextSession);
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    return (
      <main className="dark min-h-screen bg-background px-4 py-14 text-foreground">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl items-center justify-center">
          <p className="text-sm text-muted-foreground">
            Loading profile setup...
          </p>
        </div>
      </main>
    );
  }

  if (!session) {
    return (
      <main className="dark min-h-screen bg-background px-4 py-14 text-foreground">
        <div className="mx-auto flex min-h-[60vh] max-w-3xl flex-col items-center justify-center text-center">
          <p className="text-sm font-semibold uppercase tracking-[0.3em] text-primary">
            Predict26
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-5xl">
            Sign in to complete your profile
          </h1>
          <p className="mt-4 max-w-xl text-sm text-muted-foreground">
            Your profile setup is available after authentication.
          </p>
          <Link
            href="/sign-in"
            className="mt-8 rounded-xl bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition-transform hover:scale-[1.02]"
          >
            Go to sign in
          </Link>
        </div>
      </main>
    );
  }

  return <ProfileSetup session={session} onComplete={() => router.push("/")} />;
}
