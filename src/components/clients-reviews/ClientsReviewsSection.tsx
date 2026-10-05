"use client";

import { useState } from "react";
import Image from "next/image";
import Pagination from "@/components/common/Pagination";

// Migrated from ../aurexo/clients-reviews.html lines 484-697. `.testimonior-box` (same shape as
// about-us.html's testimonial swiper slides — first 3 entries here are byte-identical to that page's
// slides 1-3, confirmed via source diff) but rendered as a plain static 3-column grid here, not a
// Swiper carousel — a genuinely different presentation, not a variant of `about-us/Testimonials`.
// All 9 are real, distinct reviews (unlike about-us's swiper, which repeats slide 1 as slide 4) — no
// content-drift/demo-repeat to disclose here.
const testimonials = [
  { name: "Emily Johnson", title: "CEO Avitex", avatar: "/assets/images/avatar/avatar-4.png", text: "Pengalaman beli mobil di sini luar biasa. Pilihannya banyak, dan saya cepat menemukan mobil yang tepat. Prosesnya lancar, dan tim dukungan pelanggannya sangat membantu." },
  { name: "Benjamin Parker", title: "CEO Tesla", avatar: "/assets/images/avatar/avatar-1.png", text: "Beli mobil online lebih mudah dari yang saya kira. Saya bisa membandingkan banyak mobil dalam hitungan menit. Opsi kreditnya fleksibel sehingga lebih mudah menemukan penawaran yang cocok." },
  { name: "Olivia Williams", title: "CEO BMW", avatar: "/assets/images/avatar/avatar-2.png", text: "Sudah beberapa kali saya beli mobil, tapi ini pengalaman terbaik. Pelayanannya jujur dan transparan, dan mobil yang saya beli persis seperti deskripsinya. Saya pasti kembali untuk mobil berikutnya!" },
  { name: "Michael Carter", title: "Manager, NexTech", avatar: "/assets/images/pages/sale-agent-3.jpg", text: "Beli mobil lewat platform ini sangat mudah! Detail iklannya membantu saya mengambil keputusan. Tim dukungan menjawab semua pertanyaan saya dengan cepat. Saya sangat puas!" },
  { name: "Sophia Martinez", title: "Freelance Designer", avatar: "/assets/images/pages/sale-agent-2.jpg", text: "Profesionalisme showroom ini luar biasa. Mereka membimbing saya di setiap langkah dan memastikan saya mendapat harga terbaik. Saya pasti kembali untuk pembelian berikutnya." },
  { name: "Sophia Carter", title: "CEO BMW", avatar: "/assets/images/pages/sale-agent-1.jpg", text: "Beli mobil di sini simpel! Situsnya mudah dipakai, dan saya cepat menemukan mobil yang pas. Dukungan pelanggan membantu di seluruh proses, jadi semuanya tanpa stres." },
  { name: "Daniel Wright", title: "Entrepreneur", avatar: "/assets/images/pages/sale-agent-4.jpg", text: "Pilihan mobil yang sangat banyak membuat saya mudah menemukan yang tepat. Prosesnya jelas dan tertata, dan timnya sigap membantu di setiap langkah." },
  { name: "Sarah Nguyen", title: "Accountant", avatar: "/assets/images/pages/sale-agent-6.jpg", text: "Situsnya intuitif dan iklannya detail, jadi memilih mobil terasa mudah dan menyenangkan. Dukungan pelanggan cepat menanggapi semua kekhawatiran saya dan membuat saya yakin dengan pilihan saya." },
  { name: "James Anderson", title: "Project Manager", avatar: "/assets/images/pages/sale-agent-8.jpg", text: "Platform ini cepat, efisien, dan sangat mudah dipakai. Saya cepat menemukan mobil yang tepat, dan seluruh prosesnya lancar serta transparan. Sangat saya rekomendasikan!" },
];

// Pagination: standing rule (see docs/migration/COMPONENT_MAP.md #36) — any page with pagination
// markup gets it wired up for real, not decorative. Source's own `.pagination__link`s have zero
// backing JS here too (confirmed via search). 3 reviews/page (one grid row at 3 columns) happens to
// divide the 9 real reviews into exactly 3 real pages — matching source's own literal "1 2 3" markup
// without needing to invent a 4th page's worth of reviews.
const REVIEWS_PER_PAGE = 3;

export default function ClientsReviewsSection() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(testimonials.length / REVIEWS_PER_PAGE);
  const pageReviews = testimonials.slice((page - 1) * REVIEWS_PER_PAGE, page * REVIEWS_PER_PAGE);

  return (
    <section className="pb-100">
      <div className="container">
        <h2>Ulasan Pelanggan</h2>
        <div className="tf-spacing-style3" />

        <div className="grid grid-cols-3 gap-y-38 gap-x-30 lg-grid-cols-2 md-grid-cols-1 mb-40">
          {pageReviews.map((review) => (
            <div className="testimonior-box" key={review.name}>
              <div className="flex items-center gap-4 mb-16">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Image key={i} src="/assets/icons/star-6.svg" alt="testimonior" width={16} height={16} />
                ))}
              </div>
              <p className="testimonior-box--desc mb-16">{review.text}</p>
              <div className="testimonior-box--user">
                <Image className="testimonior--img" src={review.avatar} alt="avatar" width={56} height={56} />
                <div className="testimonior-box--user-content">
                  <p className="h5 title">{review.name}</p>
                  <p className="desc">{review.title}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </section>
  );
}
