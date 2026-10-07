import type { Metadata } from "next";
import HeaderStyle2 from "@/components/header/HeaderStyle2";
import Footer from "@/components/footer/Footer";
import NewsletterModal from "@/components/common/NewsletterModal";
import VideoModal from "@/components/common/VideoModal";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import TrendingSearchesSection from "@/components/home/TrendingSearchesSection";
import RelatedArticles from "@/components/blog-details/RelatedArticles";
import BrowseByTypeCardsSection from "@/components/home-02/BrowseByTypeCardsSection";
import PopularSearchesSection from "@/components/home-02/PopularSearchesSection";
import CompareTopRatedSection from "@/components/home-02/CompareTopRatedSection";
import WhyChooseUsCarousel from "@/components/home-02/WhyChooseUsCarousel";
import HowItWorksBoxes from "@/components/home-02/HowItWorksBoxes";
import VideoSection from "@/components/home-02/VideoSection";

export const metadata: Metadata = {
  title: "Beranda Varian 2",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/home-02.html (5064 lines, the largest single source page migrated so far).
// A genuinely different homepage layout from index.html (`/`), not just a header/hero skin swap —
// confirmed via full source read: it drops Financing Calculator/Clients Reviews/Explore Our
// Brands/Download App entirely, and adds "Pencarian Populer" (a 7-type-tab carousel), "Compare Top
// Rated Vehicles", "Why Choose Us" (a different shape from about-us.html's own), "Cara Kerja", and a
// real Video Section+Modal. `HeaderStyle2` is a genuinely different 3-row DOM (top bar + search/
// contact/buttons row + nav row), not a `Header` variant — see that component's own header comment
// (this corrects an earlier, pre-read assumption in COMPONENT_MAP.md that home-02's header was
// "same DOM, differing only by modifier classes"). "Trending Searches Near You" and "News & Reviews"
// are byte-identical in content to index.html's own (confirmed via source diff) — reused directly via
// `TrendingSearchesSection`/`RelatedArticles` rather than rebuilt.
export default function Home02Page() {
  return (
    <>
      <HeaderStyle2 activePath="/home-02" />

      <HeroSearchSection
        title="Temukan Mobil Impian Anda Hari Ini!"
        subtitle="Temukan mobil yang tepat untuk Anda dari pilihan luas dengan harga terbaik."
        titleCentered
        sectionModifierClass="page-title-style-2 effect-content-slide effect-2"
        heightClass=""
        showNavArrows
        filtersWowDelay="0.7s"
      />
      <BrowseByTypeCardsSection />
      <PopularSearchesSection />
      <TrendingSearchesSection />
      <CompareTopRatedSection />
      <WhyChooseUsCarousel />
      <HowItWorksBoxes />
      <VideoSection />
      <RelatedArticles heading="Berita & Ulasan" viewAllHref="/blog-list" />

      <Footer />

      <NewsletterModal />
      <VideoModal />
    </>
  );
}
