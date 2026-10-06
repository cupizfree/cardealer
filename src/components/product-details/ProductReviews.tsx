"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { ProductRatingSummary, ProductReview } from "@/data/products";
import StarRatingInput from "@/components/listing-details/StarRatingInput";

// Migrated from ../aurexo/product-details.html lines 719-994. A genuinely different DOM shape from
// `common/ReviewsSection` (comment-box `style2`, a per-review title line `ReviewsSection`'s `Review`
// type has no field for, a "N Comments" + sort-dropdown row `ReviewsSection` doesn't render, and an
// add-review form with a separate Review-Title field) — per the variant classification rule, its own
// component rather than bolting product-page-only markup onto the already-shared reviews block.
//
// The "Sort by" dropdown mirrors `app.js`'s real `core-dropdown` open/close + label-swap widget, but
// the 3 options are source's own literal "Terbaru"/"Most Recent 2"/"Most Recent 3" placeholders —
// clicking one only updates the displayed label (confirmed no script ever reorders `.comments`), so no
// real sort is implemented here either, matching source's own limitation exactly.
const SORT_OPTIONS = ["Terbaru", "Terbaru 2", "Terbaru 3"];

export default function ProductReviews({
  ratingSummary,
  reviews,
}: {
  ratingSummary: ProductRatingSummary;
  reviews: ProductReview[];
}) {
  const [sortLabel, setSortLabel] = useState(SORT_OPTIONS[0]);
  const [isSortOpen, setIsSortOpen] = useState(false);
  const sortRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (sortRef.current && !sortRef.current.contains(event.target as Node)) {
        setIsSortOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <div className="rating-box__content mb-42">
        <div className="rating-box__overview">
          <div className="rating-box__average">
            <span className="rating-box__score">{ratingSummary.average}</span>
            <div className="rating-box__stars">
              {Array.from({ length: 5 }, (_, i) => (
                <Image key={i} src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
              ))}
            </div>
            <p className="rating-box__count">({ratingSummary.count.toLocaleString("id-ID")} Penilaian)</p>
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
                <div className="rating-box__bar radius-100" style={{ width: `${row.percent}%` }} />
              </div>
              <span className="rating-box__bar-percent">{row.percent}%</span>
            </div>
          ))}
        </div>
        <div className="rating-box__button">
          <a href="#reviewForm" className="btn btn-primary font-weight-600 capitalize btn-large-4">
            Tulis ulasan
          </a>
        </div>
      </div>

      <div className="grid gap-30 grid-cols-2 lg-grid-cols-1 mb-24">
        <div className="flex items-center">
          <div className="flex items-center gap-16">
            <p className="h3">{reviews.length.toString().padStart(2, "0")} Komentar</p>
          </div>
        </div>
        <div className="flex items-center justify-end">
          <div className="flex items-center gap-8 justify-end lg-flex-start">
            <p>Urutkan:</p>
            <div className={`core-dropdown${isSortOpen ? " active" : ""}`} ref={sortRef}>
              <button className="core-dropdown__button" type="button" onClick={() => setIsSortOpen((open) => !open)}>
                <span className="core-dropdown__selected">{sortLabel}</span>
                <Image src="/assets/icons/chevron-down-primary.svg" alt="chevron" className="core-dropdown__icon" width={20} height={20} />
              </button>
              <div className="core-dropdown__menu">
                <ul className="core-dropdown__list">
                  {SORT_OPTIONS.map((option) => (
                    <li className="core-dropdown__item" key={option}>
                      <button
                        type="button"
                        className={`core-dropdown__option${option === sortLabel ? " active" : ""}`}
                        onClick={() => {
                          setSortLabel(option);
                          setIsSortOpen(false);
                        }}
                      >
                        {option}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="comments mb-12">
        {reviews.map((review, index) => (
          <div className="comment-box style2" key={review.id}>
            <div className="comment-box__header">
              {review.authorAvatar ? (
                <div className="comment-box__avatar">
                  <Image src={review.authorAvatar} alt="avatar" width={48} height={48} />
                </div>
              ) : (
                <div className="comment-box__avatar guest">{review.authorInitials}</div>
              )}
              <div>
                <p className="h5 mb-4">{review.authorName}</p>
                <p className="text-secondary text-sm mb-12">{review.date}</p>

                <div className="flex items-center mb-12">
                  {Array.from({ length: review.rating }, (_, i) => (
                    <Image key={i} src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
                  ))}
                </div>

                <p className="h5 mb-12 capitalize" id={index === reviews.length - 1 ? "reviewForm" : undefined}>
                  {review.title}
                </p>
                <p className="text-secondary h7 mb-28">{review.text}</p>
                {index < reviews.length - 1 && <div className="divider" />}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div>
        <div className="flex gap-24 items-center mb-24">
          <p className="h3 capitalize">tambah ulasan</p>
          <StarRatingInput
            defaultRating={0}
            activeIcon="/assets/icons/star-4.svg"
            inactiveIcon="/assets/icons/star-7.svg"
            wrapperClassName="rating-input rating-input-style2"
          />
        </div>

        <form action="#" className="add-review-form" onSubmit={(event) => event.preventDefault()}>
          <div className="grid grid-cols-2 gap-22 mb-12 md-grid-cols-1">
            <div className="md-col-span-2 padding-0 w-full col-span-2">
              <p className="mb-8">Judul Ulasan</p>
              <input className="active input-large" id="Title-review" name="Title-review" type="text" placeholder="Give your review a title" required />
            </div>
            <div className="col-span-2 padding-0">
              <p className="mb-8">Ulasan</p>
              <textarea placeholder="Write comment " rows={3} tabIndex={5} name="message" className="message" id="message" required />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-20 mb-24 md-grid-cols-1 w-full col-span-2 padding-0">
            <div className="md-col-span-2 padding-0">
              <p className="mb-10">Nama</p>
              <input className="active input-large" id="Name-review" name="Name-review" type="text" defaultValue="Tony Nguyen" required />
            </div>
            <div className="md-col-span-2 padding-0">
              <p className="mb-10">Email</p>
              <input className="input-large" name="email-review" id="email-review" type="text" defaultValue="themesflat@gmail.com" required />
            </div>
          </div>

          <label className="filter-checkbox style-2 style-3 mb-22">
            <input type="checkbox" name="features" value="touch-screen" />
            <span>Simpan nama dan email untuk ulasan berikutnya</span>
          </label>

          <button type="submit" className="btn btn-primary-3 btn-large font-weight-600 capitalize">
            kirim ulasan
          </button>
        </form>
      </div>
    </>
  );
}
