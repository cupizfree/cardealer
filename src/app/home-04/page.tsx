import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroBannerSlider from "@/components/home-04/HeroBannerSlider";
import BrandsSection from "@/components/home/BrandsSection";
import PopularSearchesPeekCarousel from "@/components/home-04/PopularSearchesPeekCarousel";
import BrowseByTypeGallery from "@/components/home-04/BrowseByTypeGallery";
import WhyChooseUsSection from "@/components/common/WhyChooseUsSection";
import FinancingCalculatorSection from "@/components/home/FinancingCalculatorSection";
import TrendingSearchesGridSection from "@/components/home-04/TrendingSearchesGridSection";
import WhyChooseUsCarousel from "@/components/home-02/WhyChooseUsCarousel";
import RelatedArticles from "@/components/blog-details/RelatedArticles";

export const metadata: Metadata = {
  title: "Beranda Varian 4",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/home-04.html (2719 lines). Header reuses `Header.tsx` (`style-1`) but with
// no `bg-white` — home-04's own header sits transparently over the page-title hero via
// `header-fixed-primary border-bottom border-color-blur` (confirmed via source diff, `bgClassName=""`
// prop).
//
// RETROACTIVE FIX, found via Playwright verification while building home-09.html: this header's real
// white nav/Sign-In/action-icon text/icons (added earlier as their own retroactive fix) were rendering
// invisibly — white-on-white — because the `.header-wrapper` div lacked the real `header-sticky`
// modifier home-04.html's own source carries (confirmed via source diff). Per `header.scss`,
// `.header-wrapper.header-sticky` is what actually gives this transparent header `position: fixed`,
// letting it overlay the hero; without it, the wrapper falls back to its own default in-flow
// `position: relative`, whose transparent background shows the page's plain white body behind the
// header instead of the hero. Fixed via `Header.tsx`'s new `wrapperExtraClassName` prop. (The separate
// scroll-driven show/hide behavior this class family also supports remains deferred, unrelated to this
// fix — see `Header.tsx`'s own top comment.)
//
// Hero is a genuinely new variant (`home-04/HeroBannerSlider.tsx`) — no search-filter bar at
// all, just a real 2-swiper synced background/content slider + spec badge row (see that file's own
// comment); other home variants sharing `page-title-style-1` (home-05/06/09/10/11.html) will reuse it
// once migrated. "Explore Our Brands" is byte-identical to `home/BrandsSection.tsx` — reused as-is
// (and its own real breakpoint/spaceBetween bug fixed retroactively, see COMPONENT_MAP.md). "Popular
// Searches" reuses `ListingCard` via a new peek-carousel component (`.swiper-card-5`'s real fractional
// `4.63` slidesPerView). "Cari Berdasarkan Tipe" is a genuinely new click-to-expand car-type gallery
// (`home-04/BrowseByTypeGallery.tsx`, real `hoverActiveGallery()` click handler). "Why Choose Us" reuses
// `common/WhyChooseUsSection` with its own `outline style2`/`gap-30` modifier combo (a 3rd real variant
// not covered by the light/dark binary split) and no animated counters (`<body>` lacks
// `counter-scroll`). "Simulasi Kredit" reuses `home/FinancingCalculatorSection` with its new
// `parallaxBackground` variant (real `simpleParallax` bg, no companion image). "Trending Searches Near
// You" is a genuinely new `.card-box-style-8` Grid-based section (`home-04/TrendingSearchesGridSection.tsx`,
// real 2-row grid via `.swiper-card-4`'s `slidesPerColumn: 2`). The 4 icon-box carousel + 2-column promo
// banner reuse `home-02/WhyChooseUsCarousel` (byte-identical cards, 4 distinct per-card hrefs via its new
// `hrefs` prop) — its own inner `SellBuyPromoBanner` needed home-04's own hrefs/CTA, so this page renders
// `SellBuyPromoBanner` directly instead with the right props (matching source's real per-page href
// differences, including a retroactively-fixed dead CTA link — see COMPONENT_MAP.md). "News & Reviews"
// reuses `blog-details/RelatedArticles` (`.post-style-2` shape) with its own post-7/8/9 image/category
// set via the new `slides` prop.
export default function Home04() {
  return (
    <>
      <Header
        activePath="/home-04"
        bgClassName=""
        modifierClassName="header-fixed-primary border-bottom border-color-blur"
        logoSrc="/assets/images/logo-white.png"
        actionIconStroke="white"
        signInButtonClassName="btn btn-line-white btn-large font-weight-600 bg-sign-in"
        navWrapperClassName="margin-right-auto"
        navListClassName="style-2"
        navChevronColor="white"
        wrapperExtraClassName="header-sticky"
        headerRightClassName="header-right-style-2"
        searchToggleClassName="relative header-action-btn"
      />

      <HeroBannerSlider />
      <BrandsSection />
      <PopularSearchesPeekCarousel />

      <section className="py-100 relative bg-primary">
        <div className="container relative">
          <div className="title-section mb-42 wow fadeInDown" data-wow-delay="0.1s">
            <h2 className="text-white text-center">Cari Berdasarkan Tipe</h2>
            <a
              href="/listing-grid4-columns"
              className="btn btn-blur font-weight-600 btn-large hover-fill-primary"
            >
              Lihat Semua Tipe
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM13.5672 10.4422L11.0672 12.9422C10.9499 13.0595 10.7909 13.1253 10.625 13.1253C10.4592 13.1253 10.3001 13.0595 10.1828 12.9422C10.0655 12.8249 9.99966 12.6659 9.99966 12.5C9.99966 12.3341 10.0655 12.1751 10.1828 12.0578L11.6164 10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H11.6164L10.1828 7.94219C10.0655 7.82491 9.99966 7.66585 9.99966 7.5C9.99966 7.33415 10.0655 7.17509 10.1828 7.05781C10.3001 6.94054 10.4592 6.87465 10.625 6.87465C10.7909 6.87465 10.9499 6.94054 11.0672 7.05781L13.5672 9.55781C13.6253 9.61586 13.6714 9.68479 13.7029 9.76066C13.7343 9.83654 13.7505 9.91787 13.7505 10C13.7505 10.0821 13.7343 10.1635 13.7029 10.2393C13.6714 10.3152 13.6253 10.3841 13.5672 10.4422Z"
                  fill="white"
                />
              </svg>
            </a>
          </div>
        </div>

        <BrowseByTypeGallery />
      </section>

      <WhyChooseUsSection
        variant="light"
        animateCounters={false}
        wrapperClassName="outline style2"
        statsGridModifierClass="gap-30"
      />
      <FinancingCalculatorSection variant="parallax" />
      <TrendingSearchesGridSection />

      <section className="py-100 bg-white">
        <WhyChooseUsCarousel
          bare
          promoBannerPosition="before"
          promoBannerProps={{
            leftTitleHref: "/listing-grid4-columns",
            rightTitleHref: "/sell-your-car",
            rightCtaHref: "/sell-your-car",
          }}
          hrefs={["/listing-grid4-columns", "/about-us", "/listing-grid4-columns", "/services-center"]}
        />
        <div className="tf-spacing" />
        <RelatedArticles
          bare
          viewAllHref="/blog-list"
          slides={[
            { image: "/assets/images/blog/post-7.jpg", category: "BERITA" },
            { image: "/assets/images/blog/post-8.jpg", category: "Ulasan Ahli" },
            { image: "/assets/images/blog/post-9.jpg", category: "BERITA" },
          ]}
        />
      </section>

      <Footer />
    </>
  );
}
