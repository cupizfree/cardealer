import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CompareTable from "@/components/compare/CompareTable";

export const metadata: Metadata = {
  title: "Bandingkan Mobil",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/compare.html. Breadcrumb's "Layanan" crumb is a REAL `<a href="/index.html">`
// here (unlike every other page's dead `<span>Layanan</span>` — sell-your-car.html, clients-reviews.html,
// financing.html, services-center.html, faqs.html, terms.html) — preserved as its real (if pointless,
// it just links to home) href rather than "corrected" into the dead-span pattern seen elsewhere.
export default function ComparePage() {
  return (
    <>
      <Header />

      <section className="background-light">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Beranda</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/">Layanan</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>Bandingkan</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="tf-spacing-style3" />
        <div className="container">
          <h2 className="text-center mb-12 capitalize">Bandingkan Mobil Berdampingan</h2>
          <p className="mb-40 text-center text-secondary h7 line-height-28">
            Bandingkan fitur, performa, dan harga untuk memilih mobil yang sempurna.
          </p>

          <CompareTable />
        </div>
      </section>

      <Footer />
    </>
  );
}
