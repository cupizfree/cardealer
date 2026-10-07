import type { Metadata } from "next";
import HeaderStyle4 from "@/components/header/HeaderStyle4";
import Footer from "@/components/footer/Footer";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import WhyChooseUsCarousel from "@/components/home-02/WhyChooseUsCarousel";
import PopularSearchesGridSection from "@/components/home-07/PopularSearchesGridSection";
import BrowseByTypePillsSection from "@/components/home-07/BrowseByTypePillsSection";
import LatestForSaleSection from "@/components/home-07/LatestForSaleSection";
import WhyChooseUsSection from "@/components/common/WhyChooseUsSection";
import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import DownloadAppCtaSection from "@/components/home-07/DownloadAppCtaSection";
import { emilyBenjaminOliviaTestimonials } from "@/data/clientTestimonials";

export const metadata: Metadata = {
  title: "Beranda Varian 7",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/home-07.html (5215 lines, the largest home variant). Header reuses
// `header/HeaderStyle4` with the same `bg-white` skin as home-06.html (dark logo, dark nav chevrons/
// action icons, `btn-primary` Add Listing button, white icon) but its own distinct wrapper/container
// classes (`header-wrapper-style-6`, `max-w-1920 header-spacing` top bar/main container — matching
// home-05's own values, NOT home-06's `max-w-1440 px-15` — and a THIRD distinct nav wrapper value,
// `mr-20`, confirmed via source diff against home-05's `margin-right-auto` and home-06's `mr-50`).
// `<body class="home-06">` is a real, disclosed leftover copy-paste class from home-06.html (harmless —
// body classes aren't used for anything functional besides `counter-scroll` detection, which this page
// also lacks, same as home-06).
//
// Hero (`.page-title-style-5.background-blue`) reuses `home/HeroSearchSection` via 6 new props: this is
// genuinely the ONLY page-title hero on the site with NO swiper background slider at all (`showSlider=
// false` — no `.page-title--slider` wrapper, no nav arrows, no bullet pagination in source, confirmed
// via grep), showing one static `.page-title--image` below the filter bar instead (`staticImageSrc`). No
// `.category-list` either (`showCategoryList=false`). Its own `<h2>` (not `<h1>` like every other
// page-title hero) with extra `text-primary letter-normal` classes is a real, disclosed heading-level
// inconsistency (`titleTag="h2"`, `titleExtraClassName`). `titleCentered=true` reproduces its own real
// `text-center`/`margin-auto` tab-bar centering, but — retroactive fix discovered here — home-02.html's
// own "Toggle advanced filters" button couples a `style2` modifier to that same centering that home-07's
// own version does NOT have (confirmed via source diff); now split into its own independent
// `filterButtonStyle2={false}` prop so home-02's existing behavior stays unchanged.
//
// RETROACTIVE FIX (found while investigating a user report that this page's layout was significantly
// wrong): `HeroSearchSection` always hardcoded a `flex` class on the root `.page-title` section, but
// home-07.html's own real source (`page-title-style-5`) has NO `flex` class at all (confirmed via
// source diff against every other page-title hero, which all genuinely do carry it) — `page-title-
// style-5`'s own SCSS is a plain padded block layout, not a flex-centered hero, so the stray `flex` was
// laying out `.search-cars` and the static-image `.container` as flex ROW siblings instead of normal
// stacked blocks. Fixed via the new `showFlex={false}` prop. The paired `.search-cars` div also always
// hardcoded `margin-top-auto margin-bottom-auto` (a vertical-centering trick meaningless without a flex
// parent) — home-07.html's own is plain `search-cars container` (confirmed via source diff), fixed via
// the new `searchCarsClassName=""` prop (home-09.html was found to have its own distinct value here too
// while auditing this — see that page's own comment). Also added the new `showMobileSpacer` prop for a
// real, home-07-only `<div class="tf-spacing-style2 lg-hidden">` after the hero section (confirmed via
// source diff — no other `HeroSearchSection` caller has it).
//
// RETROACTIVE FIX (found on request, "check the tab color"): the "Semua Mobil"/"Mobil Baru"/"Mobil Bekas" tab
// labels always hardcoded `text-white`, but home-07.html's own real source uses `text-primary` (dark) on
// these specific spans (confirmed via source diff — every other caller genuinely is `text-white`) —
// because this page's hero sits on a pale `background-blue` (`#D8E2EA`), not a photo/dark background, so
// white text there would render almost invisibly. Fixed via the new `tabTextColorClass="text-primary"`
// prop.
//
// "Wide Vehicle Selection" reuses `home-02/WhyChooseUsCarousel`'s exact same 4 icon/title/description
// cards (byte-identical via source diff) via its 2 new props: `showPromoBanner={false}` (no promo
// banner at all here, confirmed via source diff) and `containerClassName="container pb-100"` (this
// reuse has no `<section>` wrapper at all in source — just a standalone `.container.pb-100` div — via
// `bare`). Each card's own href genuinely differs per-page here (`/listing-grid4-columns`, `/about-us`,
// a literal dead `#`, `/services-center` — confirmed via source diff), unlike home-02's/home-04's own
// all-same-href callers.
//
// "Pencarian populer" (`home-07/PopularSearchesGridSection.tsx`) is a genuinely new, different DOM from
// every other "Pencarian Populer" section: a REAL per-tab static grid of `.card-box-style-1` cards (not a
// swiper) — same shape as home-10.html's own "Pencarian populer". RETROACTIVE FIX (found while
// investigating the same user layout report above): this component's own earlier claim that the 7
// car-type tab pills were "purely decorative" over one static 29-card grid was wrong — a re-grep found 7
// distinct `.content-inner` blocks (one per tab, 3/8/4/2/4/4/4 cards = 29 total), meaning the real page
// shows only the active tab's small grid, not all 29 cards at once. Fixed to real tab-switching,
// matching `home-10/PopularSearchesTabGridSection.tsx`'s pattern — see that component's own comment.
// "Cari Berdasarkan Tipe"
// (`home-07/BrowseByTypePillsSection.tsx`) is a genuinely new static pill list over a real
// `simpleParallax` background (`bg-fixed.jpg`, same mechanism as `common/ParallaxImage.tsx` — explicitly
// listed as a home-07.html reuse target in that file's own header comment) with one repeated icon for
// all 15 types (a real, disclosed simplification, confirmed via source read).
//
// "Terbaru Dijual" (`home-07/LatestForSaleSection.tsx`) reuses `listing/HalfMapListingCard` (the
// `.card-box-style-9` "list view" shape) for its 4-card `col-lg-8` list, and `common/
// SellBuyPromoBanner`'s new `layout="stack"` variant for its `col-lg-4` sidebar (same 2 cards/hrefs as
// home-03/04's own calls, just stacked vertically instead of side-by-side — confirmed via source diff).
// "Why Choose Us" reuses `common/WhyChooseUsSection`'s `variant="light"` default with its own 4th
// distinct `wrapperClassName` combo (`"style2"` alone — neither the light default's `"style2 style3"`
// nor home-04's `"outline style2"`) and home-04's own `statsGridModifierClass="gap-30"` (confirmed via
// source diff). "Ulasan Pelanggan" reuses `common/ClientsReviewsCarousel` with the same shared
// `emilyBenjaminOliviaTestimonials` dataset as home-05/06, real `cardHref="/clients-reviews"` links (same
// as home-03's own), and its new `sectionClassName` prop — retroactive fix: this section's own
// background genuinely varies per page (home-05: `background-light py-100`, home-06/07: `bg-white
// py-100`) but every existing caller was hardcoded to plain `py-100`, silently dropping it on home-05/06
// too; both now pass their own real class explicitly. Its `children` slot renders
// `home-07/DownloadAppCtaSection.tsx` (a genuinely new "Find Your Perfect Used Car" CTA banner shape —
// see that file's own comment) inside the same shared section, matching source's real single-section
// wrap. Footer reused as-is. No Financing Calculator or News & Reviews section on this page at all
// (confirmed absent from source via full section-boundary scan) — a real, disclosed omission, not a
// migration gap.
export default function Home07() {
  return (
    <>
      <HeaderStyle4
        activePath="/home-07"
        bgClassName="bg-white"
        wrapperClassName="header-wrapper-style-6"
        topBarContainerClassName="max-w-1920 header-spacing md-w-full md-min-w-full"
        dividerClassName="divider-vertical h-24 md-hidden"
        mainContainerClassName="relative max-w-1920 header-spacing"
        logoSrc="/assets/images/logo.png"
        topLevelChevronColor="#9FA1A4"
        actionIconStroke="#1C1C1C"
        navListClassName=""
        navWrapperClassName="mr-20"
      />

      <HeroSearchSection
        title="Cari Mobil di Sekitar Anda – Beli Hari Ini!"
        titleCentered
        titleTag="h2"
        titleExtraClassName="text-primary letter-normal"
        filterButtonStyle2={false}
        sectionModifierClass="page-title-style-5 height-658 background-blue"
        heightClass=""
        showFlex={false}
        searchCarsClassName=""
        showSlider={false}
        staticImageSrc="/assets/images/page-title/page-title-7.png"
        showCategoryList={false}
        showMobileSpacer
      />

      <WhyChooseUsCarousel
        bare
        showPromoBanner={false}
        containerClassName="container pb-100"
        hrefs={["/listing-grid4-columns", "/about-us", "#", "/services-center"]}
      />

      <PopularSearchesGridSection />
      <BrowseByTypePillsSection />
      <LatestForSaleSection />

      <WhyChooseUsSection wrapperClassName="style2" statsGridModifierClass="gap-30" />

      <ClientsReviewsCarousel
        testimonials={emilyBenjaminOliviaTestimonials}
        starIcon="star.svg"
        cardHref="/clients-reviews"
        sectionClassName="bg-white py-100"
      >
        <DownloadAppCtaSection />
      </ClientsReviewsCarousel>

      <Footer />
    </>
  );
}
