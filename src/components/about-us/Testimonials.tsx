import ClientsReviewsCarousel, { type ClientTestimonial } from "@/components/common/ClientsReviewsCarousel";

// Migrated from about-us.html lines 538-646. Config matches `swiperTestimoniorConfig` in
// ../aurexo/assets/js/swiper.js verbatim (slidesPerView 1/2/3 responsive, spaceBetween 30, speed 800,
// clickable dot pagination). Slide 4 is content-identical to slide 1 in source itself (a demo repeat,
// not a bug) — preserved as-is, not deduplicated. Now delegates to `common/ClientsReviewsCarousel`,
// extracted once index.html needed the exact same widget with its own content/star icon — see that
// file's header comment.
const testimonials: ClientTestimonial[] = [];

export default function Testimonials() {
  return <ClientsReviewsCarousel testimonials={testimonials} starIcon="star-6.svg" />;
}
