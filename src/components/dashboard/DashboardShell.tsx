"use client";

import { useEffect, useState } from "react";
import DashboardSidebar from "./DashboardSidebar";
import DashboardHeader from "./DashboardHeader";

// Migrated from ../aurexo/dashboard.html's own trailing inline `<script>` (real, page-specific — not in
// app.js): a real mobile/tablet (<=1200px) sidebar toggle. Traced in full: the button toggles `active`/
// `sidebar-open`/`dashboard-sidebar-open` classes on the sidebar/container/body respectively, closes on
// an outside click (only below 1200px), and resets on any resize back above 1200px. Reproduced as real
// `useState` + `useEffect` window listeners rather than direct DOM class toggling. `body`'s own
// `dashboard overflow-hidden` classes (source's `<body class="dashboard overflow-hidden">`) are applied
// here via `useEffect` since Next's root layout owns the single shared `<body>` tag and every other route
// needs a plain body — added on mount, removed on unmount, the standard Next.js per-route body-class
// pattern.
export default function DashboardShell({ children }: { children: React.ReactNode }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    document.body.classList.add("dashboard", "overflow-hidden");
    return () => {
      document.body.classList.remove("dashboard", "overflow-hidden");
    };
  }, []);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (window.innerWidth > 1200) return;
      const target = event.target as HTMLElement;
      if (!target.closest(".dashboard-sidebar") && !target.closest(".dashboard-toggle-btn")) {
        setIsSidebarOpen(false);
      }
    }
    function handleResize() {
      if (window.innerWidth > 1200) {
        setIsSidebarOpen(false);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    window.addEventListener("resize", handleResize);
    return () => {
      document.removeEventListener("click", handleOutsideClick);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  return (
    <div className={`dashboard-container${isSidebarOpen ? " sidebar-open" : ""}`}>
      <DashboardSidebar isOpen={isSidebarOpen} />

      <div className="dashboard-content">
        <DashboardHeader />

        <div className="dashboard-content--inner">
          <div className="dashboard-content--details">
            <button
              type="button"
              className={`btn btn-primary btn-large font-weight-600 mb-24 dashboard-toggle-btn${isSidebarOpen ? " active" : ""}`}
              onClick={() => setIsSidebarOpen((open) => !open)}
              aria-label="Toggle Dashboard"
            >
              Lihat Dashboard
            </button>

            {children}
          </div>
        </div>
      </div>
    </div>
  );
}
