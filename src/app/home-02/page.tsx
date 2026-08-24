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
  title: "Aurexo | Car Dealer, Rental & Listing",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/home-02.html (5064 lines, the largest single source page migrated so far).
// A genuinely different homepage layout from index.html (`/`), not just a header/hero skin swap —
// confirmed via full source read: it drops Financing Calculator/Clients Reviews/Explore Our
// Brands/Download App entirely, and adds "Popular Searches" (a 7-type-tab carousel), "Compare Top
// Rated Vehicles", "Why Choose Us" (a different shape from about-us.html's own), "How It Works", and a
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
        title="Find Your Dream Car Today!"
        subtitle="Discover the perfect car for you with a wide selection at great prices."
        titleCentered
        sectionModifierClass="page-title-style-2 effect-content-slide effect-2"
        heightClass=""
        showNavArrows
        categoryHref="/dealer-details"
        tabsWowDelay="0.5s"
        filtersWowDelay="0.7s"
      />
      <BrowseByTypeCardsSection />
      <PopularSearchesSection />
      <TrendingSearchesSection />
      <CompareTopRatedSection />
      <WhyChooseUsCarousel />
      <HowItWorksBoxes />
      <VideoSection />
      <RelatedArticles heading="News & Reviews" viewAllHref="/blog-list" />

      <Footer />

      <NewsletterModal />
      <VideoModal />
    </>
  );
}
