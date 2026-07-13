"use client";

/**
 * Scroll-driven hero scene with animated footballer, ball trajectory,
 * goal net deformation, and parallax particles.
 */
import { useRef, useState } from "react";
import {
  motion,
  useScroll,
  useTransform,
  useMotionValueEvent,
  useSpring,
  MotionValue,
} from "motion/react";

/* ---------- Net sub-components ---------- */
function HorizontalNetLine({ y, netDeformX }: { y: number; netDeformX: MotionValue<number> }) {
  const factor = Math.sin((Math.PI * y) / 150);
  const path = useTransform(netDeformX, (dx: number) => {
    // Back diagonal from x=60 to x=150
    const backX = 60 + (y / 150) * 90 + dx * factor * 1.5;
    return `M 0,${y} L ${backX},${y}`;
  });
  return <motion.path d={path} />;
}

function VerticalNetLine({
  x,
  netDeformX,
}: {
  x: number;
  netDeformX: MotionValue<number>;
}) {
  // If x <= 60, top is y=0. Else on diagonal
  const topY = x <= 60 ? 0 : (x - 60) * (150 / 90);
  const path = useTransform(netDeformX, (dx: number) => {
    const bulge = dx * (x / 150);
    return `M ${x},${topY} Q ${x + bulge},${(topY + 150) / 2} ${x},150`;
  });
  return <motion.path d={path} />;
}

/* ---------- SVG articulated body part ---------- */
function BodyPart({
  children,
  rotate,
  cx,
  cy,
}: {
  children: React.ReactNode;
  rotate: MotionValue<number>;
  cx: number;
  cy: number;
}) {
  const transform = useTransform(
    rotate,
    (r) => `translate(${cx}, ${cy}) rotate(${r}) translate(${-cx}, ${-cy})`
  );
  return <motion.g transform={transform}>{children}</motion.g>;
}

/* ---------- 3D floating particles ---------- */
// Use a simple seeded PRNG so server and client HTML perfectly match!
const pseudoRandom = (seed: number) => {
  const x = Math.sin(seed * 12.9898) * 43758.5453;
  return x - Math.floor(x);
};

const PARTICLES = Array.from({ length: 18 }).map((_, i) => {
  const rnd = (offset: number) => pseudoRandom(i * 10 + offset);
  return {
    id: i,
    left: `${5 + rnd(1) * 90}%`,
    top: `${10 + rnd(2) * 75}%`,
    z: -150 + rnd(3) * 400,
    size: 2 + rnd(4) * 3,
    dx: `${-30 + rnd(5) * 60}px`,
    dy: `${-80 + rnd(6) * 40}px`,
    dz: `${-20 + rnd(7) * 60}px`,
    duration: `${5 + rnd(8) * 6}s`,
    delay: `${rnd(9) * 5}s`,
    hue: 130 + rnd(10) * 30,
  };
});

/* ================================================
   Main exported component
   ================================================ */
export default function HeroScene() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrapRef,
    offset: ["start start", "end end"],
  });

  // Smooth the scroll value
  const p = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.4 });

  // Player wind-up and kick transforms
  const playerX = useTransform(p, [0, 0.25, 0.28, 0.32, 0.5, 1.0], [-120, 0, 15, 25, 30, 30]);
  const playerY = useTransform(p, [0, 0.07, 0.14, 0.21, 0.28, 0.4, 1.0], [0, -8, 0, -8, 0, 0, 0]);

  const torsoRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [5, 8, -5, -15, -20, -10, 0],
  );

  // Left Leg (Plant leg - Far leg)
  const plantThighRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [15, -10, 25, -8, -15, -5, 0],
  );
  const plantCalfRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [15, 20, 10, 35, 15, 10, 5],
  );
  const plantFootRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [-10, 0, -20, -15, 10, 5, 0],
  );

  // Right Leg (Kicking leg - Near leg)
  const kickThighRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [-15, 20, -55, 30, 65, 30, 10],
  );
  const kickCalfRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [25, 10, 95, 5, 10, 15, 10],
  );
  const kickFootRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [0, 10, -30, 15, 25, 10, 0],
  );

  // Left Arm (Far arm)
  const leftUpperArmRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [-20, 30, 60, -15, -45, -25, -10],
  );
  const leftForearmRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [30, 45, 60, 20, 15, 20, 20],
  );

  // Right Arm (Near arm)
  const rightUpperArmRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [30, -15, -45, 50, 75, 40, 15],
  );
  const rightForearmRot = useTransform(
    p,
    [0, 0.1, 0.2, 0.28, 0.4, 0.6, 1.0],
    [40, 30, 20, 50, 40, 30, 30],
  );

  // Ball trajectory across the field into the goal (SVG coords)
  const ballX = useTransform(
    p,
    [0, 0.28, 0.58, 0.61, 0.65, 0.72, 0.85, 1.0],
    [250, 250, 1040, 1070, 1090, 1100, 1100, 1100],
  );
  const ballY = useTransform(
    p,
    [0, 0.28, 0.58, 0.61, 0.65, 0.72, 0.85, 1.0],
    [380, 380, 170, 180, 360, 370, 370, 370],
  );
  const ballRot = useTransform(p, [0, 0.28, 0.58, 0.72, 1.0], [0, 0, 720, 900, 900]);
  const ballScale = useTransform(p, [0, 0.28, 0.43, 0.58, 0.72], [1, 1, 0.9, 0.75, 0.75]);

  // Net deformation
  const netDeformX = useTransform(
    p,
    [0, 0.58, 0.61, 0.65, 0.7, 0.75, 0.8, 0.85, 1.0],
    [0, 0, 35, 10, -15, 8, -4, 0, 0],
  );
  const netDeformY = useTransform(p, [0, 0.58, 0.61, 0.65, 0.7, 0.85, 1.0], [0, 0, 15, 5, 0, 0, 0]);

  const backSupportPath = useTransform(netDeformX, (dx) => {
    return `M 60,0 Q ${105 + dx * 1.5},75 150,150`;
  });

  // GOAL text pop — rushes forward from deep Z
  const goalScale = useTransform(p, [0.6, 0.72, 0.85], [0.4, 1.15, 1]);
  const goalOpacity = useTransform(p, [0.6, 0.7, 0.95, 1], [0, 1, 1, 0]);
  const goalZ = useTransform(p, [0.6, 0.75, 0.85], [-200, 30, 0]);

  // Hero title fades out as scroll progresses
  const titleOpacity = useTransform(p, [0, 0.15, 0.35], [1, 1, 0]);
  const titleY = useTransform(p, [0, 0.35], [0, -60]);
  const titleZ = useTransform(p, [0, 0.35], [30, -150]);
  const titleScale = useTransform(p, [0, 0.35], [1, 0.85]);

  // Pitch 3D camera
  const pitchRotateX = useTransform(p, [0, 0.25, 0.6], [3, 0, -1]);
  const pitchZ = useTransform(p, [0, 0.3, 0.6], [0, 30, 50]);
  const pitchRotateY = useTransform(p, [0.28, 0.5, 0.65], [0, -1.5, 0]);

  // Whole scene fades at end
  const sceneOpacity = useTransform(p, [0.9, 1], [1, 0]);
  const sceneZ = useTransform(p, [0.85, 1], [0, -200]);

  const [kicked, setKicked] = useState(false);
  useMotionValueEvent(p, "change", (v) => {
    if (v > 0.28 && !kicked) setKicked(true);
    if (v < 0.28 && kicked) setKicked(false);
  });

  // suppress unused warning
  void netDeformY;

  return (
    <section ref={wrapRef} id="top" className="relative h-[380vh] bg-hero">
      <div className="sticky top-0 h-screen overflow-hidden perspective-scene">
        <motion.div
          className="absolute inset-0 preserve-3d"
          style={{ opacity: sceneOpacity, translateZ: sceneZ }}
        >
          {/* Background layer */}
          <div aria-hidden className="absolute inset-0">
            {/* Grid overlay */}
            <div
              className="absolute inset-0 opacity-[0.08]"
              style={{
                backgroundImage:
                  "linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)",
                backgroundSize: "80px 80px",
              }}
            />
            {/* Radial spotlight */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "radial-gradient(ellipse 60% 50% at 50% 70%, oklch(0.35 0.12 260 / 0.6), transparent 70%)",
              }}
            />
            {/* Volumetric floodlight beams */}
            <div
              className="absolute inset-0"
              style={{
                background:
                  "linear-gradient(160deg, oklch(0.88 0.24 130 / 0.04) 0%, transparent 30%), linear-gradient(200deg, oklch(0.65 0.28 350 / 0.04) 0%, transparent 30%)",
              }}
            />
          </div>

          {/* 3D floating particles */}
          <div aria-hidden className="absolute inset-0 preserve-3d pointer-events-none z-10">
            {PARTICLES.map((pt) => (
              <div
                key={pt.id}
                className="absolute rounded-full animate-float-particle"
                style={
                  {
                    left: pt.left,
                    top: pt.top,
                    width: pt.size,
                    height: pt.size,
                    transform: `translateZ(${pt.z}px)`,
                    background: `oklch(0.85 0.18 ${pt.hue})`,
                    boxShadow: `0 0 ${pt.size * 3}px oklch(0.85 0.18 ${pt.hue} / 0.6)`,
                    "--dx": pt.dx,
                    "--dy": pt.dy,
                    "--dz": pt.dz,
                    "--duration": pt.duration,
                    "--delay": pt.delay,
                  } as React.CSSProperties
                }
              />
            ))}
          </div>

          {/* Hero text */}
          <motion.div
            style={{ opacity: titleOpacity, y: titleY, translateZ: titleZ, scale: titleScale }}
            className="absolute inset-x-0 top-24 md:top-28 z-20 text-center px-6"
          >
            <div className="inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/50 backdrop-blur px-4 py-1.5 text-xs font-medium text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-primary animate-pulse-glow" />
              FIFA World Cup · June 11 — July 19, 2026
            </div>
            <h1 className="mt-6 font-display text-6xl md:text-8xl lg:text-9xl leading-[0.9] tracking-tight">
              THE WORLD
              <br />
              <span className="text-gradient-primary">PLAYS AS ONE</span>
            </h1>
            <p className="mt-6 max-w-xl mx-auto text-muted-foreground text-base md:text-lg">
              48 nations. 16 cities. One trophy. Scroll to score.
            </p>
            <div className="mt-8 flex items-center justify-center gap-2 text-xs text-muted-foreground/70 uppercase tracking-widest">
              <svg width="16" height="24" viewBox="0 0 16 24" fill="none">
                <rect
                  x="1"
                  y="1"
                  width="14"
                  height="22"
                  rx="7"
                  stroke="currentColor"
                  strokeWidth="1.5"
                />
                <motion.circle
                  cx="8"
                  cy="8"
                  r="2"
                  fill="currentColor"
                  animate={{ y: [0, 6, 0] }}
                  transition={{ duration: 1.6, repeat: Infinity }}
                />
              </svg>
              Scroll to kick
            </div>
          </motion.div>

          {/* Field & animation */}
          <motion.div
            style={{
              rotateX: pitchRotateX,
              rotateY: pitchRotateY,
              translateZ: pitchZ,
            }}
            className="absolute inset-x-0 bottom-0 h-[70%] flex items-end justify-center"
          >
            <svg
              viewBox="0 0 1200 500"
              className="w-full h-full"
              preserveAspectRatio="xMidYEnd meet"
            >
              <defs>
                <linearGradient id="pitch" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.35 0.08 145)" />
                  <stop offset="100%" stopColor="oklch(0.18 0.05 145)" />
                </linearGradient>
                <radialGradient id="ballShine" cx="0.35" cy="0.3" r="0.7">
                  <stop offset="0%" stopColor="white" />
                  <stop offset="60%" stopColor="oklch(0.9 0.02 250)" />
                  <stop offset="100%" stopColor="oklch(0.6 0.02 250)" />
                </radialGradient>
                <filter id="glow">
                  <feGaussianBlur stdDeviation="6" result="b" />
                  <feMerge>
                    <feMergeNode in="b" />
                    <feMergeNode in="SourceGraphic" />
                  </feMerge>
                </filter>
              </defs>

              {/* Pitch */}
              <path d="M0 500 L0 380 Q600 300 1200 380 L1200 500 Z" fill="url(#pitch)" />
              {/* Pitch lines */}
              <path
                d="M0 400 Q600 320 1200 400"
                stroke="white"
                strokeOpacity="0.15"
                strokeWidth="2"
                fill="none"
              />
              <ellipse
                cx="600"
                cy="410"
                rx="140"
                ry="28"
                stroke="white"
                strokeOpacity="0.15"
                strokeWidth="2"
                fill="none"
              />

              {/* Player */}
              <g transform="translate(180, 170)">
                <motion.g style={{ x: playerX, y: playerY }}>
                  {/* Left Arm (Far Arm) */}
                  <BodyPart rotate={leftUpperArmRot} cx={42} cy={70}>
                    <path
                      d="M 38,70 C 38,67 46,67 46,70 L 44,94 C 44,96 40,96 40,94 Z"
                      fill="oklch(0.65 0.28 350)"
                    />
                    <BodyPart rotate={leftForearmRot} cx={42} cy={94}>
                      <path
                        d="M 39,94 C 39,92 45,92 45,94 L 43,114 C 43,116 41,116 41,114 Z"
                        fill="oklch(0.65 0.28 350)"
                      />
                      <circle cx="42" cy="116" r="4" fill="oklch(0.65 0.28 350)" />
                    </BodyPart>
                  </BodyPart>

                  {/* Left Leg (Plant Leg) */}
                  <BodyPart rotate={plantThighRot} cx={50} cy={120}>
                    <path
                      d="M 43,120 C 43,115 57,115 57,120 L 55,162 C 55,165 45,165 45,162 Z"
                      fill="oklch(0.18 0.03 260)"
                    />
                    <BodyPart rotate={plantCalfRot} cx={50} cy={162}>
                      <path
                        d="M 45,162 C 45,159 55,159 55,162 L 53,202 C 53,204 47,204 47,202 Z"
                        fill="oklch(0.18 0.03 260)"
                      />
                      <BodyPart rotate={plantFootRot} cx={50} cy={202}>
                        <path
                          d="M 46,200 L 56,200 C 62,200 68,208 68,212 L 44,212 C 43,212 42,208 42,205 Z"
                          fill="oklch(0.88 0.24 130)"
                        />
                        <rect x="46" y="212" width="2" height="3" fill="white" />
                        <rect x="52" y="212" width="2" height="3" fill="white" />
                        <rect x="62" y="212" width="2" height="3" fill="white" />
                      </BodyPart>
                    </BodyPart>
                  </BodyPart>

                  {/* Torso & Jersey */}
                  <BodyPart rotate={torsoRot} cx={60} cy={120}>
                    {/* Neck */}
                    <path
                      d="M 55,60 L 55,48 C 55,48 60,46 65,48 L 65,60 Z"
                      fill="oklch(0.65 0.28 350)"
                    />
                    {/* Head */}
                    <path
                      d="M 52,24 C 52,24 64,22 68,30 C 72,36 74,38 74,40 L 70,42 L 71,45 L 67,46 C 65,48 57,48 54,48 C 50,46 48,36 52,24 Z"
                      fill="oklch(0.65 0.28 350)"
                    />
                    {/* Hair */}
                    <path
                      d="M 52,24 C 50,22 55,14 62,18 C 66,21 65,26 62,26 C 58,26 55,25 52,24 Z"
                      fill="oklch(0.15 0.03 260)"
                    />
                    {/* Jersey */}
                    <path
                      d="M 42,66 C 42,66 50,60 60,60 C 70,60 78,66 78,66 L 74,116 C 74,116 60,120 60,120 C 60,120 46,116 46,116 Z"
                      fill="oklch(0.88 0.24 130)"
                    />
                    {/* Jersey Collar V-neck */}
                    <path d="M 55,60 L 60,68 L 65,60 Z" fill="oklch(0.65 0.28 350)" />
                    {/* Shorts */}
                    <path
                      d="M 46,116 L 42,138 L 58,138 L 60,120 L 62,138 L 78,138 L 74,116 Z"
                      fill="oklch(0.2 0.03 260)"
                    />
                    {/* Number 10 on Jersey */}
                    <text
                      x="60"
                      y="95"
                      textAnchor="middle"
                      fontFamily="Anton, Impact, sans-serif"
                      fontSize="22"
                      fill="oklch(0.15 0.03 260)"
                    >
                      10
                    </text>
                  </BodyPart>

                  {/* Right Leg (Kicking Leg) */}
                  <BodyPart rotate={kickThighRot} cx={68} cy={120}>
                    <path
                      d="M 61,120 C 61,115 75,115 75,120 L 73,162 C 73,165 63,165 63,162 Z"
                      fill="oklch(0.2 0.03 260)"
                    />
                    <BodyPart rotate={kickCalfRot} cx={68} cy={162}>
                      <path
                        d="M 63,162 C 63,159 73,159 73,162 L 71,202 C 71,204 65,204 65,202 Z"
                        fill="oklch(0.2 0.03 260)"
                      />
                      <BodyPart rotate={kickFootRot} cx={68} cy={202}>
                        <path
                          d="M 64,200 L 74,200 C 80,200 86,208 86,212 L 62,212 C 61,212 60,208 60,205 Z"
                          fill="oklch(0.88 0.24 130)"
                        />
                        <rect x="64" y="212" width="2" height="3" fill="white" />
                        <rect x="70" y="212" width="2" height="3" fill="white" />
                        <rect x="80" y="212" width="2" height="3" fill="white" />
                      </BodyPart>
                    </BodyPart>
                  </BodyPart>

                  {/* Right Arm (Near Arm) */}
                  <BodyPart rotate={rightUpperArmRot} cx={78} cy={70}>
                    <path
                      d="M 74,70 C 74,67 82,67 82,70 L 80,94 C 80,96 76,96 76,94 Z"
                      fill="oklch(0.65 0.28 350)"
                    />
                    <BodyPart rotate={rightForearmRot} cx={78} cy={94}>
                      <path
                        d="M 75,94 C 75,92 81,92 81,94 L 79,114 C 79,116 75,116 75,114 Z"
                        fill="oklch(0.65 0.28 350)"
                      />
                      <circle cx="78" cy="116" r="4" fill="oklch(0.65 0.28 350)" />
                    </BodyPart>
                  </BodyPart>
                </motion.g>
              </g>

              {/* Motion trail */}
              <motion.path
                d="M 250 380 Q 590 150 930 170"
                stroke="oklch(0.88 0.24 130)"
                strokeWidth="2"
                strokeDasharray="4 8"
                fill="none"
                style={{ opacity: useTransform(p, [0.28, 0.45, 0.65], [0, 0.7, 0]) }}
              />

              {/* Ball */}
              <motion.g style={{ x: ballX, y: ballY, rotate: ballRot, scale: ballScale }}>
                <circle cx="0" cy="0" r="18" fill="url(#ballShine)" />
                <path
                  d="M-10 -5 L0 -12 L10 -5 L6 6 L-6 6 Z"
                  fill="oklch(0.15 0.03 260)"
                  opacity="0.85"
                />
                <circle
                  cx="0"
                  cy="0"
                  r="18"
                  fill="none"
                  stroke="oklch(0.15 0.03 260)"
                  strokeOpacity="0.4"
                />
              </motion.g>

              {/* Speed lines when moving */}
              {kicked && (
                <motion.g
                  initial={{ opacity: 0 }}
                  animate={{ opacity: [0, 0.6, 0] }}
                  transition={{ duration: 0.6 }}
                >
                  <line x1="260" y1="380" x2="380" y2="360" stroke="white" strokeOpacity="0.4" />
                  <line x1="260" y1="390" x2="360" y2="380" stroke="white" strokeOpacity="0.3" />
                </motion.g>
              )}

              {/* GOAL on right (rendered last so the ball is behind the near net) */}
              <g transform="translate(960, 150) scale(1.6)">
                <g>
                  {/* Bottom frame (on the ground) */}
                  <rect x="0" y="146" width="150" height="4" fill="white" fillOpacity="0.4" />
                  {/* Front Post */}
                  <rect x="-4" y="0" width="8" height="150" fill="white" />
                  {/* Top Bar (going back) */}
                  <rect x="-4" y="-4" width="68" height="8" fill="white" />
                  {/* Flexible Back Support Rope */}
                  <motion.path d={backSupportPath} fill="none" stroke="white" strokeWidth="5" />
                  {/* Net */}
                  <g stroke="white" strokeOpacity="0.4" strokeWidth="1.5" fill="none">
                    {Array.from({ length: 15 }).map((_, idx) => {
                      const x = 5 + idx * 10;
                      return (
                        <VerticalNetLine key={`v${idx}`} x={x} netDeformX={netDeformX} />
                      );
                    })}
                    {Array.from({ length: 10 }).map((_, idx) => (
                      <HorizontalNetLine key={`h${idx}`} y={5 + idx * 15} netDeformX={netDeformX} />
                    ))}
                  </g>
                </g>
              </g>
            </svg>
          </motion.div>

          {/* GOAL! text overlay */}
          <motion.div
            style={{ scale: goalScale, opacity: goalOpacity, translateZ: goalZ }}
            className="pointer-events-none absolute inset-0 flex items-center justify-center z-30 preserve-3d"
          >
            <div className="text-center">
              <h2 className="font-display text-[18vw] md:text-[15vw] leading-none tracking-tighter text-gradient-primary drop-shadow-[0_0_40px_oklch(0.88_0.24_130/0.6)]">
                GOAL!
              </h2>
              <p className="mt-2 text-lg md:text-2xl font-semibold tracking-widest text-primary uppercase">
                The Journey Begins
              </p>
            </div>
          </motion.div>
        </motion.div>

        {/* Progress bar */}
        <div className="absolute bottom-0 inset-x-0 h-1 bg-border/30 z-40">
          <motion.div
            className="h-full bg-gradient-to-r from-primary via-accent to-secondary origin-left"
            style={{ scaleX: p }}
          />
        </div>
      </div>
    </section>
  );
}
