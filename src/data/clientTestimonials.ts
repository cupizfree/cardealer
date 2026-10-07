import type { ClientTestimonial } from "@/components/common/ClientsReviewsCarousel";

// Shared by home-05.html's and home-06.html's own "Ulasan Pelanggan" sections — byte-identical 3
// distinct testimonials repeated to 6 slides on both pages (confirmed via direct source diff).
// "Benjamin Parker"/"Olivia Williams" reuse the exact same quote text already catalogued in
// `home/HomeClientsReviews.tsx`'s own dataset; "Emily Johnson" is new content introduced by these two
// pages, not present anywhere else.
export const emilyBenjaminOliviaTestimonials: ClientTestimonial[] = [];

// home-09.html's own "Ulasan Pelanggan" reuses the same 3 people/quote texts as
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
export const home09ClientTestimonials: ClientTestimonial[] = [];
