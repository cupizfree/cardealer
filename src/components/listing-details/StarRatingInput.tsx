"use client";

import { useState } from "react";
import Image from "next/image";

// Matches `assets/js/app.js`'s rating-input__star click handler: clicking a star sets the hidden
// rating value and marks every star up to that position "active" (swaps star-3.svg -> star-4.svg).
// Source's form has no real submit handler either (no backend on this static site) — this stays a
// visual-only picker feeding the (also decorative) "Login to add a Review" button below it.
export default function StarRatingInput({
  defaultRating = 4,
  activeIcon = "/assets/icons/star-4.svg",
  inactiveIcon = "/assets/icons/star-3.svg",
  wrapperClassName = "rating-input mb-32",
}: {
  defaultRating?: number;
  /** product-details.html uses a different active/inactive icon pair (`star-4`/`star-7`,
   *  `rating-input-style2`) from the listing-details/sale-agents-details reviews form (`star-4`/`star-3`,
   *  plain `rating-input`) — same click-to-set-active-star behavior either way, so this stays one
   *  component with style props rather than a duplicated file. */
  activeIcon?: string;
  inactiveIcon?: string;
  wrapperClassName?: string;
}) {
  const [rating, setRating] = useState(defaultRating);

  return (
    <div className={wrapperClassName}>
      <input type="hidden" name="rating" id="rating-value" value={rating} />
      <div className="rating-input__stars" id="rating-stars">
        {[1, 2, 3, 4, 5].map((star) => (
          <span
            className={`rating-input__star${star <= rating ? " active" : ""}`}
            data-rating={star}
            key={star}
            onClick={() => setRating(star)}
          >
            <Image
              src={star <= rating ? activeIcon : inactiveIcon}
              alt="star"
              className="star-icon"
              width={20}
              height={20}
            />
          </span>
        ))}
      </div>
    </div>
  );
}
