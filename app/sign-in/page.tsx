"use client";

import Link from "next/link";
import EmailAuth from "@/components/auth/EmailAuth";

export default function SignInPage() {
  return (
    <main className="h=[100vh] bg-background text-foreground px-2 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        <div className="text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">Predict26</p>
          <h1 className="mt-3 font-display text-3xl md:text-6xl">Sign in to predict</h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-2xl mx-auto">
            Use your college email to get a magic link, then return to lock in your predictions.
          </p>
        </div>

        <div className="w-full max-w-2xl overflow-hidden rounded-[2rem] border border-border bg-card/30 shadow-elegant">
          <EmailAuth onAuthenticated={() => {}} sectionId="sign-in" />
        </div>

        <Link
          href="/"
          className="text-sm text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Back to home
        </Link>
      </div>
    </main>
  );
}