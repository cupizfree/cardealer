"use client";

import { useState } from "react";
import type { FaqItem } from "@/components/common/FaqAccordion";

export type FaqSection = { heading: string; items: FaqItem[] };

// Migrated from ../aurexo/faqs.html lines 482-689. This page has 3 separate `.flat-accordion` groups
// ("How To Buy?" / "Exchanges & Returns" / "Refund Questions"), unlike every other page that's used
// `FaqAccordion` so far (calculator/sell-your-car/financing), which each only ever have ONE group.
//
// Verified by testing the real static source HTML directly (not assumed from reading the JS): the
// "only one item open at a time" behavior is GLOBAL across ALL 3 groups on this page, not scoped per
// group — `app.js`'s real handler (see `FaqAccordion`'s own header comment) selects
// `$('.flat-accordion .flat-toggle')` / `$('.flat-accordion .toggle-content')` unqualified by which
// specific `.flat-accordion` the clicked title belongs to, so opening a question in "Exchanges &
// Returns" actually closes whatever was open in "How To Buy?" too. Confirmed directly: clicking
// "Exchanges & Returns"'s first question closed "How To Buy?"'s (initially-open) first question.
// Also confirmed only ONE item across the whole page starts open (this page's very first question,
// "Steps to purchase a car from our dealership?") — the other two groups' own first items do NOT start
// active in source's markup, unlike an initial assumption that each group would have its own default-
// open item independently.
//
// A single shared `openQuestion` (by question text, unique across all 3 sections) reproduces this
// exactly — a separate component from `FaqAccordion` rather than retrofitting shared cross-instance
// state into that already-shipped, working single-group component.
export default function FaqsAccordionSections({
  pageHeading,
  sections,
}: {
  pageHeading: string;
  sections: FaqSection[];
}) {
  const [openQuestion, setOpenQuestion] = useState<string | null>(sections[0]?.items[0]?.question ?? null);

  return (
    <>
      {sections.map((section, sectionIndex) => (
        <div className={sectionIndex < sections.length - 1 ? "container mb-60" : "container"} key={section.heading}>
          {sectionIndex === 0 && (
            <>
              <h2>{pageHeading}</h2>
              <div className="tf-spacing-style3" />
            </>
          )}
          <p className={`h3 ${sectionIndex === sections.length - 1 ? "mb-18" : "mb-20"} text-center capitalize`}>
            {section.heading}
          </p>
          <div className="max-width-850 mx-auto w-full">
            <div className="flat-accordion flex flex-col gap-18 max-width-930 wow fadeIn" data-wow-delay=".3s">
              {section.items.map((item) => {
                const isOpen = openQuestion === item.question;
                return (
                  <div className={`flat-toggle bg-white${isOpen ? " active" : ""}`} key={item.question}>
                    <div
                      className={`toggle-title${isOpen ? " active" : ""}`}
                      onClick={() => setOpenQuestion(isOpen ? null : item.question)}
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
          </div>
        </div>
      ))}
    </>
  );
}
