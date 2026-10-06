import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BodyClass from "@/components/common/BodyClass";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import BrowseByTypePhotoCards from "@/components/home-03/BrowseByTypePhotoCards";
import PopularSearchesSection from "@/components/home-02/PopularSearchesSection";
import BrandsGridCarousel from "@/components/home-05/BrandsGridCarousel";
import WhyChooseUsSection from "@/components/common/WhyChooseUsSection";
import CompareTopRatedSection from "@/components/home-02/CompareTopRatedSection";
import TrendingSearchesSection from "@/components/home/TrendingSearchesSection";
import FinancingCalculatorSection from "@/components/home/FinancingCalculatorSection";
import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import DownloadAppCtaSection from "@/components/home-07/DownloadAppCtaSection";
import { home09ClientTestimonials } from "@/data/clientTestimonials";
import { muatKatalog } from "@/lib/katalog";

export const metadata: Metadata = {
  title: "Beranda Varian 9",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Unit populer diambil dari katalog hidup (basis data yang ditulis panel), bukan
// dari data statis. Empat slide pertama dipakai; urutan sumber (1,2,3,2,2)
// dipertahankan apa adanya.
const populer = muatKatalog().slice(0, 4);

// Migrated from ../aurexo/home-09.html (4582 lines). `<body class="home-style-9">` — a real, distinct
// page-wide `radius-40` (rounded corners) visual signature carried by nearly every section on this
// page, exposed via small per-component modifier props rather than a global CSS override.
//
// RETROACTIVE FIX (found on request, "check home-09 body class / page title"): `home-style-9` isn't just
// a `radius-40` marker — it's a real, functional class with its own CSS (`section.scss`:
// `padding: 40px`, scaled down to `20px`/smaller at narrower breakpoints via `reponsive.scss`; also
// `header.scss`'s `.home-style-9 .header.is-custom { background-color: $color-primary }`, relevant now
// that `useHeaderScrollFixed` drives `is-custom`). This padding was never applied at all in the port
// (Next.js's App Router renders one shared `<body>` for every route in `layout.tsx`, so no page-specific
// class was ever set) — verified by serving the raw, unmodified `../aurexo/home-09.html` locally: the
// header, hero, and `#wrapper` are ALL inset together by the same amount (the absolute header positions
// relative to `#wrapper`, which already has real `position: relative` in the ported `reset.scss`, so it
// inherits body's padding inset automatically), producing a "framed" look with a visible margin on every
// edge — completely absent without this class. Fixed via the new `BodyClass` component (mounted below),
// which imperatively adds/removes the class on `document.body` per-page (the only way to vary `<body>`
// per route in the App Router) — home-10.html's own analogous `home-style-10 background-light` class
// (`padding: 0 180px`) was found to have the exact same gap while investigating this and fixed the same
// way in that page's own `page.tsx`.
//
// Header reuses `header/Header` (`variant="style-1"`) with the SAME transparent/`header-fixed-primary`
// treatment as home-04.html, plus its own real `header-absolute` modifier and `max-w-1840` container
// (not `max-w-1920`, confirmed via source diff) — exposed via the newly-added `containerClassName` prop.
//
// RETROACTIVE FIX — 3 real header bugs on the already-shipped home-04.html, found while building these
// overrides: (1) `Header.tsx` always hardcoded the dark `logo.png`, but home-04.html's own real source
// has a WHITE logo (`logo-white.png`, confirmed via source diff) — invisible against its own dark
// transparent hero. (2) `Header.tsx` always called `SignInIcon`/`SearchIcon`/`CompareIcon`/
// `WishlistIcon`/`AddListingIcon` with no color override, so home-04.html's own real WHITE action icons
// (and its real DARK Add Listing icon, since its Add Listing button is `btn-white` not `btn-primary`)
// rendered with the wrong color — same class of bug already found and fixed on `HeaderStyle4`'s own
// home-05.html reuse. (3) `Header.tsx` always called `Nav` with no props, silently using `Nav.tsx`'s own
// defaults (`mr-18`/no `listClassName`/`#9FA1A4` chevrons) even though home-04.html's own real source is
// `margin-right-auto`/`menu menu style-2`/white chevrons (confirmed via source diff). All 3 fixed via 6
// new props (`logoSrc`, `actionIconStroke`, `addListingIconColor`, `signInButtonClassName`,
// `addListingButtonClassName`, `navWrapperClassName`/`navListClassName`/`navChevronColor`), each
// defaulting to the pre-existing value so index.html's own usage is unaffected; home-04.html's own
// `page.tsx` now passes every one of these explicitly.
//
// BUG CAUGHT BY PLAYWRIGHT VERIFICATION — `.header-wrapper` defeats `header-absolute`'s transparent
// overlay: `header.scss:9-13` gives `.header-wrapper` an unconditional `height: 94px; position:
// relative`, which reserves 94px of document flow regardless of the inner `<header>`'s own `position:
// absolute` — pushing the hero down by 94px instead of letting the header float over it. home-09.html's
// own real source has NO `.header-wrapper` div at all for its `header-absolute` header (confirmed via
// source diff — the `<header>` is a direct child of `#wrapper`), unlike index.html's/home-04.html's own
// `header-wrapper`-wrapped headers (home-04.html's own real wrapper also carries a `header-sticky`
// modifier — not added here since sticky-on-scroll is a separate, still-deferred feature site-wide, per
// `Header.tsx`'s own existing top comment). Fixed by adding a new `noWrapper` prop to `Header.tsx` that
// omits the wrapper div entirely; home-09 passes it, home-04/index.html are unaffected (default `false`).
//
// Hero — extended `home/HeroSearchSection` with `sliderExtraClassName="radius-40"` (its own
// `.page-title--slider` carries the page-wide rounded-corner signature) and its own real banner order
// (`banner-9,1,2,3,5` — `banner-9.jpg` is a real, page-specific image not used elsewhere).
//
// RETROACTIVE FIX (found while auditing this shared component for a home-07 layout bug report): the
// `.search-cars` div's own real class here is `margin-top-auto wow fadeInUp` with `data-wow-delay="0.1s"`
// (confirmed via source diff) — NOT the component's own hardcoded `margin-top-auto margin-bottom-auto`
// (correct only for index/home-02/03.html). Fixed via the new `searchCarsClassName`/`searchCarsWowDelay`
// props.
//
// RETROACTIVE FIX (found on request, "check home-09 body class / page title"): the title/tab-bar/filters
// row inside the hero always hardcoded their own `wow fadeInUp` + staggered `data-wow-delay`
// (index.html's own `0.1s`/`0.3s`/`0.5s` sequence), but home-09.html's own real source has NO `wow`
// animation on any of these 3 inner elements at all (confirmed via source diff) — only the outer
// `.search-cars` wrapper itself animates as one block (already fixed above). Fixed via
// `titleWowDelay`/`tabsWowDelay`/`filtersWowDelay={null}`.
//
// "Cari Berdasarkan Tipe" reuses `home-03/BrowseByTypePhotoCards` byte-for-byte (same 8-type dataset) via its
// new `titleSectionClassName` prop (`mb-28 wow fadeInDown`, not `mb-30 wow fadeInUp`).
//
// "Mobil Baru" reuses `home-02/PopularSearchesSection`'s exact same 7-tab shape (same dark tab-bar
// icons) via new `heading`/`sectionClassName`/`tabs`/`showPagination` props — 6 of 7 tabs' ids are
// byte-identical to home-02's own defaults; only "Sedan" differs (`[1,2,3,4]`, not `[1,2,3,4,1,2]`),
// and this reuse has NO bullet pagination at all (confirmed via grep).
//
// "Explore Our Brands" reuses `home-05/BrandsGridCarousel` byte-for-byte, zero new props (same 12-brand
// `.swiper-outbrand-3` dataset, confirmed via source diff).
//
// "Why Choose Us" reuses `common/WhyChooseUsSection`'s `variant="light"` default with its own 5th
// distinct `wrapperClassName` (`"style2"` alone) + `statsGridModifierClass` (`"gap-30 counter-spacing"`,
// neither the light default's `gap-130 counter-spacing` nor home-04's own plain `gap-30`) + new
// `headingClassName="mb-15"` + `sectionExtraClassName="radius-40"` props.
//
// "Bandingkan Unit Terbaik" reuses `home-02/CompareTopRatedSection` with all 3 new props this
// migration added (`sectionClassName="bg-white py-100"`, `titleSectionClassName`, `contentClassName=
// "style-2"`) plus its own real `card-box-style-7 style3` card class (not `style2` like every other
// reuse) and `<br>`-containing titles for pairs 2/3 (confirmed via source diff — `title` is now
// `React.ReactNode`, not `string`).
//
// "Pencarian populer di sekitar Anda" reuses `home/TrendingSearchesSection` (index.html's own "Trending
// Searches Near You" widget) with its own 5-slide sequence (l13, l14, l15, l14, l14 — no 4th
// content-mismatch slide here), lowercase heading, `radius-40` section modifier, and `mb-14` card
// dividers (not `mb-16`) via the 4 new props this migration added.
//
// "Simulasi Kredit" reuses `home/FinancingCalculatorSection`'s `"outline"` variant with the SAME
// override values as home-08.html's own call (`bg-white py-100`/`mb-20`/`mb-8`/`mb-4`) plus a new 5th
// override, `outlineImageClassName="max-w-628 ml-60 move3"` — a THIRD distinct companion-image
// animation-class variant (confirmed via source diff).
//
// "Ulasan Pelanggan" reuses `common/ClientsReviewsCarousel` with `cardHref="/clients-reviews"` and its
// own real `.swiper-testimonior-2` config via the props this migration added. (Source's own slide 3 is a
// plain, non-linked div while the other 4 are real links — a real, disclosed per-card inconsistency
// treated as decorative demo noise and not reproduced at the link level, consistent with this
// migration's other such calls.)
//
// RETROACTIVE FIX (×2, found on request, "check testimonials of home-09"):
// - **Wrong breakpoints**: the comment above already claimed this section's `.swiper-testimonior-2`
//   config "never reaches 3 [columns] like the base config", but the actual call never passed a
//   `breakpoints` override at all — silently falling back to the component's own default (`0/767/991` →
//   1/2/3 columns), which DOES reach 3 at ≥991px. Real config (`assets/js/swiper.js`): `0`/`400`/`767` →
//   1/1/2, no 991 breakpoint at all. Fixed by passing the real `breakpoints` explicitly.
// - **Wrong dataset**: this page was reusing the shared `emilyBenjaminOliviaTestimonials` array
//   (home-05/06/07.html's own 3-testimonial-repeated-to-6-slides dataset) directly — but home-09.html's
//   own real source has only 5 slides (not 6), and its own 3rd slide (Olivia Williams) has a real,
//   disclosed content bug: it pairs Olivia's name/avatar with EMILY's quote text, not Olivia's own
//   distinct quote every other page uses (confirmed via source diff). Fixed via a new
//   `home09ClientTestimonials` export in `data/clientTestimonials.ts` that reproduces this page's own
//   real 5-slide sequence and content bug verbatim, rather than silently correcting it.
//
// "Find Your Perfect Used Car" reuses `home-07/DownloadAppCtaSection` via its new `variant="style-2"`
// (a real `.cta-section.style-2`/`image-effect-scale` modifier combo, not `.background-be`) and
// `standalone` (this reuse is its own `py-100 bg-white` section, not nested inside "Ulasan Pelanggan"
// like home-07's own usage — confirmed via source diff).
//
// Footer reuses `footer/Footer` with its new `extraClassName="radius-40"` prop.
export default function Home09() {
  return (
    <>
      <BodyClass className="home-style-9" />
      <Header
        activePath="/home-09"
        bgClassName=""
        modifierClassName="header-absolute header-fixed-primary border-bottom border-color-blur"
        logoSrc="/assets/images/logo-white.png"
        containerClassName="max-w-1840 relative"
        actionIconStroke="white"
        addListingIconColor="#1C1C1C"
        signInButtonClassName="btn btn-line-white btn-large font-weight-600 bg-sign-in"
        addListingButtonClassName="btn btn-white btn-large font-weight-600"
        navWrapperClassName="margin-right-auto"
        navListClassName="style-2"
        navChevronColor="white"
        searchToggleClassName="relative header-action-btn"
        noWrapper
      />

      <HeroSearchSection
        sectionModifierClass="page-title-style-7 height-840 radius-40 effect-content-slide effect-2 overflow-hidden"
        heightClass=""
        sliderExtraClassName="radius-40"
        bannerOrder={["banner-9.jpg", "banner-1.jpg", "banner-2.jpg", "banner-3.jpg", "banner-5.jpg"]}
        showCategoryList={false}
        searchCarsClassName="margin-top-auto wow fadeInUp"
        searchCarsWowDelay="0.1s"
        titleWowDelay={null}
        tabsWowDelay={null}
        filtersWowDelay={null}
      />

      <BrowseByTypePhotoCards titleSectionClassName="mb-28 wow fadeInDown" />

      <PopularSearchesSection
        heading="Mobil Baru"
        sectionClassName="py-100 flat-tabs background-light radius-40"
        showPagination={false}
        tabs={[
          { label: "Listrik", ids: [2, 3, 4] },
          { label: "Sedan", ids: [1, 2, 3, 4] },
          { label: "SUV", ids: [1, 2] },
          { label: "Pikap", ids: [2, 3, 4] },
          { label: "Mewah", ids: [2, 3, 4] },
          { label: "Hatchback", ids: [1, 2] },
          { label: "Crossover", ids: [2, 3, 4] },
        ]}
      />

      <BrandsGridCarousel />

      <WhyChooseUsSection
        wrapperClassName="style2"
        statsGridModifierClass="gap-30 counter-spacing"
        headingClassName="mb-15"
        sectionExtraClassName="radius-40"
      />

      <CompareTopRatedSection
        cardClassName="card-box-style-7 style3"
        titleClassName="card-box-style-7--title h7 mb-4"
        swiperClassName="swiper-card-3"
        paginationClass="pagination-swiper-card-3"
        sectionClassName="bg-white py-100"
        titleSectionClassName="mb-12 wow fadeInDown"
        contentClassName="style-2"
        breakpoints={{
          767: { slidesPerView: 2, slidesPerGroup: 2 },
          1199: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
        pairs={[
          {
            images: ["/assets/images/card/card-21.png", "/assets/images/card/card-22.png"],
            left: { brand: "TESLA", title: "2024 Tesla Model Y", price: "Rp 674.000.000" },
            right: {
              brand: "TESLA",
              title: (
                <>
                  2024 Ford Mustang <br className="lg-hidden" /> Toyota Avanza
                </>
              ),
              price: "Rp 644.000.000",
            },
          },
          {
            images: ["/assets/images/card/card-23.png", "/assets/images/card/card-24.png"],
            left: {
              brand: "Honda",
              title: (
                <>
                  2022 Jeep Grand <br className="lg-hidden" /> Toyota Fortuner VRZ
                </>
              ),
              price: "Rp 674.000.000",
            },
            right: {
              brand: "Camry",
              title: (
                <>
                  2022 Toyota 4Runner <br className="lg-hidden" /> Terbatas
                </>
              ),
              price: "Rp 644.000.000",
            },
          },
          {
            images: ["/assets/images/card/card-35.png", "/assets/images/card/card-36.png"],
            left: { brand: "Honda", title: "2022 Porsche 911 Carrera", price: "Rp 674.000.000" },
            right: {
              brand: "Camry",
              title: (
                <>
                  2022 Ford Mustang GT <br className="lg-hidden" /> Premium
                </>
              ),
              price: "Rp 644.000.000",
            },
          },
        ]}
      />

      <TrendingSearchesSection
        heading="Pencarian populer di sekitar Anda"
        slides={[populer[0], populer[1], populer[2], populer[1], populer[1]].filter(Boolean)}
        sectionExtraClassName="radius-40"
        cardDividerClassName="divider-blur mb-14"
      />

      <FinancingCalculatorSection
        variant="outline"
        outlineSectionClassName="bg-white py-100"
        outlineHeadingClassName="mb-20"
        outlinePriceRateLabelClassName="mb-8"
        outlineResultLabelClassName="mb-4"
        outlineImageClassName="max-w-628 ml-60 move3"
      />

      <ClientsReviewsCarousel
        testimonials={home09ClientTestimonials}
        starIcon="star.svg"
        cardHref="/clients-reviews"
        sectionClassName="py-100 background-light radius-40"
        swiperClassName="swiper-testimonior-2"
        paginationClass="pagination-swiper-testimonior-2"
        loop
        breakpoints={{ 0: { slidesPerView: 1, slidesPerGroup: 1 }, 767: { slidesPerView: 2, slidesPerGroup: 2 } }}
      />

      <DownloadAppCtaSection variant="style-2" standalone />

      <Footer extraClassName="radius-40" />
    </>
  );
}
