import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import SellCarHeroForm from "@/components/sell-your-car/SellCarHeroForm";
import HowItWorksSection from "@/components/sell-your-car/HowItWorksSection";
import GetInTouchBanner from "@/components/sell-your-car/GetInTouchBanner";
import WhyChooseUs from "@/components/about-us/WhyChooseUs";
import FaqAccordion from "@/components/common/FaqAccordion";

export const metadata: Metadata = {
  title: "Jual Mobil",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

const faqItems = [
  {
    question: "Dokumen apa saja yang diperlukan untuk menjual mobil saya?",
    answer: [
      "Biasanya Anda perlu STNK yang masih berlaku dan ditandatangani seluruh pemilik terdaftar, beserta BPKB dan KTP atau SIM Anda. Informasi garansi juga mungkin diperlukan. Untuk menuntaskan transaksi, Anda umumnya perlu mengisi surat perjanjian jual beli.",
      "Konfirmasikan ke Samsat setempat untuk memastikan persyaratan di wilayah Anda.",
    ],
  },
  {
    question: "Bisakah saya menjual mobil yang masih ada cicilannya?",
    answer: [
      "Kredit mobil adalah sejumlah uang yang Anda pinjam untuk membeli mobil. Pihak yang meminjamkan uang disebut pemberi kredit, dan pihak yang meminjam disebut debitur. Debitur setuju mengembalikan seluruh jumlah pinjaman pada tanggal tertentu di masa depan. Debitur juga membayar bunga, yaitu persentase dari jumlah pinjaman. Keduanya biasanya dibayar melalui cicilan bulanan.",
    ],
  },
  {
    question: "Bisakah saya menjual mobil yang masih dalam masa sewa?",
    answer: [
      "Kredit mobil adalah sejumlah uang yang Anda pinjam untuk membeli mobil. Pihak yang meminjamkan uang disebut pemberi kredit, dan pihak yang meminjam disebut debitur. Debitur setuju mengembalikan seluruh jumlah pinjaman pada tanggal tertentu di masa depan. Debitur juga membayar bunga, yaitu persentase dari jumlah pinjaman. Keduanya biasanya dibayar melalui cicilan bulanan.",
    ],
  },
  {
    question: "Apa keuntungan menjual mobil lewat MARF?",
    answer: [
      "Kredit mobil adalah sejumlah uang yang Anda pinjam untuk membeli mobil. Pihak yang meminjamkan uang disebut pemberi kredit, dan pihak yang meminjam disebut debitur. Debitur setuju mengembalikan seluruh jumlah pinjaman pada tanggal tertentu di masa depan. Debitur juga membayar bunga, yaitu persentase dari jumlah pinjaman. Keduanya biasanya dibayar melalui cicilan bulanan.",
    ],
  },
];

// Migrated from ../aurexo/sell-your-car.html. Source's breadcrumb "Layanan" crumb is a plain `<span>`
// here (not a link, unlike every other page's clickable "Layanan" crumb) — confirmed via direct source
// read, reproduced as non-interactive rather than assumed to be a link. "Why Choose Us" section is
// byte-identical to about-us.html's own (same heading/checklist/stat-counters) — reused via the
// existing `WhyChooseUs` component; its "Temukan Mobil Anda Sekarang!" CTA already links to `/sell-your-car`
// (this exact page), matching source's own self-referential href.
export default function SellYourCarPage() {
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
              <span>Jual Mobil</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="container">
          <h2>Jual Mobil</h2>
          <div className="tf-spacing-style3" />

          <SellCarHeroForm />
        </div>

        <div className="tf-spacing-style3" />
        <div className="divider w-full" />
        <div className="tf-spacing-style3" />

        <HowItWorksSection />
      </section>

      <WhyChooseUs />

      <GetInTouchBanner />

      <section className="background-light py-100">
        <div className="container">
          <h2 className="mb-40 text-center">Tanya Jawab Jual Mobil</h2>
          <div className="max-width-850 mx-auto w-full">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
