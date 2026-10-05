import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import ServicesHero from "@/components/services-center/ServicesHero";
import FeaturesServicesSection from "@/components/services-center/FeaturesServicesSection";
import DownloadAppSection from "@/components/services-center/DownloadAppSection";
import ContactScheduleSection from "@/components/services-center/ContactScheduleSection";

export const metadata: Metadata = {
  title: "Servis & Perawatan",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/services-center.html. Source's own h2/breadcrumb literally read "Sevices
// Center" (missing an "r") — a real source typo, preserved verbatim rather than silently corrected.
export default function ServicesCenterPage() {
  return (
    <>
      <Header />

      <section className="background-light mb-32">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Beranda</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Layanan</span>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Pusat Servis</span>
            </li>
          </ul>
        </div>
      </section>

      <ServicesHero />

      <FeaturesServicesSection />

      <DownloadAppSection />

      <ContactScheduleSection />

      <Footer />
    </>
  );
}
