"use client";

import Image from "next/image";
import Link from "next/link";
import FotoOrang from "@/components/common/FotoOrang";
import { allSaleAgents } from "@/data/saleAgents";

// "Tim Inti" di halaman Tentang Kami.
//
// Sebelumnya empat kartu berisi foto wajah orang dengan nama Bagas Prasetyo,
// Rina Kusumawati, Dimas Nugroho, dan Ayu Lestari — semuanya orang yang tidak
// pernah bekerja di MARF. Nama mereka juga muncul sebagai "pengulas" di setiap
// halaman unit (lihat `ReviewsSection`), jadi showroom mengutip mereka sebagai
// pelanggan sekaligus memajang mereka sebagai staf.
//
// Sekarang membaca `allSaleAgents` — sumber yang sama dengan halaman Tim Sales,
// jadi tidak mungkin lagi berbeda isi antar halaman.
//
// Baris ikon sosial juga dibuang: kelimanya menunjuk ke beranda Facebook, X,
// Instagram, halaman unduh Skype, dan halaman unduh Telegram — bukan akun MARF.
// Tidak ada satu pun akun sosial MARF yang tercatat di mana pun dalam data, jadi
// menampilkan ikonnya berarti mengirim pengunjung ke tempat yang salah.
//
// Nama di kartu dulu membuka popup `TeamModal` yang isinya selalu "Rina
// Kusumawati" — apa pun kartu yang diklik. Popup itu sudah dihapus; sekarang
// nama menuju halaman orangnya sendiri, sama seperti halaman Tim Sales.
export default function ExecutiveTeam() {
  return (
    <section>
      <h2 className="mb-40 text-center">Tim Inti</h2>
      <div className="container">
        <div className="grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16">
          {allSaleAgents.map((member) => (
            <div className="sale-agent-box" key={member.slug}>
              <div className="card-top mb-20">
                <Link className="w-full flex" href={`/sale-agents-details/${member.slug}`}>
                  <FotoOrang nama={member.name} foto={member.photo} width={495} height={495} className="w-full" />
                </Link>
              </div>

              <div className="card-bottom flex items-center justify-between gap-16">
                <div className="content">
                  <Link
                    className="h5 font-weight-600 sale-agent-title"
                    href={`/sale-agents-details/${member.slug}`}
                  >
                    {member.name}
                  </Link>
                  <p className="text-secondary text-sm">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
