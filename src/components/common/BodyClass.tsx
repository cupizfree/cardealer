"use client";

import { useEffect } from "react";

// Some Aurexo pages carry a real, functional `<body class="...">` modifier beyond decoration — e.g.
// home-09.html's `home-style-9` (`section.scss`: `padding: 40px`, scaled down at narrower breakpoints;
// `header.scss`: `.home-style-9 .header.is-custom { background-color: $color-primary }` for the sticky
// header) and home-10.html's `home-style-10 background-light` (`padding: 0 180px`). Since Next.js's App
// Router renders one shared `<body>` in the root `layout.tsx` for every route, a per-page body class
// can't be set declaratively there — this mounts per-page instead (matching `ThemeSwitcher.tsx`'s own
// precedent of imperative `document.body.classList` management) and cleans up on unmount so navigating
// away doesn't leak the class onto other pages.
export default function BodyClass({ className }: { className: string }) {
  useEffect(() => {
    const classes = className.split(" ").filter(Boolean);
    document.body.classList.add(...classes);
    return () => {
      document.body.classList.remove(...classes);
    };
  }, [className]);

  return null;
}
