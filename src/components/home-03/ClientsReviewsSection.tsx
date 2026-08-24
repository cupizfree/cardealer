import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import SellBuyPromoBanner from "@/components/common/SellBuyPromoBanner";

// Migrated from ../aurexo/home-03.html lines 2306-2519 ("Clients Reviews"). Own distinct testimonial
// content (3 real testimonials repeated once across 6 slides, `star.svg`, no `initialSlide` — confirmed
// via source diff against `home/HomeClientsReviews.tsx`'s 8-testimonial dataset and
// `about-us/Testimonials.tsx`'s 4-testimonial one), and each card is a real link to `/clients-reviews`
// (index.html's/home-02.html's own cards are plain non-linked divs). Followed, inside the SAME
// `<section>`, by the same 2-column promo banner already used after home-02.html's own "Why Choose Us"
// section (byte-identical images/copy, confirmed via source diff) — reused via `SellBuyPromoBanner`
// passed as `ClientsReviewsCarousel`'s `children`, with this page's own real href differences.
const testimonials = [
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "Buying a car online was easier than I expected. The site was user-friendly, allowing me to compare multiple cars quickly. The flexible financing options made it much easier to find a deal that fit my budget.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "Buying a car online was easier than I expected. The site was user-friendly, allowing me to compare multiple cars quickly. The flexible financing options made it much easier to find a deal that fit my budget.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
];

export default function ClientsReviewsSection() {
  return (
    <ClientsReviewsCarousel testimonials={testimonials} starIcon="star.svg" cardHref="/clients-reviews">
      <div className="tf-spacing" />
      <SellBuyPromoBanner
        leftTitleHref="/listing-grid4-columns"
        rightTitleHref="/sell-your-car"
        rightCtaHref="/sell-your-car"
      />
    </ClientsReviewsCarousel>
  );
}
