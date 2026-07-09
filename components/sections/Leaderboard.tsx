"use client";

/** Leaderboard section - ranks users based on prediction accuracy */
import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Section3D from "@/components/shared/Section3D";
import type { Player } from "@/types";

export default function Leaderboard() {
  const [players, setPlayers] = useState<Player[]>([]);

  useEffect(() => {
    supabase
      .rpc("get_leaderboard")
      .limit(10)
      .then(({ data }) => {
        if (data) setPlayers(data);
      });
  }, []);

  return (
    <Section3D id="leaderboard" className="relative py-28 bg-card/40 border-y border-border/60">
      <div className="mx-auto max-w-4xl px-6">
        <div className="text-center mb-12">
          <p className="text-primary text-sm font-semibold tracking-widest uppercase">Rankings</p>
          <h2 className="mt-2 font-display text-5xl md:text-6xl">Leaderboard</h2>
        </div>
        <div className="bg-background rounded-2xl border border-border shadow-elegant overflow-hidden">
          <div className="grid grid-cols-12 gap-4 p-4 border-b border-border/60 bg-muted/30 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <div className="col-span-2 text-center">Rank</div>
            <div className="col-span-5">Student</div>
            <div className="col-span-3 text-center hidden md:block">Branch &amp; Year</div>
            {/* <div className="col-span-5 md:col-span-2 text-right pr-4">Points</div> */}
          </div>
          <div className="divide-y divide-border/40">
            {players.length === 0 && (
              <p className="text-center py-8 text-muted-foreground">No data yet.</p>
            )}
            {players.map((p) => (
              <div
                key={p.id}
                className="grid grid-cols-12 gap-4 p-4 items-center hover:bg-primary/5 transition group"
              >
                <div className="col-span-2 text-center">
                  <span
                    className={`inline-flex items-center justify-center w-8 h-8 rounded-full font-bold ${p.rank === 1 ? "bg-yellow-500/20 text-yellow-500" : p.rank === 2 ? "bg-slate-300/20 text-slate-300" : p.rank === 3 ? "bg-amber-700/20 text-amber-600" : "text-muted-foreground"}`}
                  >
                    {p.rank}
                  </span>
                </div>
                <div className="col-span-5 font-semibold text-foreground text-lg">{p.name}</div>
                <div className="col-span-3 text-center hidden md:block text-sm text-muted-foreground">
                  {p.branch} - Year {p.year}
                </div>
                {/* <div className="col-span-5 md:col-span-2 text-right pr-4 font-display text-2xl text-primary">
                  {p.total_points}
                </div> */}
              </div>
            ))}
          </div>
        </div>
      </div>
    </Section3D>
  );
}
