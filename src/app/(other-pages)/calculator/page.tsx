import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import CarPaymentCalculatorSection from "@/components/calculator/CarPaymentCalculatorSection";
import BrowseByPriceSection from "@/components/calculator/BrowseByPriceSection";
import FaqAccordion from "@/components/common/FaqAccordion";

export const metadata: Metadata = {
  title: "Simulasi Kredit",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

const AUTO_LOAN_BLURB = [
  "Kredit mobil adalah sejumlah uang yang Anda pinjam untuk membeli mobil. Pihak yang meminjamkan uang disebut pemberi kredit, dan pihak yang meminjam disebut debitur. Debitur setuju mengembalikan seluruh jumlah pinjaman pada tanggal tertentu di masa depan. Debitur juga membayar bunga, yaitu persentase dari jumlah pinjaman. Keduanya biasanya dibayar melalui cicilan bulanan.",
];

const faqItems = [
  {
    question: "Apa itu Kredit Mobil?",
    answer: [
      AUTO_LOAN_BLURB[0],
      "Kredit mobil sangat umum: di Indonesia, mayoritas pembeli mobil membayar secara kredit. Ini karena sebagian besar orang tidak mampu membayar harga penuh sebuah kendaraan sekaligus. Cicilan bulanan yang lebih kecil dan tersebar dalam jangka waktu lebih panjang jauh lebih ringan.",
      "Anda bisa mengajukan kredit mobil melalui bank atau lembaga pembiayaan. Mereka akan menilai riwayat kredit dan data keuangan Anda, lalu menentukan berapa besar pinjaman yang diberikan dan bunga yang ditawarkan. Anda juga bisa mengajukan pra-layak, yang tidak mewajibkan Anda meminjam dari lembaga tersebut. Pra-layak memungkinkan Anda membandingkan beberapa penawaran sekaligus, sehingga bisa memilih yang paling menguntungkan. Perlu dipahami bahwa kendaraan secara teknis masih milik perusahaan pembiayaan sampai pinjaman Anda lunas.",
    ],
  },
  { question: "Bagaimana Menghitung Kredit Mobil?", answer: AUTO_LOAN_BLURB },
  { question: "Anggaran & Harga Mobil?", answer: AUTO_LOAN_BLURB },
  { question: "Uang Muka?", answer: AUTO_LOAN_BLURB },
  { question: "Nilai Tukar Tambah?", answer: AUTO_LOAN_BLURB },
  { question: "Pajak Penjualan?", answer: AUTO_LOAN_BLURB },
  { question: "Bunga per Tahun?", answer: AUTO_LOAN_BLURB },
];

// Migrated from ../aurexo/calculator.html. Every FAQ item beyond the first repeats the SAME literal
// "An auto loan is a sum of money..." paragraph verbatim in source (confirmed via direct source read)
// — not a transcription shortcut, source itself never wrote distinct answers for questions 2-7.
export default function CalculatorPage() {
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
              <span>Simulasi Kredit</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100">
        <div className="tf-spacing-style3" />

        <CarPaymentCalculatorSection />

        <div className="tf-spacing" />

        <BrowseByPriceSection />
      </section>

      <section className="background-light py-100">
        <div className="container">
          <h2 className="mb-40 text-center">Tanya Jawab Simulasi</h2>
          <div className="max-width-930 mx-auto w-full">
            <FaqAccordion items={faqItems} />
          </div>
        </div>
      </section>

      <Footer />
    </>
  );
}
