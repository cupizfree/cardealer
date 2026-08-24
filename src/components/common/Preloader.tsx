"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

// Mirrors app.js's Preloader(): fades out `.preload` immediately after mount (source uses a 0ms
// setTimeout, effectively "next tick"). Kept as a real mount-triggered effect rather than CSS-only
// so it also covers client-side navigations, not just the first paint.
export default function Preloader() {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const timeout = setTimeout(() => setIsVisible(false), 0);
    return () => clearTimeout(timeout);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="preload preload-container">
      <Image className="preload--icon" src="/assets/icons/preload.svg" alt="preload" width={64} height={64} />
    </div>
  );
}
