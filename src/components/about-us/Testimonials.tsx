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
    text: "Pengalaman beli mobil di sini luar biasa. Pilihannya banyak, dan saya cepat menemukan mobil yang tepat. Prosesnya lancar, dan tim dukungan pelanggannya sangat membantu.",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-1.png",
    text: "Beli mobil online lebih mudah dari yang saya kira. Saya bisa membandingkan banyak mobil dalam hitungan menit. Opsi kreditnya fleksibel sehingga lebih mudah menemukan penawaran yang cocok.",
  },
  {
    name: "Olivia Williams",
    title: "CEO BMW",
    avatar: "/assets/images/avatar/avatar-2.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
  {
    name: "Emily Johnson",
    title: "CEO Avitex",
    avatar: "/assets/images/avatar/avatar-4.png",
    text: "Pengalaman beli mobil di sini luar biasa. Pilihannya banyak, dan saya cepat menemukan mobil yang tepat. Prosesnya lancar, dan tim dukungan pelanggannya sangat membantu.",
  },
];

export default function Testimonials() {
  return <ClientsReviewsCarousel testimonials={testimonials} starIcon="star-6.svg" />;
}
