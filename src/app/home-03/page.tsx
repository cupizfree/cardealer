import type { Metadata } from "next";
import HeaderStyle2 from "@/components/header/HeaderStyle2";
import Footer from "@/components/footer/Footer";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import BrandsSection from "@/components/home/BrandsSection";
import PopularSearchesCarousel from "@/components/home-03/PopularSearchesCarousel";
import BrowseByTypePhotoCards from "@/components/home-03/BrowseByTypePhotoCards";
import TrendingSearchesGrid from "@/components/home-03/TrendingSearchesGrid";
import ClientsReviewsSection from "@/components/home-03/ClientsReviewsSection";
import WhyChooseUsSection from "@/components/common/WhyChooseUsSection";
import CompareTopRatedSection from "@/components/home-02/CompareTopRatedSection";

export const metadata: Metadata = {
  title: "Aurexo | Car Dealer, Rental & Listing",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/home-03.html (3174 lines). Reuses `HeaderStyle2` with home-03's own real
// differences exposed as props (light top bar, no search bar, plain `.container` middle row,
// `.effect-svg-hover` social icons, `header-style-3` modifier, its own "View on map" `tel:` bug — see
// `HeaderStyle2.tsx`'s own header comment). Popular Searches here is untabbed (unlike home-02.html's
// 7-tab version); Browse By Type is a 3rd distinct photo-card variant; "Why Choose Us" reuses the same
// content as about-us.html's own but on a dark background with REAL animated counters (this page's own
// `<body class="counter-scroll ...">`, confirmed via source read, makes `app.js`'s `flatCounter()`
// genuinely fire here — about-us.html's body lacks that class, so its own numbers stay static); "Compare
// Top Rated Vehicles" reuses home-02.html's own component with a 3rd pair and its own class names;
// "Trending Searches Near You" and "Clients Reviews" both introduce genuinely new per-page data (see
// their own components' header comments for the full source-evidence trail). "Explore Our Brands" is
// content-identical to index.html's own (`BrandsSection`, minor `data-wow-delay`/spacing-class
// differences accepted as-is, same precedent as other pages' minor per-page CSS drift).
export default function Home03Page() {
  return (
    <>
      <HeaderStyle2
        activePath="/home-03"
        extraModifierClass="header-style-3"
        wrapperClassName="header-wrapper-style-3"
        topBarVariant="light"
        showSearchBar={false}
        middleRowContainerFluid={false}
        socialHoverClass="effect-svg-hover"
        viewOnMapHref="tel:1-222-6666-8888"
      />

      <HeroSearchSection
        title={
          <>
            Browse, Compare, Drive <br /> Find Your Car!
          </>
        }
        subtitle="Easily browse, compare, and find the perfect car that suits your needs."
        subtitleClassName="h7 text-white mb-36 wow fadeInUp"
        sectionModifierClass="page-title-style-3 height-664 effect-content-slide effect-2"
        heightClass=""
        showNavArrows
        bannerOrder={["banner-3.jpg", "banner-1.jpg", "banner-2.jpg", "banner-5.jpg"]}
        showCategoryList={false}
        tabsWowDelay="0.5s"
        filtersWowDelay="0.7s"
      />
      <PopularSearchesCarousel />
      <BrandsSection />
      <BrowseByTypePhotoCards />
      <WhyChooseUsSection variant="dark" animateCounters />
      <TrendingSearchesGrid />
      <CompareTopRatedSection
        pairs={[
          {
            images: ["/assets/images/card/card-21.png", "/assets/images/card/card-22.png"],
            left: { brand: "TESLA", title: "2024 Tesla Model Y", price: "$44.900,00" },
            right: { brand: "TESLA", title: "2024 Ford Mustang Mach-E", price: "$42.900,00" },
            ctaHref: "/compare",
          },
          {
            images: ["/assets/images/card/card-23.png", "/assets/images/card/card-24.png"],
            left: { brand: "Honda", title: "2022 Jeep Grand Cherokee Overland", price: "$44.900,00" },
            right: { brand: "Camry", title: "2022 Toyota 4Runner Limited", price: "$42.900,00" },
          },
          {
            images: ["/assets/images/card/card-35.png", "/assets/images/card/card-36.png"],
            left: { brand: "Honda", title: "2022 Porsche 911 Carrera", price: "$44.900,00" },
            right: { brand: "Camry", title: "2022 Ford Mustang GT Premium", price: "$42.900,00" },
          },
        ]}
        cardClassName="card-box-style-7 style2"
        titleClassName="card-box-style-7--title h7 mb-4"
        swiperClassName="swiper-card-3"
        paginationClass="pagination-swiper-card-3"
        titleSectionClassName="mb-42 wow fadeInDown"
        breakpoints={{
          767: { slidesPerView: 2, slidesPerGroup: 2 },
          1199: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
      />
      <ClientsReviewsSection />

      <Footer />
    </>
  );
}
