"use client";

import Image from "next/image";
import { useState } from "react";
import ParallaxImage from "@/components/common/ParallaxImage";
import {
  AWAL_KREDIT,
  PILIHAN_TENOR,
  angkaDariTeks,
  hitungKredit,
  persenDariTeks,
  rupiah,
} from "@/lib/kredit";

// Blok "Simulasi Kredit" yang dipakai beranda dan varian home-04/06/08/09/10.
//
// Sebelumnya seluruh blok ini UI_ONLY: angka `$46.300` / `$788.56/Month` adalah
// defaultValue statis salinan templat, tidak ada state, dan tombol "Hitung"
// tidak tersambung ke apa pun — dolar di situs berbahasa Indonesia yang menjual
// mobil dalam Rupiah.
//
// Kini memakai mesin hitung bersama di `@/lib/kredit`: isian dalam Rupiah,
// hasil berubah begitu isian diubah, dan tenor memakai pilihan bulan yang lazim
// di Indonesia (12/24/36/48/60) menggantikan "30 months"/"10 months" sisa templat.
//
// Perbedaan antar-halaman tetap dipertahankan lewat prop kelas (gap grid, jarak
// label) supaya tampilan tiap varian tidak berubah.

/** Isian + hasil simulasi. Satu instance = satu state sendiri. */
function IsianSimulasi({
  gapGrid = "grid gap-13 grid-cols-2 mb-20 md-grid-cols-1",
  labelHarga = "mb-10",
  labelBunga = "mb-10",
  labelMuka = "mb-8",
  labelHasil = "mb-4",
}: {
  gapGrid?: string;
  labelHarga?: string;
  labelBunga?: string;
  labelMuka?: string;
  labelHasil?: string;
}) {
  const [harga, setHarga] = useState(String(AWAL_KREDIT.harga));
  const [bunga, setBunga] = useState(String(AWAL_KREDIT.bungaPerTahun));
  const [tenor, setTenor] = useState(AWAL_KREDIT.tenorBulan);
  const [muka, setMuka] = useState(String(AWAL_KREDIT.uangMuka));

  const hasil = hitungKredit({
    harga: angkaDariTeks(harga),
    uangMuka: angkaDariTeks(muka),
    tenorBulan: tenor,
    bungaPerTahun: persenDariTeks(bunga),
    pajakPersen: AWAL_KREDIT.pajakPersen,
    tukarTambah: 0,
  });

  return (
    <form action="#" onSubmit={(event) => event.preventDefault()}>
      <div className={gapGrid}>
        <div className="md-colspan-1">
          <p className={labelHarga}>Harga Mobil</p>
          <input
            className="active"
            type="text"
            inputMode="numeric"
            value={harga}
            onChange={(event) => setHarga(event.target.value)}
            required
          />
        </div>

        <div className="md-colspan-1">
          <p className={labelBunga}>Bunga per Tahun (%)</p>
          <input
            type="text"
            inputMode="decimal"
            value={bunga}
            onChange={(event) => setBunga(event.target.value)}
            required
          />
        </div>

        <div className="md-colspan-1">
          <p className="mb-8">Tenor Pinjaman (bulan)</p>
          <select value={tenor} onChange={(event) => setTenor(Number(event.target.value))}>
            {PILIHAN_TENOR.map((bulan) => (
              <option key={bulan} value={bulan}>
                {bulan} bulan
              </option>
            ))}
          </select>
        </div>

        <div className="md-colspan-1">
          <p className={labelMuka}>Uang Muka</p>
          <input
            type="text"
            inputMode="numeric"
            value={muka}
            onChange={(event) => setMuka(event.target.value)}
            required
          />
        </div>

        <button type="submit" className="btn btn-medium btn-primary col-span-2">
          Hitung
        </button>
      </div>

      <div className="grid gap-8 grid-cols-3 md-grid-cols-1">
        <div>
          <p className={labelHasil}>Cicilan Bulanan:</p>
          <p className="font-weight-600">{rupiah(hasil.cicilanBulanan)}</p>
        </div>

        <div>
          <p className={labelHasil}>Total Bunga:</p>
          <p className="font-weight-600">{rupiah(hasil.bunga)}</p>
        </div>

        <div>
          <p className={labelHasil}>Perk. Total Pinjaman:</p>
          <p className="font-weight-600">{rupiah(hasil.totalPinjaman)}</p>
        </div>
      </div>
    </form>
  );
}

export default function FinancingCalculatorSection({
  variant = "withImage",
  afterContent,
  outlineSectionClassName = "bg-white py-100",
  outlineHeadingClassName = "mb-18",
  outlinePriceRateLabelClassName = "mb-10",
  outlineResultLabelClassName = "mb-2",
  outlineImageClassName = "max-w-628 caculator-box--image",
}: {
  variant?: "withImage" | "parallax" | "outline";
  afterContent?: React.ReactNode;
  outlineSectionClassName?: string;
  outlineHeadingClassName?: string;
  outlinePriceRateLabelClassName?: string;
  outlineResultLabelClassName?: string;
  /** home-09.html's own companion image is `max-w-628 ml-60 move3` — a THIRD distinct animation-class
   *  variant (neither home-06's own plain `caculator-box--image` nor the default `"withImage"` variant's
   *  own `move5`), confirmed via source diff. */
  outlineImageClassName?: string;
}) {
  if (variant === "outline") {
    return (
      <section className={outlineSectionClassName}>
        <div className="container">
          <div className="row items-center">
            <div className="col-lg-6 wow fadeInUp">
              <div className="caculator-box bg-white outline radius-12">
                <h2 className={outlineHeadingClassName}>Simulasi Kredit</h2>

                <IsianSimulasi
                  gapGrid="grid gap-22 gap-x-16 grid-cols-2 mb-20 md-grid-cols-1"
                  labelHarga={outlinePriceRateLabelClassName}
                  labelBunga={outlinePriceRateLabelClassName}
                  labelMuka="mb-8"
                  labelHasil={outlineResultLabelClassName}
                />
              </div>
            </div>
            <div className="col-lg-6 text-center wow fadeInUp">
              <Image
                className={outlineImageClassName}
                src="/assets/images/home/banner-calulator.png"
                alt="caculator-image"
                width={628}
                height={520}
              />
            </div>
          </div>
        </div>

        {afterContent && (
          <>
            <div className="tf-spacing" />
            {afterContent}
          </>
        )}
      </section>
    );
  }

  if (variant === "parallax") {
    return (
      <section className="relative py-90">
        <ParallaxImage src="/assets/images/banner/bg-video.jpg" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6" />
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.2s">
              <div className="caculator-box bg-white p-40 md-mb-0">
                <h2 className="mb-20">Simulasi Kredit</h2>

                <IsianSimulasi
                  gapGrid="grid gap-13 grid-cols-2 mb-20 md-grid-cols-1"
                  labelHarga="mb-8"
                  labelBunga="mb-8"
                  labelMuka="mb-8"
                  labelHasil="mb-4"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="background-light py-100">
      <div className="container">
        <div className="row items-center">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="caculator-box bg-white p-40">
              <h2 className="mb-20">Simulasi Kredit</h2>

              <IsianSimulasi
                gapGrid="grid gap-13 grid-cols-2 mb-20 md-grid-cols-1"
                labelHarga="mb-10"
                labelBunga="mb-10"
                labelMuka="mb-8"
                labelHasil="mb-4"
              />
            </div>
          </div>
          <div className="col-lg-6 text-center wow fadeInUp" data-wow-delay="0.3s">
            <Image
              className="max-w-628 ml-60 move5"
              src="/assets/images/home/banner-calulator.png"
              alt="caculator-image"
              width={628}
              height={520}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
