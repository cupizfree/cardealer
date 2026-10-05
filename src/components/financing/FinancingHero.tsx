"use client";

import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/components/common/ModalProvider";

// Migrated from ../aurexo/financing.html lines 484-532. "Masuk" is a real `open-modal` trigger for
// `LoginModal` (reused via `useModal`, same pattern as every other `open-modal` trigger this session).
// "Cek Pra-Layak" links to `/contact-us` (not yet migrated) — matches source's own
// `href="contact-us.html"`.
export default function FinancingHero() {
  const { openModal } = useModal();

  return (
    <section className="bg-white pb-100">
      <div className="container">
        <h2>Pembiayaan</h2>
        <div className="tf-spacing-style3" />

        <div className="grid grid-cols-2 xl-grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="wow fadeInUp">
            <h2 className="mb-12 capitalize">Cek Pra-Layak Pembiayaan Mobil</h2>
            <p className="mb-42 h7 line-height-28 text-secondary">
              Dapatkan suku bunga khusus dan opsi kredit fleksibel dalam hitungan menit—tanpa mempengaruhi skor kredit Anda.
            </p>
            <ul className="grid grid-cols-1 gap-26 mb-40">
              <li className="flex items-start gap-12">
                <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                <div>
                  <p className="h5 mb-4 capitalize">Transaksi aman dan balik nama dokumen</p>
                  <p className="h7">Lihat suku bunga khusus dari jaringan mitra pembiayaan kami.</p>
                </div>
              </li>
              <li className="flex items-start gap-12">
                <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                <div>
                  <p className="h5 mb-4 capitalize">Tidak mempengaruhi kredit Anda</p>
                  <p className="h7">Pra-layak dengan mitra pembiayaan kami tidak akan mempengaruhi skor kredit Anda.</p>
                </div>
              </li>
              <li className="flex items-start gap-12">
                <Image className="w-24 h-24" src="/assets/icons/check.svg" alt="check" width={24} height={24} />
                <div>
                  <p className="h5 mb-4 capitalize">Hanya butuh beberapa menit</p>
                  <p className="h7">Jawab beberapa pertanyaan dasar dan lihat hasil khusus untuk Anda seketika.</p>
                </div>
              </li>
            </ul>

            <div className="flex gap-20 items-center">
              <Link href="/contact-us" className="btn btn-primary btn-large-3 font-weight-600">
                Cek Pra-Layak
              </Link>
              <p className="flex gap-8">
                <span>Sudah pra-layak?</span>
                <span className="font-weight-600 text-underline cursor-pointer" onClick={() => openModal("LoginModal")}>
                  Masuk
                </span>
              </p>
            </div>
          </div>
          <div className="ml-24 flex md-ml-0 wow fadeInUp image-effect-scale overflow-hidden radius-20">
            <Image className="w-full" src="/assets/images/home/banner-download-app.jpg" alt="banner-download-app" width={1330} height={996} />
          </div>
        </div>
      </div>
    </section>
  );
}
