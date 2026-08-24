"use client";

import { useState } from "react";

// `.flat-toggle`/`.toggle-title`/`.toggle-content` accordion, shared by any page using this pattern
// (calculator.html's "Calculator FAQ", and faqs.html later — same markup, confirmed via source diff).
//
// Real, single-open accordion — verified by testing the actual static source HTML directly (clicking
// a closed question DOES expand it and collapse whichever other one was open). `app.js`'s
// `flatAccordion()` has TWO separate click bindings: an early one scoped to `.flat-toggle.enable
// .toggle-title` that's genuinely dead (`.enable` appears nowhere in the whole 63-page site — an
// initial read of only the first ~25 lines of this function mistook that dead binding for the whole
// story), and a second, unconditional one on `$('.flat-accordion .toggle-title')` that's the real
// handler: clicking any title closes every `.flat-toggle` in the group, then — unless the clicked one
// was already open — reopens just that one, via jQuery's `.slideDown()`/`.slideUp()` (300ms). Reproduced
// as real `useState` here instead of the dead selector's premise, animated with the CSS grid
// `grid-template-rows: 0fr -> 1fr` technique (an outer grid row transitions its own size, so no JS
// height measurement is needed for arbitrary content) at the same 300ms duration, rather than a plain
// mount/unmount snap — matching source's own slide feel instead of an instant show/hide.
export type FaqItem = { question: string; answer: string[] };

export default function FaqAccordion({
  items,
  wowDelay = ".3s",
}: {
  items: FaqItem[];
  wowDelay?: string;
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <div className="flat-accordion flex flex-col gap-18 max-width-930 wow fadeIn" data-wow-delay={wowDelay}>
      {items.map((item, index) => {
        const isOpen = openIndex === index;
        return (
          <div className={`flat-toggle bg-white${isOpen ? " active" : ""}`} key={item.question}>
            <div
              className={`toggle-title${isOpen ? " active" : ""}`}
              onClick={() => setOpenIndex(isOpen ? null : index)}
            >
              <p className="h5 title">{item.question}</p>
              <span className="icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M20 15L12 7L4 15" stroke="#1C1C1C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateRows: isOpen ? "1fr" : "0fr",
                transition: "grid-template-rows 300ms ease",
              }}
            >
              <div style={{ overflow: "hidden" }}>
                <div className="toggle-content" style={{ display: "block" }}>
                  {item.answer.map((paragraph, i) => (
                    <p className={`h7 text-secondary line-height-28${i < item.answer.length - 1 ? " mb-8" : ""}`} key={i}>
                      {paragraph}
                    </p>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
