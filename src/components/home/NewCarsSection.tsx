"use client";

import { useState } from "react";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Grid, Pagination } from "swiper/modules";
import ListingCard from "@/components/listing/ListingCard";
import { useKatalog } from "@/components/common/KatalogProvider";
import { KATALOG_SEMUA } from "@/lib/faset";

// Migrated from ../aurexo/index.html lines 1107-2307 (`.flat-tabs`).
//
// SEBELUMNYA DUA TAB HIASAN. Labelnya "Mobil Baru" dan "Mobil Bekas", tapi
// keduanya menampilkan mobil yang sama: daftar unit di sini diambil dari ID tetap
// 1-8 untuk tab pertama dan 1-6 untuk tab kedua — enam mobil pertama diulang
// persis, dan tidak ada satu pun mobil baru di showroom ini karena seluruh 18
// unitnya bekas. Ditambah lagi ID tetap itu tidak cocok dengan basis data
// sungguhan, jadi begitu katalognya berubah, tabnya menampilkan unit yang salah.
//
// Sekarang tabnya memakai data yang benar-benar ada: kolom `unggulan` di tabel
// unit. Tab pertama menampilkan unit yang ditandai unggulan, tab kedua seluruh
// stok. Keduanya dibaca dari `useKatalog()`, jadi tidak ada daftar ID yang bisa
// melenceng dari basis data lagi.
//
// Tata letak, kelas, dan konfigurasi Swiper-nya tidak diubah: `.swiper-card-7`
// tetap grid dua baris (`slidesPerColumn: 2` / `slidesPerColumnFill: "row"` versi
// swiper.js lama, padanan modernnya `grid: { rows: 2, fill: "row" }`).
type Tab = "unggulan" | "semua";

export default function NewCarsSection() {
  const [activeTab, setActiveTab] = useState<Tab>("unggulan");
  const katalog = useKatalog();

  const unggulan = katalog.filter((l) => l.featured);
  const listings = activeTab === "unggulan" ? unggulan : katalog;

  return (
    <section className="container py-100 flat-tabs">
      <div className="title-section mb-30 gap-8 wow fadeInUp" data-wow-delay="0.1s">
        <ul className="menu-tab menu-tab-style2 text-white gap-40 md-gap-12">
          <li className={activeTab === "unggulan" ? "active" : ""} onClick={() => setActiveTab("unggulan")}>
            <h2 className="text">Unit Unggulan</h2>
          </li>
          <li className={activeTab === "semua" ? "active" : ""} onClick={() => setActiveTab("semua")}>
            <h2 className="text">Semua Unit</h2>
          </li>
        </ul>
        <Link
          href={KATALOG_SEMUA}
          className="btn btn-line-style-2 effect-line-primary hover-fill-white effect-line-primary btn-large"
        >
          Lihat Semua
        </Link>
      </div>

      <div className="content-tab">
        <div className="content-inner active">
          <div className="swiper-container swiper-card-7">
            <Swiper
              key={activeTab}
              modules={[Grid, Pagination]}
              slidesPerView={1}
              spaceBetween={30}
              grid={{ rows: 2, fill: "row" }}
              pagination={{ el: ".pagination-swiper-card-7-1", clickable: true }}
              breakpoints={{
                550: { slidesPerView: 1 },
                767: { slidesPerView: 2 },
                991: { slidesPerView: 3 },
                1440: { slidesPerView: 4 },
              }}
            >
              {listings.map((listing) => (
                <SwiperSlide key={listing.id}>
                  <div className="mt-10">
                    <ListingCard listing={listing} />
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-card-7-1 mt-38" />
          </div>
        </div>
      </div>
    </section>
  );
}
