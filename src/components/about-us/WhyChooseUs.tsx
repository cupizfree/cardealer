import WhyChooseUsSection from "@/components/common/WhyChooseUsSection";

// Migrated from about-us.html lines 650-733. The 4 stat numbers are static text, not a real count-up
// animation: app.js's `flatCounter()` only runs its counting logic
// `if ($(document.body).hasClass("counter-scroll"))`, and this page's `<body>` is plain
// `class="inner-page"` (no such class) — so source itself never animates these here. Now delegates to
// `common/WhyChooseUsSection`, extracted once home-03.html needed the exact same content on a dark
// background with real animated counters (its own `<body>` DOES carry `counter-scroll`) — see that
// file's own header comment.
export default function WhyChooseUs() {
  return <WhyChooseUsSection variant="light" animateCounters={false} />;
}
