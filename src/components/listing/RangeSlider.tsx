"use client";

import { useCallback, useEffect, useRef } from "react";

// Hand-rolled replacement for Aurexo's jQuery UI dual-handle slider (`gear-slider.js` calls
// `$('#slider-range').slider({ range: true, ... })`). Per the Package Principle we don't pull in
// jQuery + jQuery UI for one widget — this reproduces the exact DOM/class shape the theme's own
// CSS targets (`#slider-range > .ui-slider-range` + `.ui-slider-handle`, see
// assets/scss/component/page-title.scss `.search-cars__range-wrapper`), so the visuals match
// without the dependency.
export default function RangeSlider({
  min,
  max,
  step = 1,
  value,
  onChange,
}: {
  min: number;
  max: number;
  step?: number;
  value: [number, number];
  onChange: (value: [number, number]) => void;
}) {
  const trackRef = useRef<HTMLDivElement>(null);
  const draggingRef = useRef<0 | 1 | null>(null);
  const valueRef = useRef(value);
  valueRef.current = value;

  const percentFor = useCallback((v: number) => ((v - min) / (max - min)) * 100, [min, max]);

  const valueFromClientX = useCallback(
    (clientX: number) => {
      const track = trackRef.current;
      if (!track) return null;
      const rect = track.getBoundingClientRect();
      const ratio = Math.min(1, Math.max(0, (clientX - rect.left) / rect.width));
      const raw = min + ratio * (max - min);
      return Math.round(raw / step) * step;
    },
    [min, max, step]
  );

  useEffect(() => {
    function handleMove(event: PointerEvent) {
      if (draggingRef.current === null) return;
      const next = valueFromClientX(event.clientX);
      if (next === null) return;
      const [lo, hi] = valueRef.current;
      if (draggingRef.current === 0) {
        onChange([Math.min(next, hi), hi]);
      } else {
        onChange([lo, Math.max(next, lo)]);
      }
    }
    function handleUp() {
      draggingRef.current = null;
    }
    window.addEventListener("pointermove", handleMove);
    window.addEventListener("pointerup", handleUp);
    return () => {
      window.removeEventListener("pointermove", handleMove);
      window.removeEventListener("pointerup", handleUp);
    };
  }, [onChange, valueFromClientX]);

  const [lo, hi] = value;
  const loPct = percentFor(lo);
  const hiPct = percentFor(hi);

  return (
    <div id="slider-range" ref={trackRef}>
      <div className="ui-slider-range" style={{ left: `${loPct}%`, width: `${hiPct - loPct}%` }} />
      <span
        className="ui-slider-handle"
        role="slider"
        aria-label="Minimum price"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={lo}
        tabIndex={0}
        style={{ left: `${loPct}%` }}
        onPointerDown={(event) => {
          event.preventDefault();
          draggingRef.current = 0;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onChange([Math.max(min, lo - step), hi]);
          if (event.key === "ArrowRight") onChange([Math.min(hi, lo + step), hi]);
        }}
      />
      <span
        className="ui-slider-handle"
        role="slider"
        aria-label="Maximum price"
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={hi}
        tabIndex={0}
        style={{ left: `${hiPct}%` }}
        onPointerDown={(event) => {
          event.preventDefault();
          draggingRef.current = 1;
        }}
        onKeyDown={(event) => {
          if (event.key === "ArrowLeft") onChange([lo, Math.max(lo, hi - step)]);
          if (event.key === "ArrowRight") onChange([lo, Math.min(max, hi + step)]);
        }}
      />
    </div>
  );
}
