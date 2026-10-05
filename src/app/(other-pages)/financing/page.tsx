import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import FinancingHero from "@/components/financing/FinancingHero";
import HowItWorksSection from "@/components/financing/HowItWorksSection";
import NewsTipsSection from "@/components/financing/NewsTipsSection";
import FaqAccordion from "@/components/common/FaqAccordion";

export const metadata: Metadata = {
  title: "Pembiayaan",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/financing.html. The "Tanya Jawab Pembiayaan" section is byte-identical to
// sell-your-car.html's own FAQ (same 4 questions/answers, confirmed via source diff) — including
// questions literally about "selling my car" on this financing page, a real source copy-paste
// mismatch, not a transcription error here — reproduced verbatim via the same shared `FaqAccordion`.
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

export default function FinancingPage() {
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
              <span>Pembiayaan</span>
            </li>
          </ul>
        </div>
      </section>

      <FinancingHero />

      <HowItWorksSection />

      <NewsTipsSection />

      <section className="background-light py-100">
        <div className="container">
          <h2 className="mb-40 text-center capitalize">Tanya Jawab Pembiayaan</h2>
          <div className="max-width-930 mx-auto w-full">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
