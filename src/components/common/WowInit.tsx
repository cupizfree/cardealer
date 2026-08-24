"use client";

import { useEffect } from "react";

// Mirrors ../aurexo/assets/js/app.js's global WOW.js init verbatim:
//   wow = new WOW({ animateClass: 'animated', offset: 100 });
//   wow.init();
// Mounted once here (root layout) instead of per-page, so any element ANYWHERE in the app carrying
// the source's own `wow` + animate.css class (`fadeIn`, `fadeInUp`, `fadeInDown`, `zoomIn`, ...) and
// `data-wow-delay`/`data-wow-duration`/`data-wow-offset` attributes — preserved as-is whenever a page
// is migrated, per the project's usual verbatim-class-copy convention — gets real scroll-triggered
// animation, matching source, without wiring WOW.js up again per page. The animate.css keyframes
// themselves were already compiled in (`component/index.scss` `@forward`s `animate.min.scss`, already
// included via `app.scss`) — only the JS that toggles the `animated` class at the right scroll moment
// was missing project-wide before this.
//
// WOW.js's own `live: true` default installs a MutationObserver on `document.body`, so `.wow`
// elements added later by client-side navigation (Next's App Router doesn't remount this layout) are
// picked up automatically — no per-page re-init needed.
//
// Dynamically imported rather than a static top-level import: the package references `window` at
// module-evaluation time (not just inside functions it calls at runtime), which throws during Next's
// server-side render/bundle pass — this component's `useEffect` only ever runs in the browser.
//
// The package has no ESM build, and its UMD wrapper does `this.WOW = (function() {...})()` at
// module-evaluation time. Under Next's bundler that top-level `this` isn't `module.exports` (that
// would need a strict CJS host) — it resolves the same way the source's own plain `<script>` tag
// would, so the constructor lands on `window.WOW` as a side effect, not as anything `import("wowjs")`
// itself returns (confirmed via direct inspection: the module namespace's `default` export has zero
// own keys, while `window.WOW` is a real function right after the import resolves). Reading it off
// `window` after the import settles is a deliberate necessity here, not a workaround for a self-made bug.
export default function WowInit() {
  useEffect(() => {
    let wow: { init: () => void; stop: () => void } | undefined;
    let cancelled = false;

    import("wowjs").then(() => {
      if (cancelled) return;
      const WOW = (window as unknown as { WOW: new (config: { animateClass: string; offset: number }) => { init: () => void; stop: () => void } }).WOW;
      wow = new WOW({ animateClass: "animated", offset: 100 });
      wow.init();
    });

    return () => {
      cancelled = true;
      wow?.stop();
    };
  }, []);

  return null;
}
