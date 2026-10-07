"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

const SCALE = 1.3;
const DELAY = 0.5;
const EASING = "cubic-bezier(0.2, 0.8, 1, 1)";

// Drop-in replacement for the source's `<div class="overlay image"><img class="lazyload parallax">`
// pattern (index.html, home-02/04/07/11.html, sell-your-car.html,
// coming-soon.html). `app.js`'s `parallax()` hands every `.parallax` image to the third-party
// `simpleParallaxVanilla.umd.js` with `{ delay: 0.5, orientation: "up", scale: 1.3, transition:
// "cubic-bezier(0.2, 0.8, 1, 1)" }` — a real scroll-driven effect (the image scales up 1.3x, clipped by
// an overflow-hidden wrapper, and translates vertically as the section crosses the viewport), not
// decorative. Reproduced as a small hand-rolled scroll listener instead of pulling in the library
// (Package Principle — same call as `CountUpNumber.tsx` for jQuery's `countTo`), reimplementing the
// library's own `getTranslateValue()` linear-interpolation formula verbatim:
//   percent   = clamp(0, 100, (viewportBottom - elementTop) / ((viewportHeight + elementHeight) / 100))
//   rangeMax  = elementHeight * scale - elementHeight
//   translate = (percent / 100) * rangeMax - rangeMax / 2   (negated for orientation "up")
export default function ParallaxImage({ src, alt = "" }: { src: string; alt?: string }) {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const targetRef = useRef<HTMLDivElement>(null);
  const isVisibleRef = useRef(true);
  const rangeMaxRef = useRef(0);
  const lastScrollYRef = useRef(-1);

  useEffect(() => {
    const wrapper = wrapperRef.current;
    const target = targetRef.current;
    if (!wrapper || !target) return;

    const measure = () => {
      const height = wrapper.clientHeight;
      rangeMaxRef.current = height * SCALE - height;
    };

    const apply = () => {
      const rect = wrapper.getBoundingClientRect();
      const viewportHeight = window.innerHeight;
      const elementTop = rect.top + window.scrollY;

      let percent = (viewportHeight + window.scrollY - elementTop) / ((viewportHeight + rect.height) / 100);
      percent = Math.min(100, Math.max(0, percent));
      const translate = (percent / 100) * rangeMaxRef.current - rangeMaxRef.current / 2;
      target.style.transform = `translate3d(0, ${-translate}px, 0) scale(${SCALE})`;
    };

    let rafId: number;
    const loop = () => {
      if (isVisibleRef.current && window.scrollY !== lastScrollYRef.current) {
        lastScrollYRef.current = window.scrollY;
        apply();
      }
      rafId = requestAnimationFrame(loop);
    };

    const observer = new IntersectionObserver(([entry]) => {
      isVisibleRef.current = entry.isIntersecting;
    });
    observer.observe(wrapper);

    measure();
    apply();
    target.style.willChange = "transform";
    const timer = setTimeout(() => {
      target.style.transition = `transform ${DELAY}s ${EASING}`;
    }, 10);
    rafId = requestAnimationFrame(loop);
    window.addEventListener("resize", measure);

    return () => {
      cancelAnimationFrame(rafId);
      clearTimeout(timer);
      window.removeEventListener("resize", measure);
      observer.disconnect();
    };
  }, []);

  return (
    <div ref={wrapperRef} className="overlay image" style={{ overflow: "hidden" }}>
      <div ref={targetRef} style={{ position: "absolute", inset: 0 }}>
        <Image src={src} alt={alt} fill style={{ objectFit: "cover" }} />
      </div>
    </div>
  );
}
