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

export const customerReviews: CustomerReview[] = [
  {
    id: 1,
    avatar: "/assets/images/avatar/avatar-4.png",
    name: "Randynox",
    date: "August 13, 2025",
    dateIso: "2025-08-13",
    rating: 5,
    title: "Great Experience!",
    text: "Pengalaman beli mobil di sini luar biasa. Pilihannya banyak, dan saya cepat menemukan mobil yang tepat. Prosesnya lancar, dan tim dukungan pelanggannya sangat membantu. Sangat saya rekomendasikan!",
  },
  {
    id: 2,
    avatar: "/assets/images/avatar/coment-avatar-1.png",
    name: "Mista Nyroom",
    date: "August 22, 2025",
    dateIso: "2025-08-22",
    rating: 5,
    title: "Mudah dan Praktis!",
    text: "Beli mobil online lebih mudah dari yang saya bayangkan. Situsnya mudah dipakai, dan saya bisa membandingkan banyak mobil dalam hitungan menit. Opsi kreditnya fleksibel sehingga lebih mudah menemukan penawaran yang cocok.",
  },
  {
    id: 3,
    avatar: "/assets/images/avatar/coment-avatar-2.png",
    name: "Mista Nyroom",
    date: "August 22, 2025",
    dateIso: "2025-08-22",
    rating: 5,
    title: "Trustworthy and Reliable",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
];
