import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";

// Migrated from ../aurexo/index.html lines 3097-3296 (`.swiper-testimonior`, `data-initial-slide="3"`).
// Source repeats "Olivia Williams / CEO BMW" over the identical text 6 times (only the avatar image
// varies: 4/3/1/2/4/3) and "Benjamin Parker / CEO Tesla" twice (avatar 4/3) — a real, disclosed
// content pattern, preserved verbatim rather than deduplicated. Uses `star.svg`, not about-us's
// `star-6.svg` (confirmed via source read — a real icon difference between the two pages' otherwise
// identical widget).
const testimonials = [
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-4.png",
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
    avatar: "/assets/images/avatar/avatar-4.png",
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
    avatar: "/assets/images/avatar/avatar-2.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "Buying a car online was easier than I expected. The site was user-friendly, allowing me to compare multiple cars quickly. The flexible financing options made it much easier to find a deal that fit my budget.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
];

export default function HomeClientsReviews() {
  return <ClientsReviewsCarousel testimonials={testimonials} starIcon="star.svg" initialSlide={3} />;
}
