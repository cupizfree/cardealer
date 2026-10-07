import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import HeroSearchSection from "@/components/home/HeroSearchSection";
import NewCarsSection from "@/components/home/NewCarsSection";
import BrowseByTypeSection from "@/components/home/BrowseByTypeSection";
import FinancingCalculatorSection from "@/components/home/FinancingCalculatorSection";
import TrendingSearchesSection from "@/components/home/TrendingSearchesSection";
import HomeClientsReviews from "@/components/home/HomeClientsReviews";
import BrandsSection from "@/components/home/BrandsSection";
import NewsAndReviewsSection from "@/components/home/NewsAndReviewsSection";

export const metadata: Metadata = {
  title: { absolute: "MARF | Showroom Mobil Purwokerto" },
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/index.html — the site's most complex page (per COMPONENT_MAP.md's own
// recommendation, migrated after about-us.html). Source's `<body>` carries no `inner-page` class
// (unlike every other migrated page) and `.header-container-fluid` carries an extra `header-primary`
// class with zero matching CSS anywhere in ../aurexo/assets/scss (grepped, confirmed dead) — a no-op
// leftover, not reproduced. Of the 6 modals COMPONENT_MAP.md flagged for this page, 5
// (Login/ForgotPassword/SignUp/Search/Compare) are already mounted globally in `app/layout.tsx`.
// The sixth was the "Berlangganan Buletin Kami!" pop-up, which opened itself 100ms after the
// preloader cleared. It has been removed: the site has no mailing list, its form posted nowhere
// (`action="#"` with a bare `preventDefault`), and it interrupted every first-time visitor on
// three pages to collect an address nothing would ever be sent to.
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
      <NewsAndReviewsSection />

      <Footer />
    </>
  );
}
