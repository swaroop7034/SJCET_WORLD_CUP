"use client";

/** Reusable 3D perspective section wrapper with scroll-reveal animation */
import { useRef } from "react";
import { motion, useInView } from "motion/react";

export default function Section3D({
  children,
  className = "",
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const isInView = useInView(ref, { once: true, margin: "-80px" });
  return (
    <div ref={ref} className={className} id={id}>
      <motion.div
        initial={{
          opacity: 0,
          transform: "perspective(1200px) translateZ(-120px) rotateX(4deg) translateY(40px)",
        }}
        animate={
          isInView
            ? {
                opacity: 1,
                transform: "perspective(1200px) translateZ(0px) rotateX(0deg) translateY(0px)",
              }
            : {}
        }
        transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
      >
        {children}
      </motion.div>
    </div>
  );
}
