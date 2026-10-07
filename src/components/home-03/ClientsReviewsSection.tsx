import ClientsReviewsCarousel, { type ClientTestimonial } from "@/components/common/ClientsReviewsCarousel";
import SellBuyPromoBanner from "@/components/common/SellBuyPromoBanner";

// Migrated from ../aurexo/home-03.html lines 2306-2519 ("Ulasan Pelanggan"). Own distinct testimonial
// content (3 real testimonials repeated once across 6 slides, `star.svg`, no `initialSlide` — confirmed
// via source diff against `home/HomeClientsReviews.tsx`'s 8-testimonial dataset and
// `about-us/Testimonials.tsx`'s 4-testimonial one), and each card is a real link to `/clients-reviews`
// (index.html's/home-02.html's own cards are plain non-linked divs). Followed, inside the SAME
// `<section>`, by the same 2-column promo banner already used after home-02.html's own "Why Choose Us"
// section (byte-identical images/copy, confirmed via source diff) — reused via `SellBuyPromoBanner`
// passed as `ClientsReviewsCarousel`'s `children`, with this page's own real href differences.
const testimonials: ClientTestimonial[] = [];

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
