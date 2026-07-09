"use client";

/** Profile setup section for new users */
import { useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";
import Section3D from "@/components/shared/Section3D";

export default function ProfileSetup({
  session,
  onComplete,
}: {
  session: Session;
  onComplete: () => void;
}) {
  const [name, setName] = useState<string>("");
  const [branch, setBranch] = useState<string>("");
  const [year, setYear] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>("");

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const { error: rpcError } = await supabase.rpc("upsert_student", {
      p_name: name,
      p_branch: branch,
      p_year: parseInt(year),
      p_email: session.user.email,
    });
    setLoading(false);
    if (rpcError) setError(rpcError.message);
    else onComplete();
  };

  return (
    <Section3D
      id="profile"
      className="relative py-24 border-y border-border/60 bg-card/30"
    >
      <div className="mx-auto max-w-lg px-6">
        <div className="text-center mb-10">
          <h2 className="font-display text-4xl md:text-5xl">
            Complete Your Profile
          </h2>
          <p className="mt-4 text-sm text-muted-foreground">
            We need your college details before you can predict.
          </p>
        </div>
        <form
          onSubmit={handleSave}
          className="space-y-4 bg-background p-8 rounded-2xl border border-border shadow-elegant"
        >
          {error && (
            <p className="text-red-500 text-sm mb-4 text-center">{error}</p>
          )}
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Name
            </label>
            <input
              required
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none"
              placeholder="John Doe"
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Branch
              </label>
              <select
                required
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none appearance-none"
              >
                <option value="">Select Branch</option>
                <option value="AD">AD</option>
                <option value="CE">CE</option>
                <option value="CS">CS</option>
                <option value="CS(AI)">CS(AI)</option>
                <option value="CY">CY</option>
                <option value="ECE">ECE</option>
                <option value="ECS">ECS</option>
                <option value="EEE">EEE</option>
                <option value="MCA">MCA & IMCA</option>
                <option value="ME">ME</option>
              </select>
            </div>
            <div className="space-y-2">
              <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
                Year
              </label>
              <select
                required
                value={year}
                onChange={(e) => setYear(e.target.value)}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none appearance-none"
              >
                <option value="">Select Year</option>
                <option value="1">1st Year</option>
                <option value="2">2nd Year</option>
                <option value="3">3rd Year</option>
                <option value="4">4th Year</option>
              </select>
            </div>
          </div>
          <div className="space-y-2">
            <label className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
              Email Address (Verified)
            </label>
            <input
              disabled
              type="text"
              value={session.user.email || ""}
              className="w-full bg-muted border border-border rounded-lg px-4 py-3 text-sm opacity-70 cursor-not-allowed"
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="w-full mt-4 rounded-xl bg-primary text-primary-foreground px-6 py-4 text-sm font-bold shadow-glow hover:scale-[1.02] transition-transform disabled:opacity-50"
          >
            {loading ? "Saving..." : "Save Profile & Continue"}
          </button>
        </form>
      </div>
    </Section3D>
  );
}
