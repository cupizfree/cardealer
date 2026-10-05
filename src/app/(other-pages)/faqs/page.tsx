import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import FaqsAccordionSections, { type FaqSection } from "@/components/faqs/FaqsAccordionSections";

export const metadata: Metadata = {
  title: "Tanya Jawab",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

const PURCHASE_STEPS_ANSWER = [
  "Untuk membeli mobil dari showroom kami, mulai dengan menjelajahi koleksi kami secara online atau datang langsung untuk menemukan kendaraan yang sesuai kebutuhan Anda. Jadwalkan test drive untuk memastikan unitnya cocok, lalu bahas opsi kredit atau sewa dengan tim kami.",
  "Siapkan dokumen yang diperlukan, seperti KTP, bukti asuransi, dan keterangan penghasilan. Setelah kesepakatan tercapai, selesaikan berkas, periksa mobil, lalu bawa pulang kendaraan baru Anda!",
];
const PURCHASE_STEPS_FIRST_PARAGRAPH = [PURCHASE_STEPS_ANSWER[0]];
const AUTO_LOAN_BLURB = [
  "Kredit mobil adalah sejumlah uang yang Anda pinjam untuk membeli mobil. Pihak yang meminjamkan uang disebut pemberi kredit, dan pihak yang meminjam disebut debitur. Debitur setuju mengembalikan seluruh jumlah pinjaman pada tanggal tertentu di masa depan. Debitur juga membayar bunga, yaitu persentase dari jumlah pinjaman. Keduanya biasanya dibayar melalui cicilan bulanan.",
];

// Migrated from ../aurexo/faqs.html. 3 accordion groups, 12 questions total. Source itself reuses the
// same two answer texts across most questions (`PURCHASE_STEPS_ANSWER`'s 2 paragraphs for each group's
// 1st question, `PURCHASE_STEPS_FIRST_PARAGRAPH` for each group's 2nd, `AUTO_LOAN_BLURB` for the rest)
// — not a transcription shortcut, confirmed via direct source read that all 3 groups repeat this same
// pattern verbatim. See `FaqsAccordionSections` for why this needs its own component (single-open
// state shared across all 3 groups, not the 3 independent `FaqAccordion` instances this would
// otherwise look like).
const faqSections: FaqSection[] = [
  {
    heading: "Cara Membeli?",
    items: [
      { question: "Langkah membeli mobil dari showroom kami?", answer: PURCHASE_STEPS_ANSWER },
      { question: "Dokumen yang diperlukan untuk kredit atau sewa?", answer: PURCHASE_STEPS_FIRST_PARAGRAPH },
      { question: "Pilihan untuk memesan atau inden kendaraan?", answer: AUTO_LOAN_BLURB },
      { question: "Available payment methods and financing plans?", answer: AUTO_LOAN_BLURB },
      { question: "Bagaimana menjadwalkan test drive sebelum membeli?", answer: AUTO_LOAN_BLURB },
    ],
  },
  {
    heading: "Tukar & Pengembalian",
    items: [
      { question: "Kebijakan tukar kendaraan setelah pembelian?", answer: PURCHASE_STEPS_ANSWER },
      { question: "Ketentuan pengembalian mobil sewaan lebih awal?", answer: PURCHASE_STEPS_FIRST_PARAGRAPH },
      { question: "Batas waktu pengajuan tukar atau pengembalian?", answer: AUTO_LOAN_BLURB },
      { question: "Dokumen yang diperlukan untuk proses tukar?", answer: AUTO_LOAN_BLURB },
    ],
  },
  {
    heading: "Pengembalian Dana",
    items: [
      { question: "Siapa yang berhak atas pengembalian dana pembelian atau uang muka?", answer: PURCHASE_STEPS_ANSWER },
      { question: "Bagaimana pengembalian dana untuk sewa yang dibatalkan?", answer: PURCHASE_STEPS_FIRST_PARAGRAPH },
      { question: "Berapa lama waktu penerimaan pengembalian dana?", answer: AUTO_LOAN_BLURB },
    ],
  },
];

export default function FaqsPage() {
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
              <span>Tanya Jawab</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="bg-white pb-84">
        <FaqsAccordionSections pageHeading="Tanya Jawab" sections={faqSections} />
      </section>

      <Footer />
    </>
  );
}
