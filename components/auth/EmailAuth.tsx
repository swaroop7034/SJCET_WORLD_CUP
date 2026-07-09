"use client";

/** Magic link email authentication section */
import { useState } from "react";
import { supabase } from "@/lib/supabase";
import Section3D from "@/components/shared/Section3D";

export default function EmailAuth({
  onAuthenticated,
  sectionId = "register",
}: {
  onAuthenticated: () => void;
  sectionId?: string;
}) {
  const [email, setEmail] = useState("");
  const [step, setStep] = useState<"email" | "sent">("email");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSendLink = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);
    if (error) setError(error.message);
    else setStep("sent");
    void onAuthenticated;
  };

  return (
    <Section3D id={sectionId} className="relative py-16 border-y border-border/60 bg-card/30 ">
      <div className="mx-auto max-w-md px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl md:text-5xl">Student Login</h2>
          <p className="mt-4 text-sm text-muted-foreground">
            Sign in with your email to predict matches.
          </p>
        </div>
        <div className="bg-background p-4 rounded-2xl border border-border shadow-elegant">
          {error && <p className="text-red-500 text-sm mb-4 text-center">{error}</p>}
          {step === "email" ? (
            <form onSubmit={handleSendLink} className="space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                  Email Address
                </label>
                <input
                  required
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none"
                  placeholder="student@college.edu"
                />
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full mt-4 rounded-xl bg-primary text-primary-foreground px-6 py-4 text-sm font-bold shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-50"
              >
                {loading ? "Sending Link..." : "Send Login Link"}
              </button>
            </form>
          ) : (
            <div className="text-center space-y-4">
              <div className="w-16 h-16 bg-primary/20 text-primary mx-auto rounded-full flex items-center justify-center mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M22 13V6a2 2 0 0 0-2-2H4a2 2 0 0 0-2 2v12c0 1.1.9 2 2 2h8"></path>
                  <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7"></path>
                  <path d="m16 19 2 2 4-4"></path>
                </svg>
              </div>
              <h3 className="font-display text-2xl">Check your email!</h3>
              <p className="text-sm text-muted-foreground">
                We sent a magic link to <strong>{email}</strong>.<br /><br />
                Click the link in the email to automatically log in. (You can close this tab if you open the link on this device).
              </p>
              <button
                onClick={() => setStep("email")}
                className="text-xs underline text-muted-foreground hover:text-foreground mt-4"
              >
                Wrong email? Try again.
              </button>
            </div>
          )}
        </div>
      </div>
    </Section3D>
  );
}
