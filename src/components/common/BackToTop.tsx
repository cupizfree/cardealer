"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

const RADIUS = 49;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

// Mirrors app.js's gotop(): an SVG circular scroll-progress ring around the back-to-top button,
// visible past 150px of scroll, `stroke-dashoffset` driven by scroll percentage, click smooth-scrolls
// to top. No Luminor equivalent to reference — this specific SVG-ring visual is Aurexo-only.
export default function BackToTop() {
  const [progress, setProgress] = useState(0);
  const [isActive, setIsActive] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      const docHeight = document.documentElement.scrollHeight - window.innerHeight;
      const pct = docHeight > 0 ? scrollTop / docHeight : 0;
      setProgress(pct);
      setIsActive(scrollTop > 150);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const dashoffset = CIRCUMFERENCE * (1 - progress);

  return (
    <div
      className={`progress-wrap${isActive ? " active-progress" : ""}`}
      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
    >
      <svg className="progress-circle svg-content" width="100%" height="100%" viewBox="-1 -1 102 102">
        <path
          d="M50,1 a49,49 0 0,1 0,98 a49,49 0 0,1 0,-98"
          style={{
            transition: "stroke-dashoffset 10ms linear 0s",
            strokeDasharray: `${CIRCUMFERENCE}, ${CIRCUMFERENCE}`,
            strokeDashoffset: dashoffset,
          }}
        />
      </svg>
      <Image className="progress-wrap-icon" src="/assets/icons/top.svg" alt="top" width={20} height={20} />
    </div>
  );
}
