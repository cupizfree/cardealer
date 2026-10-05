import type { Metadata } from "next";
import HeaderStyle4 from "@/components/header/HeaderStyle4";
import Footer from "@/components/footer/Footer";
import HeroSearchSliderSection from "@/components/home-05/HeroSearchSliderSection";
import PopularSearchesPeekCarousel from "@/components/home-04/PopularSearchesPeekCarousel";
import BrandsGridCarousel from "@/components/home-05/BrandsGridCarousel";
import BrowseByTypeGallery from "@/components/home-04/BrowseByTypeGallery";
import CompareTopRatedSection from "@/components/home-02/CompareTopRatedSection";
import UsedCarsByBudgetSection from "@/components/home-05/UsedCarsByBudgetSection";
import ClientsReviewsCarousel from "@/components/common/ClientsReviewsCarousel";
import NewsReviewsSplitSection from "@/components/home-05/NewsReviewsSplitSection";
import { emilyBenjaminOliviaTestimonials } from "@/data/clientTestimonials";

export const metadata: Metadata = {
  title: "Beranda Varian 5",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/home-05.html (4412 lines). Header is a genuinely new variant
// (`header/HeaderStyle4.tsx`, `header-style-4 header-blur` — real contact-info top bar + one combined
// logo/nav/actions row). Hero (`home-05/HeroSearchSliderSection.tsx`) is a real hybrid of
// `home-04/HeroBannerSlider.tsx`'s dual-swiper Controller sync + real nav arrows and
// `home/HeroSearchSection.tsx`'s full filter-bar UI — see that file's own comment. "Mobil Baru"
// reuses `home-04/PopularSearchesPeekCarousel` byte-for-byte via its new `heading`/`sectionClassName`
// props. "Explore Our Brands" is a genuinely different 12-brand `.swiper-outbrand-3` variant with a
// real 2-row grid (`home-05/BrandsGridCarousel.tsx`) — NOT the same component as `home/BrandsSection`.
// "Cari Berdasarkan Tipe" reuses `home-04/BrowseByTypeGallery` via its new `variant="scroll"` prop (same
// click-expand mechanism, different flex ratio + horizontal-scroll wrapper). "Compare Top Rated
// Vehicles" reuses `home-02/CompareTopRatedSection` with its own 2 pairs (the same Tesla pair as
// home-02's default, plus the same Porsche pair already used as home-03's 3rd pair) — all defaults
// (`card-box-style-4`/`swiper-card-2`/breakpoints) match source exactly, so no new props needed here.
// "Mobil Bekas Sesuai Anggaran" is a genuinely new 5-tab section (`home-05/UsedCarsByBudgetSection.tsx`, real
// client tab switch, static grid, all ids reused from `allListings`). "Ulasan Pelanggan" reuses
// `common/ClientsReviewsCarousel` with its own 3-testimonial (repeated to 6) dataset, 2 of which are
// verbatim reused from `home/HomeClientsReviews.tsx`'s own set (see above). "News & Reviews" is a
// genuinely new static split layout (`home-05/NewsReviewsSplitSection.tsx`, 1 large + 2 small posts,
// not a swiper). Footer reused as-is. No NewsletterModal/VideoModal on this page (confirmed absent
// from source).
export default function Home05() {
  return (
    <>
      <HeaderStyle4 activePath="/home-05" />

      <HeroSearchSliderSection />
      <PopularSearchesPeekCarousel heading="Mobil Baru" sectionClassName="py-100 background-light" />
      <BrandsGridCarousel />
      <BrowseByTypeGallery variant="scroll" />
      <CompareTopRatedSection
        pairs={[
          {
            images: ["/assets/images/card/card-21.png", "/assets/images/card/card-22.png"],
            left: { brand: "TESLA", title: "2024 Tesla Model Y", price: "$44.900,00" },
            right: { brand: "TESLA", title: "2024 Ford Mustang Mach-E", price: "$42.900,00" },
          },
          {
            images: ["/assets/images/card/card-35.png", "/assets/images/card/card-36.png"],
            left: { brand: "Honda", title: "2022 Porsche 911 Carrera", price: "$44.900,00" },
            right: { brand: "Camry", title: "2022 Ford Mustang GT Premium", price: "$42.900,00" },
          },
        ]}
      />
      <UsedCarsByBudgetSection />
      <ClientsReviewsCarousel
        testimonials={emilyBenjaminOliviaTestimonials}
        starIcon="star.svg"
        sectionClassName="background-light py-100"
      />
      <NewsReviewsSplitSection />

      <Footer />
    </>
  );
}
