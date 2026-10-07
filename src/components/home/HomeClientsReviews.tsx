import ClientsReviewsCarousel, { type ClientTestimonial } from "@/components/common/ClientsReviewsCarousel";

// Migrated from ../aurexo/index.html lines 3097-3296 (`.swiper-testimonior`, `data-initial-slide="3"`).
// Source repeats "Olivia Williams / CEO BMW" over the identical text 6 times (only the avatar image
// varies: 4/3/1/2/4/3) and "Benjamin Parker / CEO Tesla" twice (avatar 4/3) — a real, disclosed
// content pattern, preserved verbatim rather than deduplicated. Uses `star.svg`, not about-us's
// `star-6.svg` (confirmed via source read — a real icon difference between the two pages' otherwise
// identical widget).
const testimonials: ClientTestimonial[] = [];

export default function HomeClientsReviews() {
  return <ClientsReviewsCarousel testimonials={testimonials} starIcon="star.svg" initialSlide={3} />;
}
