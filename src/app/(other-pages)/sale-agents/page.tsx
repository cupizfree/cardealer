import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SaleAgentsSection from "@/components/sale-agents/SaleAgentsSection";

export const metadata: Metadata = {
  title: "Sale Agents | Aurexo",
  description: "Aurexo - Car Dealer, Rental & Listing",
};

// Migrated from ../aurexo/sale-agents.html. Breadcrumb here is 3 levels (Home > Pages > Sale Agents)
// vs. about-us's 2 — source's own "Pages" crumb literally links to `/index.html`, same as "Home",
// not a real intermediate route — reproduced as-is (both link to "/"), not "fixed" into a real /pages
// route that doesn't exist anywhere in source.
export default function SaleAgentsPage() {
  return (
    <>
      <Header />

      <section className="background-light mb-32">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/">Pages</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Sale Agents</span>
            </li>
          </ul>
        </div>
      </section>

      <SaleAgentsSection />

      <Footer />
    </>
  );
}
