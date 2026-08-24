import Link from "next/link";
import Image from "next/image";

// Extracted out of the `/listing-details/[slug]` route so `listing-details-2` (and future layout
// variants) can reuse the identical breadcrumb + Prev/Next row without duplicating the markup.
// The Prev/Next controls only do something on pages that actually mount the Swiper gallery
// (`DetailsGallery`, via the `.swiper-listing-details-prev/next` class hook) — on layout variants
// using the grid gallery (`DetailsGalleryGrid`, no Swiper instance), they render but are inert,
// matching what source itself does there (no swiper on that page for them to drive either).
//
// `interactiveNav`: listing-details-5.html adds `navigation-prev`/`navigation-next` classes to these
// same two elements (confirmed via direct source read) so its gallery's Swiper `navigation` selector
// — which also matches the buttons rendered inside `DetailsGalleryCarousel` — binds BOTH sets of
// buttons to the one swiper instance (`assets/js/swiper.js`'s `swiperListingDetails5Config`, which
// explicitly discovers and wires up both the breadcrumb and in-gallery nav elements). Adding the
// class here is for Swiper's selector-based multi-element binding only — the frosted-glass button
// CSS is a separate, scoped rule (`.swiper-listing-details-5 .swiper-button`) that only matches
// elements actually nested inside that gallery, so this doesn't change how the breadcrumb buttons
// look, only that clicking them also drives the gallery.
export default function ListingDetailsBreadcrumb({
  title,
  sectionClassName,
  interactiveNav = false,
}: {
  title: string;
  // listing-details-1.html wraps this in a bare `<section>`; listing-details-2.html (and presumably
  // other layout variants) use `<section class="background-light">` plus a spacer div right after —
  // confirmed via direct source read, not a class we're inventing per variant.
  sectionClassName?: string;
  interactiveNav?: boolean;
}) {
  return (
    <section className={sectionClassName}>
      <div className="container">
        <div className="flex items-center justify-between">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>{title}</span>
            </li>
          </ul>

          <div className="swiper-listing-details-navigation">
            <p className={`swiper-listing-details-prev${interactiveNav ? " navigation-prev" : ""}`}>
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.85414 10.1465C5.9006 10.193 5.93745 10.2481 5.96259 10.3088C5.98773 10.3695 6.00067 10.4346 6.00067 10.5003C6.00067 10.566 5.98773 10.631 5.96259 10.6917C5.93745 10.7524 5.9006 10.8076 5.85414 10.854C5.80769 10.9005 5.75254 10.9373 5.69184 10.9625C5.63115 10.9876 5.56609 11.0006 5.50039 11.0006C5.4347 11.0006 5.36964 10.9876 5.30895 10.9625C5.24825 10.9373 5.1931 10.9005 5.14664 10.854L0.146643 5.85403C0.100155 5.80759 0.0632757 5.75245 0.0381136 5.69175C0.0129514 5.63105 0 5.56599 0 5.50028C0 5.43457 0.0129514 5.36951 0.0381136 5.30881C0.0632757 5.24811 0.100155 5.19296 0.146643 5.14653L5.14664 0.146528C5.24046 0.0527077 5.36771 -2.61548e-09 5.50039 0C5.63308 2.61548e-09 5.76032 0.0527077 5.85414 0.146528C5.94796 0.240348 6.00067 0.367596 6.00067 0.500278C6.00067 0.63296 5.94796 0.760208 5.85414 0.854028L1.20727 5.50028L5.85414 10.1465Z"
                  fill="#1C1C1C"
                />
              </svg>
              Prev
            </p>
            <p className={`swiper-listing-details-next${interactiveNav ? " navigation-next" : ""}`}>
              Next
              <svg width="6" height="11" viewBox="0 0 6 11" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M5.85403 5.85403L0.854028 10.854C0.807573 10.9005 0.752423 10.9373 0.691726 10.9625C0.63103 10.9876 0.565975 11.0006 0.500278 11.0006C0.434581 11.0006 0.369526 10.9876 0.30883 10.9625C0.248133 10.9373 0.192983 10.9005 0.146528 10.854C0.100073 10.8076 0.0632225 10.7524 0.0380812 10.6917C0.0129398 10.631 0 10.566 0 10.5003C0 10.4346 0.0129398 10.3695 0.0380812 10.3088C0.0632225 10.2481 0.100073 10.193 0.146528 10.1465L4.7934 5.50028L0.146528 0.854028C0.0527074 0.760208 -9.88558e-10 0.63296 0 0.500278C9.88559e-10 0.367596 0.0527074 0.240348 0.146528 0.146528C0.240348 0.0527077 0.367596 9.88558e-10 0.500278 0C0.63296 -9.88558e-10 0.760208 0.0527077 0.854028 0.146528L5.85403 5.14653C5.90052 5.19297 5.9374 5.24811 5.96256 5.30881C5.98772 5.36951 6.00067 5.43457 6.00067 5.50028C6.00067 5.56599 5.98772 5.63105 5.96256 5.69175C5.9374 5.75245 5.90052 5.80759 5.85403 5.85403Z"
                  fill="#1C1C1C"
                />
              </svg>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
