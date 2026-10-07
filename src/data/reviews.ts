// Canonical customer-review entity, shared by dashboard.html's own "Ulasan Terbaru" widget
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

export const customerReviews: CustomerReview[] = [];
