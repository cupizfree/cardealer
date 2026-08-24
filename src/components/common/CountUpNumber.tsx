"use client";

import { useEffect, useRef, useState } from "react";

// Reproduces `app.js`'s real `flatCounter()`: on scroll, once `.counter`'s box enters the viewport, its
// `.count-number` spans animate from 0 to `data-to` over `data-speed` ms (jQuery's `countTo` plugin),
// formatted with a comma decimal separator, firing only once. `flatCounter()` itself is gated on
// `document.body.hasClass("counter-scroll")` — about-us.html's `<body>` lacks that class (so its own
// numbers are genuinely static there, see `WhyChooseUsSection.tsx`'s `animateCounters` prop), but
// home-03.html's `<body class="counter-scroll ...">` does carry it, so this is real, load-bearing
// behavior there. Uses `IntersectionObserver` + a ref guard instead of a scroll listener + `countTo`
// jQuery plugin (Package Principle), same shape as this project's other scroll-triggered reveals.
export default function CountUpNumber({
  to,
  speed = 1500,
  decimals = 0,
  className,
}: {
  to: number;
  speed?: number;
  decimals?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const hasAnimated = useRef(false);
  const [value, setValue] = useState(0);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || hasAnimated.current) return;
        hasAnimated.current = true;

        const start = performance.now();
        function tick(now: number) {
          const progress = Math.min(1, (now - start) / speed);
          setValue(to * progress);
          if (progress < 1) requestAnimationFrame(tick);
        }
        requestAnimationFrame(tick);
        observer.disconnect();
      },
      { threshold: 0 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, speed]);

  return (
    <span className={className} ref={ref}>
      {value.toFixed(decimals).replace(".", ",")}
    </span>
  );
}
