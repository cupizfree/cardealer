"use client";

import { useEffect } from "react";

// Same shape as `BodyClass.tsx`, targeting `#wrapper` instead of `<body>`. home-10.html's own real
// source is the ONLY one of the 10 home variants with `<div id="wrapper" class="bg-white">` (every
// other page's `#wrapper` is classless, confirmed via source diff) — but `layout.tsx` renders one
// shared `#wrapper` div for every route, so this class was never applied. It matters beyond plain
// background color: `themes.scss`'s `.is_dark #wrapper.bg-white { background-color: transparent }`
// only fires when this class is actually present, letting `body.is_dark`'s own dark background show
// through instead of an opaque white block — without it, toggling `ThemeSwitcher`'s dark mode on
// `/home-10` never gets this override at all.
export default function WrapperClass({ className }: { className: string }) {
  useEffect(() => {
    const wrapper = document.getElementById("wrapper");
    if (!wrapper) return;
    const classes = className.split(" ").filter(Boolean);
    wrapper.classList.add(...classes);
    return () => {
      wrapper.classList.remove(...classes);
    };
  }, [className]);

  return null;
}
