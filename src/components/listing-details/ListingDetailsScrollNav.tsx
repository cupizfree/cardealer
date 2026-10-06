"use client";

import { useState } from "react";

const LINKS = [
  { id: "Overview", label: "Ringkasan" },
  { id: "Deskripsi", label: "Deskripsi" },
  { id: "Informasi", label: "Informasi" },
  { id: "Inquiry", label: "Tanya" },
  { id: "Lokasi", label: "Lokasi" },
  { id: "Ulasan", label: "Ulasan" },
] as const;

// Matches ../aurexo/listing-details-4.html's `.flat-tabs.scroll-element` tab bar — real smooth-scroll
// navigation (assets/js/app.js's `scrollElement()`: scrolls to the target id offset by the header's
// height + 20px), not decorative. "Inquiry" targets the SIDEBAR's Send Inquiry box (a cross-column
// jump — confirmed via direct source read, `id="Inquiry"` sits on `ListingDetailsSidebar`'s send-inquiry
// box, not anything in the main content column). Source has no scroll-spy (the "Deskripsi" tab's
// `active` class is just static initial markup, never updated by JS) — the click-driven `activeId`
// state here is an equivalent, reasonable real behavior, not an invented one.
export default function ListingDetailsScrollNav() {
  const [activeId, setActiveId] = useState<string>("Deskripsi");

  return (
    <div className="flat-tabs scroll-element mb-60">
      <div className="overflow-x-auto mb-15">
        <ul className="menu-tab menu-tab-style5 large grid grid-cols-6 lg-grid-cols-3">
          {LINKS.map(({ id, label }) => (
            <li className={`item${activeId === id ? " active" : ""}`} key={id}>
              <a
                className="element"
                href={`#${id}`}
                onClick={(event) => {
                  event.preventDefault();
                  setActiveId(id);
                  const target = document.getElementById(id);
                  if (!target) return;
                  const header = document.querySelector(".header") as HTMLElement | null;
                  const headerHeight = header?.offsetHeight ?? 0;
                  const top = target.getBoundingClientRect().top + window.scrollY - headerHeight - 20;
                  window.scrollTo({ top: Math.max(0, top), behavior: "smooth" });
                }}
              >
                {label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}
