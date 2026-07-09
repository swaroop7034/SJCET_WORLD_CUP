"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import Section3D from "@/components/shared/Section3D";

interface Node {
  id: string;
  label: string;
  cy: number;
}

interface FixtureRow {
  match_number: number;
  team_a: string;
  team_b: string;
  team_a_source: number | null;
  team_b_source: number | null;
  score_a: number | null;
  score_b: number | null;
  match_date: string;
  winner: string | null;
  played: boolean;
}

const BOX_W = 190;
const BOX_H = 58;
const LEAF_X = 40;
const LEAF_RIGHT = LEAF_X + BOX_W;

const WBOX_W = 110;
const WBOX_H = 36;

const nodes: Node[] = [
  { id: "ME", label: "ME", cy: 175 },
  { id: "CY", label: "CY", cy: 281 },
  { id: "ECS", label: "ECS", cy: 387 },
  { id: "CE_EEE", label: "CE & EEE", cy: 493 },
  { id: "CS-C", label: "CS-C", cy: 599 },
  { id: "EC", label: "EC", cy: 705 },
  { id: "MCA", label: "MCA", cy: 811 },
  { id: "AD", label: "AD", cy: 917 },
  { id: "CS-B", label: "CS-B", cy: 1023 },
  { id: "AI", label: "AI", cy: 1129 },
  { id: "CS-A", label: "CS-A", cy: 1235 },
];

function bracketPath(x1: number, y1: number, x2: number, y2: number, spineX: number, outX: number) {
  const midY = (y1 + y2) / 2;
  return `M ${x1} ${y1} H ${spineX} M ${x2} ${y2} H ${spineX} M ${spineX} ${y1} V ${y2} M ${spineX} ${midY} H ${outX}`;
}

interface Match {
  match_number: number;
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  spineX: number;
  outX: number;
  outY: number;
  hasBox: boolean;
}

const m1Out = { x: 350, y: (281 + 387) / 2 };
const m2Out = { x: 350, y: (493 + 599) / 2 };
const m6Out = { x: 350, y: (811 + 917) / 2 };
const m7Out = { x: 350, y: (1023 + 1129) / 2 };

const m3Out = { x: 600, y: (m1Out.y + 175) / 2 };
const m4Out = { x: 600, y: (m2Out.y + 705) / 2 };
const m8Out = { x: 600, y: (m7Out.y + 1235) / 2 };

const m5Out = { x: 870, y: (m3Out.y + m4Out.y) / 2 };
const m9Out = { x: 870, y: (m6Out.y + m8Out.y) / 2 };

const m10Out = { x: 1140, y: (m5Out.y + m9Out.y) / 2 };
const TROPHY_X = 1160;

const matches: Match[] = [
  { match_number: 1, x1: LEAF_RIGHT, y1: 281, x2: LEAF_RIGHT, y2: 387, spineX: 290, outX: m1Out.x, outY: m1Out.y, hasBox: false },
  { match_number: 2, x1: LEAF_RIGHT, y1: 493, x2: LEAF_RIGHT, y2: 599, spineX: 290, outX: m2Out.x, outY: m2Out.y, hasBox: false },
  { match_number: 3, x1: m1Out.x, y1: m1Out.y, x2: LEAF_RIGHT, y2: 175, spineX: 430, outX: m3Out.x, outY: m3Out.y, hasBox: true },
  { match_number: 4, x1: m2Out.x, y1: m2Out.y, x2: LEAF_RIGHT, y2: 705, spineX: 430, outX: m4Out.x, outY: m4Out.y, hasBox: true },
  { match_number: 5, x1: m3Out.x, y1: m3Out.y, x2: m4Out.x, y2: m4Out.y, spineX: 700, outX: m5Out.x, outY: m5Out.y, hasBox: true },
  { match_number: 6, x1: LEAF_RIGHT, y1: 811, x2: LEAF_RIGHT, y2: 917, spineX: 290, outX: m6Out.x, outY: m6Out.y, hasBox: false },
  { match_number: 7, x1: LEAF_RIGHT, y1: 1023, x2: LEAF_RIGHT, y2: 1129, spineX: 290, outX: m7Out.x, outY: m7Out.y, hasBox: false },
  { match_number: 8, x1: m7Out.x, y1: m7Out.y, x2: LEAF_RIGHT, y2: 1235, spineX: 430, outX: m8Out.x, outY: m8Out.y, hasBox: true },
  { match_number: 9, x1: m6Out.x, y1: m6Out.y, x2: m8Out.x, y2: m8Out.y, spineX: 700, outX: m9Out.x, outY: m9Out.y, hasBox: true },
  { match_number: 10, x1: m5Out.x, y1: m5Out.y, x2: m9Out.x, y2: m9Out.y, spineX: 970, outX: m10Out.x, outY: m10Out.y, hasBox: true },
];

export default function FixtureBoard() {
  const [fixtures, setFixtures] = useState<Record<number, FixtureRow>>({});
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  //   const loadFixtures = () => {
  //     supabase
  //       .from("fixtures")
  //       .select("*")
  //       .order("match_number")
  //       .then(({ data, error }) => {
  //         if (error) {
  //           console.error("Error loading fixtures:", error.message);
  //         } else if (data) {
  //           const map: Record<number, FixtureRow> = {};
  //           (data as FixtureRow[]).forEach((row) => (map[row.match_number] = row));
  //           setFixtures(map);
  //         }
  //         setLoading(false);
  //       });
  //   };

  //   loadFixtures();

  //   const channel = supabase
  //     .channel("fixtures-live")
  //     .on("postgres_changes", { event: "*", schema: "public", table: "fixtures" }, loadFixtures)
  //     .subscribe();

  //   return () => {
  //     supabase.removeChannel(channel);
  //   };
  // }, []);

  const dateLabel = (d: string) => {
    const [, m, day] = d.split("-");
    return `${parseInt(day)}/${parseInt(m)}/26`;
  };

  return (
    <Section3D id="fixtures" className="py-20 bg-background">
      <div className="max-w-6xl mx-auto px-4">
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-2">
          Tournament <span className="text-primary">Fixtures</span>
        </h2>
        <p className="text-center text-muted-foreground mb-10">
          Interdepartment Football Championship — Knockout Bracket
        </p>

        <div className="relative w-full overflow-x-auto scrollbar-hide">
          <div className="min-w-[1100px]">
            <svg viewBox="0 0 1300 1300" className="w-full h-auto" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="boxGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#f97316" />
                  <stop offset="100%" stopColor="#dc2626" />
                </linearGradient>
                <linearGradient id="boxGradWon" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#facc15" />
                  <stop offset="100%" stopColor="#ca8a04" />
                </linearGradient>
                <linearGradient id="boxGradTBD" x1="0%" y1="0%" x2="0%" y2="100%">
                  <stop offset="0%" stopColor="#57534e" />
                  <stop offset="100%" stopColor="#292524" />
                </linearGradient>
              </defs>

              {/* Connector lines */}
              {matches.map((m) => (
                <path
                  key={m.match_number}
                  d={bracketPath(m.x1, m.y1, m.x2, m.y2, m.spineX, m.outX)}
                  fill="none"
                  stroke="url(#lineGrad)"
                  strokeWidth={3}
                  strokeLinecap="round"
                />
              ))}

              {/* Date / score labels */}
              {matches.map((m) => {
                const fx = fixtures[m.match_number];
                const played = fx?.played;
                const topY = Math.min(m.y1, m.y2);
                const dateY = topY - 40;
                const scoreY = topY - 18;
                return (
                  <g key={`label-${m.match_number}`}>
                    <text x={m.spineX} y={dateY} textAnchor="middle" fill="#fff" fontSize={17} fontWeight={700}>
                      {fx ? dateLabel(fx.match_date) : ""}
                    </text>
                    {played && (
                      <text x={m.spineX} y={scoreY} textAnchor="middle" fill="#facc15" fontSize={16} fontWeight={800}>
                        {fx.score_a} - {fx.score_b}
                      </text>
                    )}
                  </g>
                );
              })}

              {/* Winner boxes for matches 3, 4, 5, 8, 9, 10 */}
              {matches
                .filter((m) => m.hasBox)
                .map((m) => {
                  const fx = fixtures[m.match_number];
                  const played = fx?.played;
                  const label = played ? fx?.winner ?? "TBD" : "TBD";
                  const boxX = m.outX - WBOX_W;
                  const boxY = m.outY - WBOX_H / 2;
                  return (
                    <g key={`box-${m.match_number}`}>
                      <rect
                        x={boxX}
                        y={boxY}
                        width={WBOX_W}
                        height={WBOX_H}
                        rx={7}
                        fill={played ? "url(#boxGradWon)" : "url(#boxGradTBD)"}
                        stroke="#fff"
                        strokeOpacity={0.15}
                      />
                      <text
                        x={boxX + WBOX_W / 2}
                        y={boxY + WBOX_H / 2 + 5}
                        textAnchor="middle"
                        fill={played ? "#422006" : "#d6d3d1"}
                        fontSize={14}
                        fontWeight={800}
                      >
                        {label}
                      </text>
                    </g>
                  );
                })}

              <text x={TROPHY_X} y={m10Out.y - 24} fill="#fde68a" fontSize={20} fontWeight={800}>
                Final
              </text>
              <text x={TROPHY_X} y={m10Out.y + 20} fontSize={32}>
                🏆
              </text>

              {nodes.map((n) => {
                const isWinner = [1, 2, 6, 7]
                  .map((num) => fixtures[num])
                  .some((fx) => fx?.played && fx.winner === n.label);
                const isLoserRound1 = [1, 2, 6, 7]
                  .map((num) => fixtures[num])
                  .some(
                    (fx) =>
                      fx?.played &&
                      fx.winner &&
                      fx.winner !== n.label &&
                      (fx.team_a === n.label || fx.team_b === n.label)
                  );

                return (
                  <g key={n.id} opacity={isLoserRound1 ? 0.45 : 1}>
                    <rect
                      x={LEAF_X}
                      y={n.cy - BOX_H / 2}
                      width={BOX_W}
                      height={BOX_H}
                      rx={8}
                      fill={isWinner ? "url(#boxGradWon)" : "url(#boxGrad)"}
                      stroke="#fff"
                      strokeOpacity={0.15}
                    />
                    <text
                      x={LEAF_X + BOX_W / 2}
                      y={n.cy + 7}
                      textAnchor="middle"
                      fill={isWinner ? "#422006" : "#fff"}
                      fontSize={22}
                      fontWeight={800}
                    >
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
          </div>
          {/* {loading && <p className="text-center text-sm text-muted-foreground mt-4">Loading fixtures…</p>} */}
        </div>
      </div>
    </Section3D>
  );
}
