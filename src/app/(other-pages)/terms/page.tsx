import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import TermsSection from "@/components/terms/TermsSection";

export const metadata: Metadata = {
  title: "Syarat & Ketentuan",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/terms.html. Breadcrumb's "Layanan" crumb is a plain non-link <span>, same
// established pattern as sell-your-car.html/clients-reviews.html/financing.html/services-center.html/
// faqs.html. Already linked from src/data/menu.ts:141 ("Terms of use" -> /terms).
export default function TermsPage() {
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
              <span className="capitalize">Syarat &amp; Ketentuan</span>
            </li>
          </ul>
        </div>
      </section>

      <TermsSection />

      <Footer />
    </>
  );
}
