import type { Metadata } from "next";
import HeaderStyle4 from "@/components/header/HeaderStyle4";
import Footer from "@/components/footer/Footer";
import HeroSliderSection from "@/components/home-06/HeroSliderSection";
import FilterBarSection from "@/components/home-06/FilterBarSection";
import NewCarsSection from "@/components/home/NewCarsSection";
import BrandsSection from "@/components/home/BrandsSection";
import BrowseByTypePhotoCards from "@/components/home-03/BrowseByTypePhotoCards";
import CompareTopRatedSection from "@/components/home-02/CompareTopRatedSection";
import FinancingCalculatorSection from "@/components/home/FinancingCalculatorSection";
import SellBuyPromoBanner from "@/components/common/SellBuyPromoBanner";
import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import RelatedArticles from "@/components/blog-details/RelatedArticles";
import { emilyBenjaminOliviaTestimonials } from "@/data/clientTestimonials";

export const metadata: Metadata = {
  title: "Beranda Varian 6",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/home-06.html (3522 lines). Header reuses `HeaderStyle4` with `bg-white`
// overrides (dark logo, dark nav chevrons/action icons, `btn-primary` Add Listing button, its own
// wrapper/container classes) — see that component's own header comment for the full prop list and the
// 2 retroactive color bugs found and fixed on home-05's own usage while building these overrides.
// Hero (`home-06/HeroSliderSection.tsx`) is the same real 2-swiper Controller sync + nav arrows as
// `home-05/HeroSearchSliderSection.tsx`, but genuinely simpler — no filter bar inside the hero section
// at all. That filter bar instead lives in its own separate `bg-primary py-40` section
// (`home-06/FilterBarSection.tsx`), whose Advanced panel uses plain native `<select>` elements instead
// of the custom `FilterSelectDropdown` every other page uses (confirmed via source diff — a real,
// different DOM). "Mobil Baru"/"Mobil Bekas" reuses `home/NewCarsSection` byte-for-byte (same `.swiper-
// card-7` ids/grid, zero new props). "Explore Our Brands" reuses `home/BrandsSection` byte-for-byte
// (zero new props). "Cari Berdasarkan Tipe" reuses `home-03/BrowseByTypePhotoCards` byte-for-byte (zero new
// props). "Bandingkan Unit Terbaik" reuses `home-02/CompareTopRatedSection` with home-03/05's own
// `.swiper-card-3` classes/breakpoints, but ALL 3 known pairs (Tesla + Jeep/Toyota + Porsche) instead of
// a 2-pair subset. "Simulasi Kredit" reuses `home/FinancingCalculatorSection`'s new
// `variant="outline"` (a 3rd real wrapper style — `bg-white`, `.outline.radius-12` — see that file's
// own comment) followed by `common/SellBuyPromoBanner` in the same shared section (same
// `leftTitleHref` override as home-03/05, everything else matches home-02's own defaults). "Clients
// Reviews" reuses `common/ClientsReviewsCarousel` with the same shared `emilyBenjaminOliviaTestimonials`
// dataset as home-05.html (byte-identical 3-testimonial/6-slide set, confirmed via source diff).
// "News & Reviews" reuses `blog-details/RelatedArticles` with its own `.swiper-news-2` breakpoints/
// classes (only 2 slides, max 2 columns) via the new `swiperClassName`/`paginationClass`/`breakpoints`
// props. Footer reused as-is; no NewsletterModal/VideoModal on this page (confirmed absent from
// source).
export default function Home06() {
  return (
    <>
      <HeaderStyle4
        activePath="/home-06"
        bgClassName="bg-white"
        wrapperClassName="header-wrapper-style-5"
        topBarContainerClassName="max-w-1440 px-15 md-w-full md-min-w-full"
        dividerClassName="divider-vertical h-24 md-hidden"
        mainContainerClassName="relative max-w-1440 px-15"
        logoSrc="/assets/images/logo.png"
        topLevelChevronColor="#9FA1A4"
        actionIconStroke="#1C1C1C"
        addListingButtonClassName="btn btn-primary btn-large font-weight-600"
        addListingIconColor="white"
        navListClassName=""
        navWrapperClassName="mr-50"
      />

      <HeroSliderSection />
      <FilterBarSection />
      <NewCarsSection />
      <BrandsSection />
      <BrowseByTypePhotoCards />
      <CompareTopRatedSection
        cardClassName="card-box-style-7 style2"
        titleClassName="card-box-style-7--title h7 mb-4"
        swiperClassName="swiper-card-3"
        paginationClass="pagination-swiper-card-3"
        titleSectionClassName="mb-42 wow fadeInDown"
        breakpoints={{
          767: { slidesPerView: 2, slidesPerGroup: 2 },
          1199: { slidesPerView: 3, slidesPerGroup: 3 },
        }}
        pairs={[
          {
            images: ["/assets/images/card/card-21.png", "/assets/images/card/card-22.png"],
            left: { brand: "TESLA", title: "2024 Tesla Model Y", price: "Rp 674.000.000" },
            right: { brand: "TESLA", title: "2024 Ford Mustang Mach-E", price: "Rp 644.000.000" },
          },
          {
            images: ["/assets/images/card/card-23.png", "/assets/images/card/card-24.png"],
            left: { brand: "Honda", title: "2022 Jeep Grand Cherokee Overland", price: "Rp 674.000.000" },
            right: { brand: "Camry", title: "2022 Toyota 4Runner Limited", price: "Rp 644.000.000" },
          },
          {
            images: ["/assets/images/card/card-35.png", "/assets/images/card/card-36.png"],
            left: { brand: "Honda", title: "2022 Porsche 911 Carrera", price: "Rp 674.000.000" },
            right: { brand: "Camry", title: "2022 Ford Mustang GT Premium", price: "Rp 644.000.000" },
          },
        ]}
      />

      <FinancingCalculatorSection
        variant="outline"
        afterContent={<SellBuyPromoBanner leftTitleHref="/listing-grid4-columns" />}
      />

      <ClientsReviewsCarousel
        testimonials={emilyBenjaminOliviaTestimonials}
        starIcon="star.svg"
        sectionClassName=""
      />

      <RelatedArticles
        viewAllHref="/blog-list"
        heading="Berita & Ulasan"
        swiperClassName="swiper-news-2"
        paginationClass="swiper-news-2-pagination"
        breakpoints={{ 0: { slidesPerView: 1 }, 400: { slidesPerView: 1 }, 767: { slidesPerView: 2 } }}
        slides={[
          { image: "/assets/images/blog/post-4.jpg", category: "Ulasan Ahli" },
          { image: "/assets/images/blog/post-6.jpg", category: "BERITA" },
        ]}
      />

      <Footer />
    </>
  );
}
