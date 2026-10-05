import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import DealerProfile from "@/components/dealer-details/DealerProfile";
import DealerSidebar from "@/components/dealer-details/DealerSidebar";
import { allDealers } from "@/data/dealers";

export function generateStaticParams() {
  return allDealers.map((dealer) => ({ slug: dealer.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const dealer = allDealers.find((d) => d.slug === slug);
  return {
    title: dealer ? `${dealer.name}` : "Detail Showroom",
    description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
  };
}

// Migrated from ../aurexo/dealer-details.html, applying the same per-item approach as
// sale-agents-details.html's `[slug]` route (explicitly requested): every one of dealers-listing.html's
// 8 "Detail Showroom" links point at this same literal file in source (no per-dealer id anywhere), and
// source's own hardcoded content ("Euro Workshop", `volvo.png`, "537 Orchard St, NY") doesn't match any
// of the 8 real dealers either — same situation `sale-agents-details.html` had before its own
// `[slug]` conversion. Breadcrumb here is 3 levels (Home > Dealer Listing > {name}) — one shorter than
// sale-agents-details' 4 (no "Layanan" middle crumb here; confirmed via direct source read, not a
// transcription slip).
export default async function DealerDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const dealer = allDealers.find((d) => d.slug === slug);
  if (!dealer) notFound();

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
              <Link href="/dealers-listing">Daftar Showroom</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>{dealer.name}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="tf-spacing-style3" />

        <div className="container innerpage-container">
          <DealerProfile dealer={dealer} />
          <DealerSidebar dealer={dealer} />
        </div>
      </section>

      <Footer />
    </>
  );
}
