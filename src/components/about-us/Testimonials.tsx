import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";

// Migrated from about-us.html lines 538-646. Config matches `swiperTestimoniorConfig` in
// ../aurexo/assets/js/swiper.js verbatim (slidesPerView 1/2/3 responsive, spaceBetween 30, speed 800,
// clickable dot pagination). Slide 4 is content-identical to slide 1 in source itself (a demo repeat,
// not a bug) — preserved as-is, not deduplicated. Now delegates to `common/ClientsReviewsCarousel`,
// extracted once index.html needed the exact same widget with its own content/star icon — see that
// file's header comment.
const testimonials = [
  {
    name: "Emily Johnson",
    title: "CEO Avitex",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "Buying a car online was easier than I expected. I was able to compare multiple cars within minutes. The financing options were flexible, making it much easier to find a deal that worked for me.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-2.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
  {
    name: "Emily Johnson",
    title: "CEO Avitex",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout.",
  },
];

export default function Testimonials() {
  return <ClientsReviewsCarousel testimonials={testimonials} starIcon="star-6.svg" />;
}
