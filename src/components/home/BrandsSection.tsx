"use client";

import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination } from "swiper/modules";
import { useKatalog } from "@/components/common/KatalogProvider";
import { KATALOG_SEMUA, merekDiStok } from "@/lib/faset";

// Migrated from ../aurexo/index.html lines 3298-3371 (`.swiper-outbrand`).
//
// SEBELUMNYA DAFTAR MEREK KARANGAN. Isinya BMW, Mercedes, Audi, Honda, Toyota,
// Volvo dengan jumlah unit 18/22/38/29/23/32 — showroom ini tidak punya satu pun
// BMW, Mercedes, Audi, atau Volvo, dan angka-angkanya tidak berasal dari mana
// pun. Tiap kartu juga menuju alamat yang sama persis, jadi menekan "Toyota" atau
// "BMW" memberi halaman yang identik.
//
// Sekarang daftarnya dihitung dari stok (`merekDiStok`): hanya merek yang benar-
// benar ada, jumlahnya jumlah sungguhan, dan tiap kartu menuju penyaring merek
// yang berlaku.
//
// Logo: hanya dipasang kalau berkas logonya memang sudah terverifikasi milik
// merek itu. Untuk merek yang belum punya berkas logo, kotak gambarnya diisi
// namanya — kotak kosong akan terbaca sebagai gambar rusak, sedangkan memasang
// logo merek lain jelas lebih buruk lagi.
const LOGO: Record<string, string> = {
  Honda: "/assets/images/brand/brand-4.png",
  Toyota: "/assets/images/brand/brand-5.png",
  Hyundai: "/assets/images/brand/brand-8.png",
  Mazda: "/assets/images/brand/brand-10.png",
};

const VIEW_ALL_ICON = (
  <svg width="17" height="17" viewBox="0 0 17 17" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path
      d="M8.125 0C6.51803 0 4.94714 0.476523 3.611 1.36931C2.27485 2.2621 1.23344 3.53105 0.618482 5.0157C0.00352044 6.50035 -0.157382 8.13401 0.156123 9.71011C0.469628 11.2862 1.24346 12.7339 2.37976 13.8702C3.51606 15.0065 4.9638 15.7804 6.5399 16.0939C8.11599 16.4074 9.74966 16.2465 11.2343 15.6315C12.719 15.0166 13.9879 13.9752 14.8807 12.639C15.7735 11.3029 16.25 9.73197 16.25 8.125C16.2477 5.97081 15.391 3.90551 13.8677 2.38227C12.3445 0.85903 10.2792 0.00227486 8.125 0ZM11.6922 8.56719L9.19219 11.0672C9.07492 11.1845 8.91586 11.2503 8.75 11.2503C8.58415 11.2503 8.42509 11.1845 8.30782 11.0672C8.19054 10.9499 8.12466 10.7909 8.12466 10.625C8.12466 10.4591 8.19054 10.3001 8.30782 10.1828L9.74141 8.75H5C4.83424 8.75 4.67527 8.68415 4.55806 8.56694C4.44085 8.44973 4.375 8.29076 4.375 8.125C4.375 7.95924 4.44085 7.80027 4.55806 7.68306C4.67527 7.56585 4.83424 7.5 5 7.5H9.74141L8.30782 6.06719C8.19054 5.94991 8.12466 5.79085 8.12466 5.625C8.12466 5.45915 8.19054 5.30009 8.30782 5.18281C8.42509 5.06554 8.58415 4.99965 8.75 4.99965C8.91586 4.99965 9.07492 5.06554 9.19219 5.18281L11.6922 7.68281C11.7503 7.74086 11.7964 7.80979 11.8279 7.88566C11.8593 7.96154 11.8755 8.04287 11.8755 8.125C11.8755 8.20713 11.8593 8.28846 11.8279 8.36434C11.7964 8.44021 11.7503 8.50914 11.6922 8.56719Z"
      fill="#1C1C1C"
    />
  </svg>
);

// Retroactive fix: the Swiper breakpoints/`spaceBetween` were wrong — real `.swiper-outbrand` config
// (`assets/js/swiper.js`) is `spaceBetween: 30` with breakpoints `375/575/767/991/1280` → `2/2/4/5/6`;
// this had `spaceBetween: 16` and `575: 3` (should stay 2 until 767), same copy-paste error already
// found and fixed for `.swiper-card`/`.swiper-card-5`/etc. (COMPONENT_MAP.md #81).
//
// home-10.html reuses this exact same dataset via 3 props (`sectionClassName`/`titleSectionClassName`/
// `cardClassName`) rather than a separate component.
export default function BrandsSection({
  sectionClassName = "background-light py-100",
  titleSectionClassName = "mb-40",
  cardClassName = "out-brand",
}: {
  sectionClassName?: string;
  titleSectionClassName?: string;
  cardClassName?: string;
}) {
  const merek = merekDiStok(useKatalog());

  if (merek.length === 0) return null;

  return (
    <section className={sectionClassName}>
      <div className="container wow fadeIn" data-wow-delay="0.3s">
        <div className={`title-section ${titleSectionClassName}`}>
          <h2 className="">Jelajahi Merek Kami</h2>
          <Link href={KATALOG_SEMUA} className="btn btn-line-style-2 effect-line-primary hover-fill-white btn-large">
            Lihat Semua Merek
            {VIEW_ALL_ICON}
          </Link>
        </div>

        <Swiper
          modules={[Pagination]}
          slidesPerView={1}
          spaceBetween={30}
          pagination={{ el: ".pagination-swiper-outbrand", clickable: true }}
          breakpoints={{
            375: { slidesPerView: 2 },
            767: { slidesPerView: 4 },
            991: { slidesPerView: 5 },
            1280: { slidesPerView: 6 },
          }}
          className="swiper-container swiper-outbrand"
        >
          {merek.map((m) => {
            const logo = LOGO[m.label];
            return (
              <SwiperSlide key={m.label}>
                <Link href={`${KATALOG_SEMUA}?merek=${encodeURIComponent(m.label)}`} className={cardClassName}>
                  {logo ? (
                    <Image className="out-brand--img mb-8" src={logo} alt={m.label} width={160} height={160} />
                  ) : (
                    <span className="out-brand--img mb-8 flex items-center justify-center">
                      <span className="h4">{m.label}</span>
                    </span>
                  )}
                  <p className="h5">{m.label}</p>
                  <p className="text-muted text-sm">{m.jumlah} Unit</p>
                </Link>
              </SwiperSlide>
            );
          })}
        </Swiper>
        <div className="swiper-pagination pagination-dark pagination-style pagination-swiper-outbrand mt-38" />
      </div>
    </section>
  );
}
