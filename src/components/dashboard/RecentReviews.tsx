import Image from "next/image";
import { customerReviews } from "@/data/reviews";

// Migrated from ../aurexo/dashboard.html lines 872-954. Static, real content (3 distinct reviews, no
// script touches this section at all). "Mista Nyroom" appears twice with different content — a real
// source repeat, preserved as-is. Reviews are sourced from `src/data/reviews.ts`, shared with
// reviews.html's own dedicated page (byte-identical 3 reviews, confirmed via source diff) — extracted
// once that page needed the same data, same "extract into a shared file once a second consumer needs it"
// precedent as `Pagination`/`SocialIcons`.
export default function RecentReviews() {
  return (
    <div className="dashboard-box bg-white">
      <p className="h4 mb-20">Ulasan Terbaru</p>
      <div className="comments">
        {customerReviews.map((review) => (
          <div className="comment-box" key={review.id}>
            <div className="comment-box__header gap-12 mb-24">
              <div className="comment-box__avatar">
                <Image src={review.avatar} alt="avatar" width={48} height={48} />
              </div>
              <div>
                <div className="text-secondary gap-4 pt-4">
                  <p className="h5 mb-4">{review.name}</p>
                  <p className="text-secondary text-sm">{review.date}</p>
                </div>
              </div>
            </div>

            <div className="flex items-center mb-12">
              {Array.from({ length: 5 }, (_, starIndex) => (
                <Image key={starIndex} src="/assets/icons/star-2.svg" alt="star" width={20} height={20} />
              ))}
            </div>

            <p className="h5 mb-12">{review.title}</p>
            <p className="h7 line-height-28">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
