import type { ClientTestimonial } from "@/components/common/ClientsReviewsCarousel";

// Shared by home-05.html's and home-06.html's own "Clients Reviews" sections — byte-identical 3
// distinct testimonials repeated to 6 slides on both pages (confirmed via direct source diff).
// "Benjamin Parker"/"Olivia Williams" reuse the exact same quote text already catalogued in
// `home/HomeClientsReviews.tsx`'s own dataset; "Emily Johnson" is new content introduced by these two
// pages, not present anywhere else.
export const emilyBenjaminOliviaTestimonials: ClientTestimonial[] = [
  {
    name: "Emily Johnson",
    title: "CEO Avitex",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "Buying a car online was easier than I expected. The site was user-friendly, allowing me to compare multiple cars quickly. The flexible financing options made it much easier to find a deal that fit my budget.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
  {
    name: "Emily Johnson",
    title: "CEO Avitex",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "Buying a car online was easier than I expected. The site was user-friendly, allowing me to compare multiple cars quickly. The flexible financing options made it much easier to find a deal that fit my budget.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
];

// home-09.html's own "Clients Reviews" reuses the same 3 people/quote texts as
// `emilyBenjaminOliviaTestimonials`, but as a genuinely different 5-slide sequence (Emily/Benjamin/
// Olivia/Emily/Benjamin — NOT repeated to 6 like home-05/06/07.html's own usage, confirmed via source
// diff/slide count). RETROACTIVE FIX (found on request, "check testimonials of home-09"): the 3rd slide
// (Olivia Williams/avatar-3/CEO BMW) is a real, disclosed content bug in home-09.html's own source — it
// pairs Olivia's name/avatar with EMILY's own quote text, not Olivia's own distinct "I've bought several
// cars..." quote every other page uses (confirmed via direct source diff) — preserved verbatim here
// rather than silently corrected to Olivia's real quote, per the project's html-fidelity rule. (Slide 3
// is also the only one rendered as a plain, non-linked div in source rather than a real link — a
// separate, already-established decorative-demo-noise decision, not reproduced at the link level, same
// as home-07.html's own analogous slide.)
export const home09ClientTestimonials: ClientTestimonial[] = [
  {
    name: "Emily Johnson",
    title: "CEO Avitex",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "Buying a car online was easier than I expected. The site was user-friendly, allowing me to compare multiple cars quickly. The flexible financing options made it much easier to find a deal that fit my budget.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.",
  },
  {
    name: "Emily Johnson",
    title: "CEO Avitex",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "Buying a car online was easier than I expected. The site was user-friendly, allowing me to compare multiple cars quickly. The flexible financing options made it much easier to find a deal that fit my budget.",
  },
];
