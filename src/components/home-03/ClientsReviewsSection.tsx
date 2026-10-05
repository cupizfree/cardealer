import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import SellBuyPromoBanner from "@/components/common/SellBuyPromoBanner";

// Migrated from ../aurexo/home-03.html lines 2306-2519 ("Ulasan Pelanggan"). Own distinct testimonial
// content (3 real testimonials repeated once across 6 slides, `star.svg`, no `initialSlide` — confirmed
// via source diff against `home/HomeClientsReviews.tsx`'s 8-testimonial dataset and
// `about-us/Testimonials.tsx`'s 4-testimonial one), and each card is a real link to `/clients-reviews`
// (index.html's/home-02.html's own cards are plain non-linked divs). Followed, inside the SAME
// `<section>`, by the same 2-column promo banner already used after home-02.html's own "Why Choose Us"
// section (byte-identical images/copy, confirmed via source diff) — reused via `SellBuyPromoBanner`
// passed as `ClientsReviewsCarousel`'s `children`, with this page's own real href differences.
const testimonials = [
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-1.png",
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
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
  {
    name: "Benjamin Parker",
    title: "CEO Tesla",
    avatar: "/assets/images/avatar/avatar-1.png",
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
    avatar: "/assets/images/avatar/avatar-3.png",
    text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!",
  },
];

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
