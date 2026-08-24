import Image from "next/image";
import type { ListingRatingSummary, Review } from "@/data/listings";
import StarRatingInput from "@/components/listing-details/StarRatingInput";
import LoginToReviewButton from "@/components/listing-details/LoginToReviewButton";

// Extracted out of `ListingDetailsContent` (rating-box + comments + add-review-form) once
// sale-agents-details.html needed the exact same "Customer Reviews" block byte-identical to the
// listing-details pages' own (same 4.8 average/distribution, same 3 reviewers — confirmed via direct
// source diff) — same "extract into shared files once a second feature needs it" precedent as
// `SocialIcons`/`Pagination`. No listing-specific typing beyond the already-shared `Review`/
// `ListingRatingSummary` types, so this has no dependency on `Listing` itself.
export default function ReviewsSection({
  ratingSummary,
  reviews,
  reviewsHeaderButton = true,
  reviewFormVariant = "full",
  sectionId,
}: {
  ratingSummary: ListingRatingSummary;
  reviews: Review[];
  reviewsHeaderButton?: boolean;
  reviewFormVariant?: "full" | "loginOnly";
  sectionId?: string;
}) {
  return (
    <>
      <div className="flex items-center justify-between gap-16 mb-16" id={sectionId}>
        <p className="h4">Customer Reviews</p>
        {reviewsHeaderButton && (
          <a href="#reviewForm" className="btn btn-primary btn-small-2 font-weight-600 capitalize">
            Write a review
          </a>
        )}
      </div>

      <div className="rating-box mb-40">
        <div className="rating-box__content">
          <div className="rating-box__overview">
            <div className="rating-box__average">
              <span className="rating-box__score">{ratingSummary.average}</span>
              <div className="rating-box__stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <Image key={i} src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
                ))}
              </div>
              <p className="rating-box__count">({ratingSummary.count.toLocaleString()} Ratings)</p>
            </div>
          </div>
          <div className="rating-box__distribution">
            {ratingSummary.distribution.map((row) => (
              <div className="rating-box__bar-item" key={row.stars}>
                <p className="rating-box__bar-label">
                  <span className="text">{row.stars}</span>
                  <Image src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
                </p>
                <div className="rating-box__bar-wrapper">
                  <div className="rating-box__bar" style={{ width: `${row.percent}%` }} />
                </div>
                <span className="rating-box__bar-percent">{row.percent}%</span>
              </div>
            ))}
          </div>
          <div className="rating-box__button">
            <a href="#reviewForm" className="btn btn-primary btn-large font-weight-600 capitalize">
              Write a review
            </a>
          </div>
        </div>
      </div>

      <div className="comments mb-40">
        {reviews.map((review, index) => (
          <div className="comment-box" key={review.id} id={index === reviews.length - 1 ? "reviewForm" : undefined}>
            <div className="comment-box__header mb-20">
              {review.authorAvatar ? (
                <div className="comment-box__avatar">
                  <Image src={review.authorAvatar} alt="avatar" width={48} height={48} />
                </div>
              ) : (
                <div className="comment-box__avatar guest">{review.authorInitials}</div>
              )}
              <div>
                <div className="flex items-center text-secondary mb-8 gap-4">
                  <p className="h5">{review.authorName}</p>
                  <span className="text-secondary text-sm">-</span>
                  <span className="text-secondary text-sm">{review.date}</span>
                </div>
                <div className="flex items-center">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Image key={i} src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
                  ))}
                </div>
              </div>
            </div>
            <p className="text-secondary">{review.text}</p>
          </div>
        ))}

        <p>
          <a href="/clients-reviews" className="text-underline font-weight-600 capitalize">
            View more reviews (98)
          </a>
        </p>
      </div>

      <div>
        <p className="h4 capitalize mb-8">add a review</p>
        {reviewFormVariant === "full" ? (
          <>
            <p className="mb-24">Your email address will not be published</p>
            <form action="#" className="add-review-form">
              <div className="grid grid-cols-2 gap-22 mb-12 md-grid-cols-1">
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Name</p>
                  <input className="active input-large" id="name-review" name="name-review" type="text" defaultValue="Tony Nguyen" required />
                </div>
                <div className="md-col-span-2 padding-0">
                  <p className="mb-8">Email</p>
                  <input className="input-large" name="email-review" id="email-review" type="text" defaultValue="themesflat@gmail.com" required />
                </div>
                <div className="col-span-2 padding-0">
                  <p className="mb-8">Review</p>
                  <textarea placeholder="Your Review" rows={3} tabIndex={5} name="message" className="message" id="message" required />
                </div>
              </div>

              <div className="col-span-2 padding-0">
                <p className="mb-12">Rating</p>
                <StarRatingInput defaultRating={4} />
              </div>

              <LoginToReviewButton />
            </form>
          </>
        ) : (
          // Some layout variants (e.g. listing-details-2.html) show the login-gated button only —
          // no visible Name/Email/Review/Rating fields at all (confirmed via direct source read).
          <>
            <p className="mb-20">Your email address will not be published</p>
            <LoginToReviewButton />
          </>
        )}
      </div>
    </>
  );
}
