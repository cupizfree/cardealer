import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import NewsletterModal from "@/components/common/NewsletterModal";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import NewCarsSection from "@/components/home/NewCarsSection";
import BrowseByTypeSection from "@/components/home/BrowseByTypeSection";
import FinancingCalculatorSection from "@/components/home/FinancingCalculatorSection";
import TrendingSearchesSection from "@/components/home/TrendingSearchesSection";
import HomeClientsReviews from "@/components/home/HomeClientsReviews";
import BrandsSection from "@/components/home/BrandsSection";
import DownloadAppSection from "@/components/home/DownloadAppSection";
import NewsAndReviewsSection from "@/components/home/NewsAndReviewsSection";

export const metadata: Metadata = {
  title: "Aurexo | Car Dealer, Rental & Listing",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/index.html — the site's most complex page (per COMPONENT_MAP.md's own
// recommendation, migrated after about-us.html). Source's `<body>` carries no `inner-page` class
// (unlike every other migrated page) and `.header-container-fluid` carries an extra `header-primary`
// class with zero matching CSS anywhere in ../aurexo/assets/scss (grepped, confirmed dead) — a no-op
// leftover, not reproduced. Of the 6 modals COMPONENT_MAP.md flagged for this page, 5
// (Login/ForgotPassword/SignUp/Search/Compare) are already mounted globally in `app/layout.tsx`;
// only `NewsletterModal` is mounted per-page (see that file's own comment), added here.
export default function Home() {
  return (
    <>
      <Header activePath="/" />

      <HeroSearchSection />
      <NewCarsSection />
      <BrowseByTypeSection />
      <FinancingCalculatorSection />
      <TrendingSearchesSection />
      <HomeClientsReviews />
      <BrandsSection />
      <DownloadAppSection />
      <NewsAndReviewsSection />

      <Footer />

      <NewsletterModal />
    </>
  );
}
