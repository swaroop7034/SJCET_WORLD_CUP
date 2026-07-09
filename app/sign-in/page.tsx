"use client";

import Link from "next/link";
import { useState } from "react";
import { createClient } from "@supabase/supabase-js";
import EmailAuth from "@/components/auth/EmailAuth";

// 1. Initialize Supabase using Next.js public environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
const supabase = createClient(supabaseUrl, supabaseKey);

export default function SignInPage() {
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);

  // 2. The Google OAuth Function
  const signInWithGoogle = async () => {
    setIsGoogleLoading(true);
    const { error } = await supabase.auth.signInWithOAuth({
      provider: "google",
      options: {
        // window.location.origin dynamically grabs localhost:3000 locally or your real domain in production
        redirectTo: `${typeof window !== "undefined" ? window.location.origin : ""}/dashboard`,
      },
    });

    if (error) {
      console.error("Error logging in with Google:", error.message);
      setIsGoogleLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-background text-foreground px-2 py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center gap-8">
        
        {/* Header Section */}
        <div className="text-center">
          <p className="text-primary text-sm font-semibold tracking-[0.3em] uppercase">
            Predict26
          </p>
          <h1 className="mt-3 font-display text-3xl md:text-6xl">
            Sign in to predict
          </h1>
          <p className="mt-4 text-sm text-muted-foreground max-w-2xl mx-auto">
            Continue with Google or use your college email to get a magic link, then return to lock in your predictions.
          </p>
        </div>

        {/* Auth Card */}
        <div className="w-full max-w-2xl p-6 sm:p-10 overflow-hidden rounded-[2rem] border border-border bg-card/30 shadow-elegant flex flex-col gap-8">
          
          {/* 3. Google Login Button */}
          <button
            onClick={signInWithGoogle}
            disabled={isGoogleLoading}
            className="flex w-full items-center justify-center gap-3 rounded-xl bg-foreground px-4 py-3.5 text-sm font-semibold text-background transition-transform active:scale-[0.98] hover:bg-foreground/90 disabled:opacity-50 disabled:active:scale-100"
          >
            {isGoogleLoading ? (
              <span className="animate-pulse">Connecting to Google...</span>
            ) : (
              <>
                <svg className="h-5 w-5 bg-white rounded-full p-0.5" viewBox="0 0 24 24">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                  <path d="M1 1h22v22H1z" fill="none" />
                </svg>
                Continue with Google
              </>
            )}
          </button>

          {/* 4. Visual Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-border"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-[#f8f9fa] dark:bg-[#09090b] px-4 text-muted-foreground">
                Or continue with email
              </span>
            </div>
          </div>

          {/* 5. Original Email Auth */}
          <div className="w-full">
            <EmailAuth onAuthenticated={() => {}} sectionId="sign-in" />
          </div>

        </div>

        {/* Footer Link */}
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