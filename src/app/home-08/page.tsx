import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSplitSearchSection from "@/components/home-08/HeroSplitSearchSection";
import BrowseByTypeCardsSection from "@/components/home-02/BrowseByTypeCardsSection";
import PopularSearchesCarousel from "@/components/home-03/PopularSearchesCarousel";
import CompareTopRatedSection from "@/components/home-02/CompareTopRatedSection";
import UsedCarsByBudgetCarouselSection from "@/components/home-08/UsedCarsByBudgetCarouselSection";
import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import SellBuyPromoBanner from "@/components/common/SellBuyPromoBanner";
import FinancingCalculatorSection from "@/components/home/FinancingCalculatorSection";
import NewsReviewsGridSection from "@/components/home-08/NewsReviewsGridSection";
import { emilyBenjaminOliviaTestimonials } from "@/data/clientTestimonials";

export const metadata: Metadata = {
  title: "Beranda Varian 8",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/home-08.html (5129 lines). Header reuses the base `header/Header` component
// byte-for-byte with its own default props (`variant="style-1"`, `bgClassName="bg-white"` — confirmed
// via source diff, identical to index.html's own header, no extension needed at all).
//
// Hero (`home-08/HeroSplitSearchSection.tsx`) is genuinely new: no swiper background (like home-07.html's
// own no-slider variant) but a real 2-column FLEX split layout putting the filter form and a static
// image side by side (`page-title-style-6`), a plain `<p class="h4">` title instead of a heading tag,
// and its own distinct filter-icon button — see that file's own comment.
//
// "Cari Berdasarkan Tipe" reuses `home-02/BrowseByTypeCardsSection`'s exact same 10-type dataset byte-for-byte
// (confirmed via source diff) via 6 new props for its own `bg-primary py-80` dark/blur skin
// (`sectionClassName`/`headingClassName`/`checkAllButtonClassName`/`checkAllIcon`/`cardClassName`/
// `cardTitleColorClass`/`paginationVariant`) — retroactively fixed a missing icon on the "Check All Car
// Type" button while here (home-02.html's own source has one, the component never rendered it).
//
// RETROACTIVE FIX (found on request, "check Browse By Type card-box-style-3 color"): the per-card type
// name always hardcoded no color class, correct for home-02.html's own dark-text-on-white cards, but
// home-08.html's own real title is `text-white` (confirmed via source diff) — its `card-box-blur` cards
// are near-transparent, sitting directly on this section's own dark `bg-primary` background, so the
// default dark text would render at very low contrast. Fixed via the new `cardTitleColorClass="text-white"`
// prop.
//
// "Pencarian populer" reuses `home-03/PopularSearchesCarousel`'s untabbed shape with its own real
// `.swiper-card-style-2` class (byte-identical config to `.swiper-card`, confirmed via `swiper.js`) and
// its own 10-slide id sequence, via new `slideIds`/`swiperClassName`/`paginationClass` props.
//
// "Bandingkan Unit Terbaik" reuses `home-02/CompareTopRatedSection` with home-03/05/06/07's own
// `.swiper-card-3` classes/breakpoints and all 3 known pairs (same call shape as home-06/07's own).
//
// "Mobil Bekas Sesuai Anggaran" (`home-08/UsedCarsByBudgetCarouselSection.tsx`) is genuinely new: a real
// per-tab swiper of the dark `ListingCardDark` card (not home-05.html's own static grid of light
// `ListingCard`s) — see that file's own comment.
//
// "Ulasan Pelanggan" reuses `common/ClientsReviewsCarousel` with the same shared
// `emilyBenjaminOliviaTestimonials` dataset as home-05/06/07, real `cardHref="/clients-reviews"` links,
// and its `children` slot rendering `common/SellBuyPromoBanner` (both cards here link to
// `/sell-your-car` — `leftTitleHref` already defaults to that, `rightTitleHref`/`rightCtaHref` passed
// explicitly — confirmed via source diff, a real, distinct per-page href combo from home-02/03/04/07's
// own calls).
//
// "Simulasi Kredit" reuses `home/FinancingCalculatorSection`'s `variant="outline"` with 4 new
// override props (`outlineSectionClassName="background-light py-100"`, `outlineHeadingClassName=
// "mb-20"`, `outlinePriceRateLabelClassName="mb-8"`, `outlineResultLabelClassName="mb-4"`) — a real,
// confirmed 4th spacing combo distinct from home-06.html's own `"outline"` defaults.
//
// "Berita & Ulasan" (`home-08/NewsReviewsGridSection.tsx`) is genuinely new: a static 2×2 grid of
// `.post-style-4` cards, not a swiper carousel like `blog-details/RelatedArticles.tsx`.
//
// Footer reused as-is.
export default function Home08() {
  return (
    <>
      <Header activePath="/home-08" />

      <HeroSplitSearchSection />

      <BrowseByTypeCardsSection
        sectionClassName="bg-primary py-80"
        headingClassName="text-white"
        checkAllButtonClassName="btn btn-blur hover-fill-primary font-weight-600 btn-large"
        checkAllIcon={
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M10 1.875C8.39303 1.875 6.82214 2.35152 5.486 3.24431C4.14985 4.1371 3.10844 5.40605 2.49348 6.8907C1.87852 8.37535 1.71762 10.009 2.03112 11.5851C2.34463 13.1612 3.11846 14.6089 4.25476 15.7452C5.39106 16.8815 6.8388 17.6554 8.4149 17.9689C9.99099 18.2824 11.6247 18.1215 13.1093 17.5065C14.594 16.8916 15.8629 15.8502 16.7557 14.514C17.6485 13.1779 18.125 11.607 18.125 10C18.1227 7.84581 17.266 5.78051 15.7427 4.25727C14.2195 2.73403 12.1542 1.87727 10 1.875ZM13.5672 10.4422L11.0672 12.9422C10.9499 13.0595 10.7909 13.1253 10.625 13.1253C10.4592 13.1253 10.3001 13.0595 10.1828 12.9422C10.0655 12.8249 9.99966 12.6659 9.99966 12.5C9.99966 12.3341 10.0655 12.1751 10.1828 12.0578L11.6164 10.625H6.875C6.70924 10.625 6.55027 10.5592 6.43306 10.4419C6.31585 10.3247 6.25 10.1658 6.25 10C6.25 9.83424 6.31585 9.67527 6.43306 9.55806C6.55027 9.44085 6.70924 9.375 6.875 9.375H11.6164L10.1828 7.94219C10.0655 7.82491 9.99966 7.66585 9.99966 7.5C9.99966 7.33415 10.0655 7.17509 10.1828 7.05781C10.3001 6.94054 10.4592 6.87465 10.625 6.87465C10.7909 6.87465 10.9499 6.94054 11.0672 7.05781L13.5672 9.55781C13.6253 9.61586 13.6714 9.68479 13.7029 9.76066C13.7343 9.83654 13.7505 9.91787 13.7505 10C13.7505 10.0821 13.7343 10.1635 13.7029 10.2393C13.6714 10.3152 13.6253 10.3841 13.5672 10.4422Z"
              fill="white"
            />
          </svg>
        }
        cardClassName="card-box-style-3 card-box-blur"
        cardTitleColorClass="text-white"
        paginationVariant="pagination-white"
      />

      <PopularSearchesCarousel
        slideIds={[1, 2, 3, 4, 1, 1, 2, 3, 4, 1]}
        swiperClassName="swiper-card-style-2 pb-20"
        paginationClass="pagination-swiper-card-style-2"
        cardTitleExtraClassName="mt-1"
      />

      <CompareTopRatedSection
        cardClassName="card-box-style-7 style2"
        titleClassName="card-box-style-7--title h7 mb-4"
        swiperClassName="swiper-card-3"
        paginationClass="pagination-swiper-card-3"
        breakpoints={{
          767: { slidesPerView: 2, slidesPerGroup: 2 },
          1199: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
        pairs={[
          {
            images: ["/assets/images/card/card-21.png", "/assets/images/card/card-22.png"],
            left: { brand: "TESLA", title: "2024 Tesla Model Y", price: "$44.900,00" },
            right: { brand: "TESLA", title: "2024 Ford Mustang Mach-E", price: "$42.900,00" },
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
      />

      <UsedCarsByBudgetCarouselSection />

      <ClientsReviewsCarousel
        testimonials={emilyBenjaminOliviaTestimonials}
        starIcon="star.svg"
        cardHref="/clients-reviews"
        sectionClassName="bg-white py-100"
      >
        <SellBuyPromoBanner rightTitleHref="/sell-your-car" rightCtaHref="/sell-your-car" />
     
      </ClientsReviewsCarousel>
      <FinancingCalculatorSection
        variant="outline"
        outlineSectionClassName="background-light py-100"
        outlineHeadingClassName="mb-20"
        outlinePriceRateLabelClassName="mb-8"
        outlineResultLabelClassName="mb-4"
      />

      <NewsReviewsGridSection />

      <Footer />
    </>
  );
}
