import Image from "next/image";
import Link from "next/link";

// Extracted out of `home-02/WhyChooseUsCarousel.tsx` once home-03.html needed the exact same
// 2-column promo banner (same images/titles/bullets/CTAs, confirmed byte-identical via source diff) —
// there it follows the "Why Choose Us" icon-card carousel, here it follows "Clients Reviews" instead.
// Same "extract into `common/` once a second page needs it" precedent as `Pagination`/
// `ClientsReviewsCarousel`/`WhyChooseUsSection`.
export default function SellBuyPromoBanner({
  leftTitleHref = "/sell-your-car",
  rightTitleHref,
  rightCtaHref,
  layout = "row",
}: {
  /** home-03.html's own "Buy Used Cars Easily" title links to `/listing-grid4-columns` instead of
   *  `/sell-your-car` (confirmed via source diff against home-02.html's own usage). */
  leftTitleHref?: string;
  /** home-02.html's own "Sell Your Car Simply" title is a literal dead `href="#"`; home-03.html's own
   *  points at `/sell-your-car` instead (confirmed via source diff) — real per-page difference. */
  rightTitleHref?: string;
  /** Retroactive fix: home-02.html's own "List Your Car Today!" bottom CTA really is a dead `href="#"`
   *  (confirmed via source read) — kept as the default. home-03.html's AND home-04.html's own versions
   *  of this exact same CTA both point at `sell-your-car.html` instead (confirmed via source diff on
   *  both) — home-03's migration missed this real per-page difference until home-04's migration
   *  surfaced it; both callers now pass `/sell-your-car` explicitly. */
  rightCtaHref?: string;
  /** home-07.html's own reuse of these same 2 cards (byte-identical images/copy/hrefs, confirmed via
   *  source diff) stacks them vertically inside its "Latest For Sale" sidebar column
   *  (`.col-lg-4 > .flex.flex-col.gap-30`) instead of the `.container > .row > .col-lg-6` layout every
   *  other page uses. `"stack"` swaps only the outer wrapper — the cards themselves are unchanged. */
  layout?: "row" | "stack";
}) {
  const leftCard = (
    <div className="car-box-style-3">
      <Image className="card--img" src="/assets/images/card/card-25.jpg" alt="car" width={640} height={480} />
      <div className="content">
        <p className="h3">
          <Link href={leftTitleHref} className="card--title h3 text-white font-weight-600 mb-8">
            Buy Used Cars Easily
          </Link>
        </p>
        <ul className="list">
          <li>
            <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
            Browse thousands of affordable options.
          </li>
          <li>
            <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
            Smart tools to find your perfect car fast.
          </li>
          <li>
            <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
            Safe transactions with quality assurance.
          </li>
        </ul>
        <Link href="/sell-your-car" className="btn btn-white btn-large font-weight-600 max-w-min text-primary">
          Find Your Car Now!
        </Link>
      </div>
    </div>
  );

  const rightCard = (
    <div className="car-box-style-3">
      <Image className="card--img" src="/assets/images/card/card-26.jpg" alt="car" width={640} height={480} />
      <div className="content">
        <p className="h3">
          {rightTitleHref ? (
            <Link href={rightTitleHref} className="card--title h3 text-white font-weight-600 mb-8">
              Sell Your Car Simply
            </Link>
          ) : (
            <a href="#" className="card--title h3 text-white font-weight-600 mb-8">
              Sell Your Car Simply
            </a>
          )}
        </p>
        <ul className="list">
          <li>
            <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
            List in minutes with ease.
          </li>
          <li>
            <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
            Reach thousands of buyers instantly.
          </li>
          <li>
            <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
            Secure payment with loan assistance.
          </li>
        </ul>
        {rightCtaHref ? (
          <Link href={rightCtaHref} className="btn btn-white btn-large font-weight-600 max-w-min text-primary">
            List Your Car Today!
          </Link>
        ) : (
          <a href="#" className="btn btn-white btn-large font-weight-600 max-w-min text-primary">
            List Your Car Today!
          </a>
        )}
      </div>
    </div>
  );

  if (layout === "stack") {
    return (
      <div className="flex flex-col gap-30">
        {leftCard}
        {rightCard}
      </div>
    );
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-lg-6 col-md-12 md-mb-30 wow fadeInUp">{leftCard}</div>
        <div className="col-lg-6 col-md-12 wow fadeInUp">{rightCard}</div>
      </div>
    </div>
  );
}
