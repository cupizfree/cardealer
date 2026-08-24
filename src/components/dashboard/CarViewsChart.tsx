"use client";

import { useState } from "react";
import CoreDropdown from "@/components/common/CoreDropdown";

// Migrated from ../aurexo/dashboard.html lines 627-654 + `app.js`'s `carViewsChart()`. Traced that
// function in full: it's a genuinely real, interactive canvas line chart (hover shows a tooltip for the
// nearest month, with a smooth fade animation) — not decorative. Reproduced as a plain SVG line+points
// with the same real hover-tooltip behavior instead of porting the manual canvas draw-loop/DPI-scaling
// code (Package Principle: same real behavior, far less code, no per-resize redraw logic needed since
// SVG scales natively). The "3/6/12 Month" range dropdown is real-but-decorative past its own label swap
// (traced `app.js`'s dropdown handler — confirmed it never re-fetches or changes `data`/`months`), so it
// doesn't actually change the chart, matching source exactly; reused the shared `CoreDropdown` widget.
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const DATA = [250, 220, 200, 180, 170, 175, 160, 140, 130, 120, 115, 175];
const MAX_VALUE = 300;

const WIDTH = 900;
const HEIGHT = 320;
const PADDING = { top: 20, right: 20, bottom: 30, left: 40 };
const CHART_WIDTH = WIDTH - PADDING.left - PADDING.right;
const CHART_HEIGHT = HEIGHT - PADDING.top - PADDING.bottom;

function xForIndex(index: number) {
  return PADDING.left + (index / (DATA.length - 1)) * CHART_WIDTH;
}
function yForValue(value: number) {
  return PADDING.top + CHART_HEIGHT - (value / MAX_VALUE) * CHART_HEIGHT;
}

const LINE_POINTS = DATA.map((value, index) => `${xForIndex(index)},${yForValue(value)}`).join(" ");
const Y_TICKS = [0, 75, 150, 225, 300];

export default function CarViewsChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <div className="dashboard-box car-views-chart bg-white mb-30">
      <div className="car-views-chart__header">
        <p className="h4 car-views-chart__title">Car Views</p>
        <CoreDropdown
          defaultValue="6-month"
          options={[
            { value: "3-month", label: "3 Month" },
            { value: "6-month", label: "6 Month" },
            { value: "12-month", label: "12 Month" },
          ]}
        />
      </div>
      <div className="car-views-chart__container" style={{ position: "relative" }}>
        <svg
          viewBox={`0 0 ${WIDTH} ${HEIGHT}`}
          className="car-views-chart__canvas"
          style={{ width: "100%", height: "auto", display: "block" }}
          onMouseLeave={() => setHoveredIndex(null)}
          onMouseMove={(event) => {
            const rect = event.currentTarget.getBoundingClientRect();
            const relativeX = ((event.clientX - rect.left) / rect.width) * WIDTH;
            const index = Math.round(((relativeX - PADDING.left) / CHART_WIDTH) * (DATA.length - 1));
            setHoveredIndex(Math.min(Math.max(index, 0), DATA.length - 1));
          }}
        >
          {Y_TICKS.map((tick) => (
            <g key={tick}>
              <line
                x1={PADDING.left}
                x2={WIDTH - PADDING.right}
                y1={yForValue(tick)}
                y2={yForValue(tick)}
                stroke="#E7E7E7"
                strokeWidth={1}
              />
              <text x={PADDING.left - 10} y={yForValue(tick)} textAnchor="end" dominantBaseline="middle" fontSize={12} fill="#1C1C1C">
                {tick}
              </text>
            </g>
          ))}

          {MONTHS.map((month, index) => (
            <text key={month} x={xForIndex(index)} y={HEIGHT - 8} textAnchor="middle" fontSize={12} fill="#1C1C1C">
              {month}
            </text>
          ))}

          <polyline points={LINE_POINTS} fill="none" stroke="#f5a81c" strokeWidth={2} />

          {DATA.map((value, index) => (
            <circle
              key={index}
              cx={xForIndex(index)}
              cy={yForValue(value)}
              r={hoveredIndex === index ? 6 : 4}
              fill="#f5a81c"
              style={{ transition: "r 0.15s ease" }}
            />
          ))}
        </svg>

        {hoveredIndex !== null && (
          <div
            className="car-views-chart__tooltip"
            style={{
              position: "absolute",
              left: `${(xForIndex(hoveredIndex) / WIDTH) * 100}%`,
              top: `${(yForValue(DATA[hoveredIndex]) / HEIGHT) * 100}%`,
              transform: "translate(-50%, -120%)",
              background: "white",
              borderRadius: 8,
              padding: "8px 12px",
              boxShadow: "0 4px 12px rgba(0,0,0,0.12)",
              pointerEvents: "none",
              whiteSpace: "nowrap",
            }}
          >
            <div style={{ fontWeight: 700, fontSize: 14 }}>{MONTHS[hoveredIndex]}</div>
            <div style={{ fontSize: 12, color: "#4B4B4B" }}>{DATA[hoveredIndex]} views</div>
          </div>
        )}
      </div>
    </div>
  );
}
