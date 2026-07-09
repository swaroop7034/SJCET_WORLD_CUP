"use client";

/** Prediction Board - shows upcoming matches for users to predict */
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Section3D from "@/components/shared/Section3D";
import type { Student, Match } from "@/types";

export default function PredictionBoard({
  student,
  onLoginRequest,
}: {
  student: Student | null;
  onLoginRequest: () => void;
}) {
  const [matches, setMatches] = useState<Match[]>([]);

  useEffect(() => {
    supabase
      .from("matches")
      .select("*")
      .eq("status", "upcoming")
      .then(({ data }) => {
        if (data) setMatches(data);
      });
  }, []);

  const handlePredict = async (matchId: string, teamA: string, teamB: string) => {
    void teamA;
    void teamB;
    if (!student) {
      onLoginRequest();
      return;
    }
    const scoreA = (document.getElementById(`scoreA_${matchId}`) as HTMLInputElement).value;
    const scoreB = (document.getElementById(`scoreB_${matchId}`) as HTMLInputElement).value;
    const winner = (document.getElementById(`winner_${matchId}`) as HTMLSelectElement).value;

    if (!scoreA || !scoreB || !winner) return alert("Please fill all fields");

    const { error } = await supabase.from("predictions").upsert(
      {
        student_id: student.id,
        match_id: matchId,
        predicted_score_a: parseInt(scoreA),
        predicted_score_b: parseInt(scoreB),
        predicted_winner: winner,
      },
      { onConflict: "student_id,match_id" },
    );

    if (error) alert(error.message);
    else alert("Prediction Locked!");
  };

  return (
    <Section3D id="matches" className="relative py-28">
      <div className="mx-auto max-w-5xl px-6">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase">
            Predict &amp; Win
          </p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl">Upcoming Matches</h2>
          <p className="mt-4 text-muted-foreground">
            Lock in your predictions before the deadline.
          </p>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          {matches.length === 0 && (
            <p className="text-center col-span-2 text-muted-foreground">
              No upcoming matches found.
            </p>
          )}
          {matches.map((m) => (
            <div
              key={m.id}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-6 shadow-elegant hover:border-primary/50 transition"
            >
              <div className="flex justify-between items-center mb-6">
                <span className="text-xs font-bold uppercase tracking-widest text-primary bg-primary/10 px-3 py-1 rounded-full">
                  {m.stage.replace("_", " ")}
                </span>
                <span className="text-xs text-muted-foreground font-mono">
                  {new Date(m.match_date).toLocaleString()}
                </span>
              </div>
              <div className="flex justify-between items-center mb-8">
                <div className="text-center flex-1">
                  <div className="font-display text-2xl">{m.team_a}</div>
                </div>
                <div className="text-xs font-bold text-muted-foreground px-4">VS</div>
                <div className="text-center flex-1">
                  <div className="font-display text-2xl">{m.team_b}</div>
                </div>
              </div>

              <div className="bg-background rounded-xl p-4 border border-border/50">
                <p className="text-xs text-center text-muted-foreground mb-4 uppercase tracking-wider font-semibold">
                  Your Prediction
                </p>
                <div className="flex items-center justify-center gap-4 mb-4">
                  <input
                    id={`scoreA_${m.id}`}
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    className="w-16 h-12 text-center text-xl font-bold bg-card border border-border rounded-lg focus:border-primary focus:outline-none"
                  />
                  <span className="text-muted-foreground">-</span>
                  <input
                    id={`scoreB_${m.id}`}
                    type="number"
                    min="0"
                    max="20"
                    placeholder="0"
                    className="w-16 h-12 text-center text-xl font-bold bg-card border border-border rounded-lg focus:border-primary focus:outline-none"
                  />
                </div>
                <select
                  id={`winner_${m.id}`}
                  className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm focus:border-primary focus:outline-none appearance-none mb-4 text-center font-semibold"
                >
                  <option value="">Select Winning Team</option>
                  <option value={m.team_a}>{m.team_a}</option>
                  <option value={m.team_b}>{m.team_b}</option>
                  <option value="draw">Draw (Goes to Penalties)</option>
                </select>
                <button
                  onClick={() => handlePredict(m.id, m.team_a, m.team_b)}
                  className="w-full rounded-lg bg-primary/20 text-primary border border-primary/30 px-4 py-3 text-sm font-bold hover:bg-primary hover:text-primary-foreground transition-colors"
                >
                  {student ? "Lock Prediction" : "Log In To Predict"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Section3D>
  );
}
