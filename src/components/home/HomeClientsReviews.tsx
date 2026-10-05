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
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "Beli mobil secara online lebih mudah dari yang saya bayangkan. Situsnya mudah dipakai, jadi saya bisa cepat membandingkan banyak mobil. Opsi kreditnya fleksibel sehingga lebih mudah menemukan penawaran sesuai anggaran saya.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-2.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "Beli mobil secara online lebih mudah dari yang saya bayangkan. Situsnya mudah dipakai, jadi saya bisa cepat membandingkan banyak mobil. Opsi kreditnya fleksibel sehingga lebih mudah menemukan penawaran sesuai anggaran saya.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
];

export default function HomeClientsReviews() {
  return <ClientsReviewsCarousel testimonials={testimonials} starIcon="star.svg" initialSlide={3} />;
}
