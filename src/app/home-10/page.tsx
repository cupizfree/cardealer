import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import BodyClass from "@/components/common/BodyClass";
import WrapperClass from "@/components/common/WrapperClass";
import HeroTextSlider from "@/components/home-10/HeroTextSlider";
import BrowseByTypePhotoCards from "@/components/home-03/BrowseByTypePhotoCards";
import BrandsSection from "@/components/home/BrandsSection";
import PopularSearchesTabGridSection from "@/components/home-10/PopularSearchesTabGridSection";
import CompareTopRatedSection from "@/components/home-02/CompareTopRatedSection";
import FinancingCalculatorSection from "@/components/home/FinancingCalculatorSection";
import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import WhyChooseUsCarousel from "@/components/home-02/WhyChooseUsCarousel";
import RelatedArticles from "@/components/blog-details/RelatedArticles";
import { emilyBenjaminOliviaTestimonials } from "@/data/clientTestimonials";

export const metadata: Metadata = {
  title: "Beranda Varian 10",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/home-10.html (4148 lines). `<body class="home-style-10 background-light">`,
// `<div id="wrapper" class="bg-white">`. This whole page uses `tf-spacing` divider divs between
// sections instead of section-level `py-100` padding (confirmed via source diff) — every reused
// section below is passed a plain `bg-white`/no-padding class accordingly, with explicit `tf-spacing`
// divs in between matching source exactly.
//
// RETROACTIVE FIX (found while auditing home-09.html's own analogous `home-style-9` body class, on
// request): `home-style-10` is a real, functional class too — `section.scss`: `padding: 0 180px`
// (horizontal-only, scaled down at narrower breakpoints via `reponsive.scss`) — never applied at all
// since Next.js's App Router renders one shared `<body>` for every route. Fixed the same way as
// home-09.html: the new `BodyClass` component (mounted below) imperatively adds/removes the class on
// `document.body` per-page.
//
// RETROACTIVE FIX (found on request, "check class wrapper home-10"): `<div id="wrapper" class=
// "bg-white">` is real too — home-10.html is the ONLY one of the 10 home variants with any class at all
// on `#wrapper` (every other page's is classless, confirmed via source diff) — but `layout.tsx` renders
// one shared, classless `#wrapper` div for every route, so this was never applied either. Matters beyond
// plain background color: `themes.scss`'s `.is_dark #wrapper.bg-white { background-color: transparent }`
// only fires when this class is actually present, letting `body.is_dark`'s own dark background show
// through instead of an opaque white block — without it, toggling `ThemeSwitcher`'s dark mode on
// `/home-10` never got this override. Fixed via a new `WrapperClass` component (same
// mount-effect/cleanup shape as `BodyClass`, targeting `#wrapper` instead of `<body>`).
//
// Header reuses `header/Header` (`variant="style-1"`, `bgClassName="bg-white"`) with its own real
// `header-absolute` modifier, `relative max-w-1440 px-15` container (not `max-w-1920`), plain `menu
// menu` nav list (no `style-2`), and its own distinct `header-right-style-3` modifier — exposed via the
// `containerClassName`/`navListClassName`/`headerRightClassName` props (the last one new this session).
//
// RETROACTIVE FIX — `.header-right` was missing a real `header-right-style-2` modifier on the
// already-shipped home-04.html (confirmed via source diff) — `Header.tsx` never rendered any
// `.header-right` modifier at all. Fixed via the new `headerRightClassName` prop; home-04's own
// `page.tsx` now passes it explicitly.
//
// home-10.html's own header has NO `.header-wrapper` div at all (confirmed via source diff — the
// `<header>` is a direct child of `#wrapper`, same as home-09.html's own `header-absolute` reuse) —
// `noWrapper` reused here too.
//
// RETROACTIVE FIX (×3, found on request, "check header layout home-10"):
// - **`header-style-1` was silently overriding this page's own container padding**: `Header.tsx` always
//   appended `header-${variant}` (`header-style-1` by default) unconditionally, but home-10.html's own
//   real `<header>` has NO style-N class at all (confirmed via source diff — the only page missing it).
//   Not cosmetic: `header.scss`'s `.header-style-1 .header-container-fluid { padding: 0 40px }` is a
//   2-class compound selector, higher specificity than the single-class `.px-15` utility this page's own
//   `containerClassName` relies on — so the stray class was silently forcing the wrong `0 40px` padding
//   regardless of `px-15`. Fixed via the new `omitVariantClass` prop.
// - **Missing `navWrapperClassName`**: home-10.html's own real `<nav>` is `main-nav margin-right-auto`
//   (confirmed via source diff) — this page's own `page.tsx` never passed this prop at all, silently
//   falling back to `Nav.tsx`'s own `mr-18` default (correct only for index.html). Fixed by passing it
//   explicitly.
// - **Wrong header-button gap + missing `relative` on the search toggle**: the Sign In/Add Listing
//   button row always hardcoded `gap-20` — home-10.html's own real gap is `gap-10` (confirmed via source
//   diff, the only page with this value). The search-toggle `<span>` always hardcoded plain
//   `header-action-btn` — home-04/09/10.html's own real class is `relative header-action-btn` (all 3
//   confirmed via source diff; home-04/09's own `page.tsx` now also pass this explicitly). Fixed via the
//   new `headerButtonGapClassName`/`searchToggleClassName` props.
//
// Hero (`home-10/HeroTextSlider.tsx`) is a genuinely new shape — a single swiper bundling background +
// text/CTA overlay per slide (see that file's own comment).
//
// "Cari Berdasarkan Tipe" reuses `home-03/BrowseByTypePhotoCards` byte-for-byte (same 8-type dataset) via its
// new `sectionClassName="bg-white"` prop (no `py-100`).
//
// "Explore Our Brands" reuses `home/BrandsSection`'s exact same 6-brand dataset byte-for-byte via 3 new
// props (`sectionClassName="bg-white"`, `titleSectionClassName="mb-42"`, `cardClassName="out-brand-2"`
// — not `out-brand`).
//
// RETROACTIVE FIX — the "Lihat Semua Merek" button on `BrandsSection` was missing its real icon (a
// circular-arrow SVG, confirmed present in index.html's own source) — added back as the default.
//
// "Pencarian populer" (`home-10/PopularSearchesTabGridSection.tsx`) is a genuinely 3rd distinct "Popular
// Searches" shape on the site — a real per-tab static grid (not a swiper carousel like every other
// variant) — see that file's own comment.
//
// "Bandingkan Unit Terbaik" reuses `home-02/CompareTopRatedSection` with the same
// `card-box-style-7 style3`/`content style-2`/`<br>`-title pairs as home-09.html's own reuse, but its
// own `bg-white` section (no `py-100`) and `mb-14` title-section (not `mb-12`).
//
// "Simulasi Kredit" reuses `home/FinancingCalculatorSection`'s `"outline"` variant with its own
// `bg-white` section (no `py-100`) and `max-w-628 ml-60` companion image (not `...move3` like
// home-08/09's own reuse) — otherwise the same `mb-20`/`mb-8`/`mb-4` label overrides.
//
// "Ulasan Pelanggan" reuses `common/ClientsReviewsCarousel` with the shared
// `emilyBenjaminOliviaTestimonials` dataset, real `cardHref="/clients-reviews"` links, its own plain
// `.swiper-testimonior` config (the base config, not home-09's own `-2` variant), and a `bg-white`
// section (no `py-100`).
//
// "Semua Mobil" is the same real 3-in-one-section composition already established for home-04.html: the 4
// icon-box carousel (`home-02/WhyChooseUsCarousel`, all-same `/listing-grid4-columns` hrefs — the
// component's own default) + its promo banner (`rightCtaHref="/sell-your-car"`, the only override
// needed — `leftTitleHref`/`rightTitleHref` already default to this page's own real values) +
// `blog-details/RelatedArticles` (byte-identical default `post-4/5/6.jpg` slides) — all sharing ONE
// `bg-white` `<section>` via `bare` on both, with `tf-spacing` divs between (confirmed via source diff).
//
// Footer reused as-is.
export default function Home10() {
  return (
    <>
      <BodyClass className="home-style-10 background-light" />
      <WrapperClass className="bg-white" />
      <Header
        activePath="/home-10"
        bgClassName="bg-white"
        modifierClassName="header-absolute"
        containerClassName="relative max-w-1440 px-15"
        navWrapperClassName="margin-right-auto"
        navListClassName=""
        headerRightClassName="header-right-style-3"
        omitVariantClass
        headerButtonGapClassName="gap-10"
        searchToggleClassName="relative header-action-btn"
        noWrapper
      />

      <HeroTextSlider />

      <div className="tf-spacing" />

      <BrowseByTypePhotoCards sectionClassName="bg-white" />

      <div className="tf-spacing" />

      <BrandsSection sectionClassName="bg-white" titleSectionClassName="mb-42" cardClassName="out-brand-2" />

      <div className="tf-spacing" />

      <PopularSearchesTabGridSection />

      <div className="tf-spacing" />

      <CompareTopRatedSection
        cardClassName="card-box-style-7 style3"
        titleClassName="card-box-style-7--title h7 mb-4"
        swiperClassName="swiper-card-3"
        paginationClass="pagination-swiper-card-3"
        sectionClassName="bg-white"
        titleSectionClassName="mb-14 wow fadeInDown"
        contentClassName="style-2"
        breakpoints={{
          767: { slidesPerView: 2, slidesPerGroup: 2 },
          1199: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
        pairs={[
          {
            images: ["/assets/images/card/card-21.png", "/assets/images/card/card-22.png"],
            left: { brand: "TESLA", title: "2024 Tesla Model Y", price: "$44.900,00" },
            right: {
              brand: "TESLA",
              title: (
                <>
                  2024 Ford Mustang <br className="lg-hidden" /> Toyota Avanza
                </>
              ),
              price: "$42.900,00",
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
              price: "$44.900,00",
            },
            right: {
              brand: "Camry",
              title: (
                <>
                  2022 Toyota 4Runner <br className="lg-hidden" /> Terbatas
                </>
              ),
              price: "$42.900,00",
            },
          },
          {
            images: ["/assets/images/card/card-35.png", "/assets/images/card/card-36.png"],
            left: { brand: "Honda", title: "2022 Porsche 911 Carrera", price: "$44.900,00" },
            right: {
              brand: "Camry",
              title: (
                <>
                  2022 Ford Mustang GT <br className="lg-hidden" /> Premium
                </>
              ),
              price: "$42.900,00",
            },
          },
        ]}
      />

      <div className="tf-spacing" />

      <FinancingCalculatorSection
        variant="outline"
        outlineSectionClassName="bg-white"
        outlineHeadingClassName="mb-20"
        outlinePriceRateLabelClassName="mb-8"
        outlineResultLabelClassName="mb-4"
        outlineImageClassName="max-w-628 ml-60"
      />

      <div className="tf-spacing" />

      <ClientsReviewsCarousel
        testimonials={emilyBenjaminOliviaTestimonials}
        starIcon="star.svg"
        cardHref="/clients-reviews"
        sectionClassName="bg-white"
      />

      <div className="tf-spacing" />

      <section className="bg-white">
        <WhyChooseUsCarousel bare promoBannerProps={{ rightCtaHref: "/sell-your-car" }} />
        <div className="tf-spacing" />
        <RelatedArticles bare viewAllHref="/blog-list" />
      </section>

      <div className="tf-spacing" />

      <Footer />
    </>
  );
}
