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
  { name: "Emily Johnson", title: "CEO Avitex", avatar: "/assets/images/avatar/avatar-4.png", text: "I had an amazing experience buying my car from this website. The selection was huge, and I found the perfect car in no time. The process was smooth, and the customer support team was very helpful throughout." },
  { name: "Benjamin Parker", title: "CEO Tesla", avatar: "/assets/images/avatar/avatar-1.png", text: "Buying a car online was easier than I expected. I was able to compare multiple cars within minutes. The financing options were flexible, making it much easier to find a deal that worked for me." },
  { name: "Olivia Williams", title: "CEO BMW", avatar: "/assets/images/avatar/avatar-2.png", text: "I've bought several cars over the years, but this was by far the best experience. The service was honest and transparent, and the car I purchased was exactly as described. I'll definitely be returning for my next vehicle!" },
  { name: "Michael Carter", title: "Manager, NexTech", avatar: "/assets/images/pages/sale-agent-3.jpg", text: "Buying my car through this platform was a breeze! The detailed car listings helped me make an informed choice. The support team answered all my questions promptly. I'm thrilled with my purchase!" },
  { name: "Sophia Martinez", title: "Freelance Designer", avatar: "/assets/images/pages/sale-agent-2.jpg", text: "The professionalism displayed by this dealership was top-notch. They guided me through every step and ensured I got a great deal on my car. I'll definitely return here for my next car purchase." },
  { name: "Sophia Carter", title: "CEO BMW", avatar: "/assets/images/pages/sale-agent-1.jpg", text: "Buying my car here was simple! The website was user-friendly, and I quickly found a car that perfectly fit my needs. Customer support was helpful throughout the seamless process, making everything stress-free." },
  { name: "Daniel Wright", title: "Entrepreneur", avatar: "/assets/images/pages/sale-agent-4.jpg", text: "This platform's wide variety of cars made finding the perfect one for me incredibly easy. The process was straightforward and well-organized, and the team was attentive and helpful at every step along the way." },
  { name: "Sarah Nguyen", title: "Accountant", avatar: "/assets/images/pages/sale-agent-6.jpg", text: "The intuitive website, along with detailed listings, made choosing a car enjoyable and effortless. Customer support promptly addressed all my concerns and ensured I was confident in my decision." },
  { name: "James Anderson", title: "Project Manager", avatar: "/assets/images/pages/sale-agent-8.jpg", text: "This platform was fast, efficient, and very easy to use for finding a car. I found the right vehicle quickly, and the entire process was hassle-free and transparent. Definitely recommend this service to everyone!" },
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
        <h2>Clients Reviews</h2>
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
