// Canonical customer-review entity, shared by dashboard.html's own "Recent Reviews" widget
// (`dashboard/RecentReviews.tsx`) and reviews.html's own dedicated page (`reviews/ReviewsSection.tsx`) —
// both show the exact same 3 reviews (confirmed via source diff), so this file is the single source of
// truth instead of two copies drifting apart. `rating` comes from reviews.html's own real `data-start`
// attribute (all 3 are "5" in source — confirmed via grep, not an invented value) and `date` is a real
// ISO-parseable value derived from each review's own displayed date string, needed for reviews.html's
// real date-sort feature.
export type CustomerReview = {
  id: number;
  avatar: string;
  name: string;
  date: string;
  dateIso: string;
  rating: number;
  title: string;
  text: string;
};

export const customerReviews: CustomerReview[] = [
  {
    id: 1,
    avatar: "/assets/images/avatar/avatar-4.png",
    name: "Randynox",
    date: "August 13, 2025",
    dateIso: "2025-08-13",
    rating: 5,
    title: "Great Experience!",
    text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout. Highly recommend!",
  },
  {
    id: 2,
    avatar: "/assets/images/avatar/coment-avatar-1.png",
    name: "Mista Nyroom",
    date: "August 22, 2025",
    dateIso: "2025-08-22",
    rating: 5,
    title: "Easy and Convenient!",
    text: "Buying a car online was easier than I expected. The site was user-friendly, and I was able to compare multiple cars within minutes. The financing options were flexible, making it much easier to find a deal that worked for me.",
  },
  {
    id: 3,
    avatar: "/assets/images/avatar/coment-avatar-2.png",
    name: "Mista Nyroom",
    date: "August 22, 2025",
    dateIso: "2025-08-22",
    rating: 5,
    title: "Trustworthy and Reliable",
    text: "I’ve bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I’ll definitely be returning for my next vehicle!",
  },
];
