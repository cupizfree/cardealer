import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AboutHero from "@/components/about-us/AboutHero";
import Testimonials from "@/components/about-us/Testimonials";
import WhyChooseUs from "@/components/about-us/WhyChooseUs";
import ExecutiveTeam from "@/components/about-us/ExecutiveTeam";
import Brands from "@/components/about-us/Brands";
import NewsletterModal from "@/components/common/NewsletterModal";

export const metadata: Metadata = {
  title: "About Us | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/about-us.html. First page in the new `(other-pages)` route group (per
// docs/migration/COMPONENT_MAP.md's "Marketing/info" row). `AboutHero` + `Testimonials` share ONE
// `<section class="pb-100">` in source (with a `tf-spacing-style5` divider between them) — kept as
// two components but assembled under a single shared section here to match that nesting exactly.
export default function AboutUsPage() {
  return (
    <>
      <Header />

      <section className="background-light mb-32">
        <div className="container">
          <div className="flex items-center justify-between">
            <ul className="breadcrumb">
              <li>
                <Link href="/">Home</Link>
              </li>
              <li>
                <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
              </li>
              <li>
                <span>About Us</span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="pb-100">
        <AboutHero />
        <div className="tf-spacing-style5" />
        <Testimonials />
      </section>

      <WhyChooseUs />

      <div className="tf-spacing" />

      <ExecutiveTeam />

      <div className="tf-spacing" />

      <Brands />

      <div className="tf-spacing" />

      <Footer />

      <NewsletterModal />
    </>
  );
}
