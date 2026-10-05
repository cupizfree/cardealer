"use client";

import { useState } from "react";
import {
  AWAL_KREDIT,
  PILIHAN_TENOR,
  angkaDariTeks,
  hitungKredit,
  persenDariTeks,
  rupiah,
} from "@/lib/kredit";

// Kalkulator 6-isian di halaman /calculator.
//
// Sebelumnya UI_ONLY: `$46.300` / `$1.338/Month` adalah defaultValue statis
// salinan templat, tanpa state dan tanpa perhitungan sama sekali. Kini memakai
// mesin hitung bersama `@/lib/kredit` dan seluruh angkanya Rupiah.
export default function CarPaymentCalculatorSection() {
  const [harga, setHarga] = useState(String(AWAL_KREDIT.harga));
  const [muka, setMuka] = useState(String(AWAL_KREDIT.uangMuka));
  const [tenor, setTenor] = useState(AWAL_KREDIT.tenorBulan);
  const [tukarTambah, setTukarTambah] = useState("0");
  const [bunga, setBunga] = useState(String(AWAL_KREDIT.bungaPerTahun));
  const [pajak, setPajak] = useState(String(AWAL_KREDIT.pajakPersen));

  const hasil = hitungKredit({
    harga: angkaDariTeks(harga),
    uangMuka: angkaDariTeks(muka),
    tenorBulan: tenor,
    bungaPerTahun: persenDariTeks(bunga),
    pajakPersen: persenDariTeks(pajak),
    tukarTambah: angkaDariTeks(tukarTambah),
  });

  const tahun = tenor / 12;

  return (
    <div className="container">
      <h2 className="text-center mb-12">Simulasi Cicilan Mobil</h2>
      <p className="mb-40 text-center text-secondary h7 line-height-28">
        Perkirakan cicilan bulanan dan anggaran mobil berikutnya dengan mudah.
      </p>

      <div className="grid grid-cols-2 gap-40 lg-grid-cols-1">
        <div className="border-box">
          <p className="h3 mb-28">Hitung Perkiraan Cicilan Bulanan</p>
          <form action="#" className="calculate-form" onSubmit={(event) => event.preventDefault()}>
            <div className="grid grid-cols-1 gap-15">
              <div>
                <p className="mb-8">Harga Mobil</p>
                <input
                  className="active input-large"
                  id="calculatePrice"
                  name="calculatePrice"
                  type="text"
                  inputMode="numeric"
                  value={harga}
                  onChange={(event) => setHarga(event.target.value)}
                  required
                />
              </div>

              <div>
                <p className="mb-8">Uang Muka</p>
                <input
                  className="input-large"
                  id="CalculatorPayment"
                  name="CalculatorPayment"
                  type="text"
                  inputMode="numeric"
                  value={muka}
                  onChange={(event) => setMuka(event.target.value)}
                  required
                />
              </div>

              <div>
                <p className="mb-8">Tenor Pinjaman (bulan)</p>
                <select
                  id="CalculatorLoanTerm"
                  name="CalculatorLoanTerm"
                  value={tenor}
                  onChange={(event) => setTenor(Number(event.target.value))}
                >
                  {PILIHAN_TENOR.map((bulan) => (
                    <option key={bulan} value={bulan}>
                      {bulan} bulan
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <p className="mb-8">Nilai Tukar Tambah (Opsional)</p>
                <input
                  className="input-large"
                  id="CalculatorTrade"
                  name="CalculatorTrade"
                  type="text"
                  inputMode="numeric"
                  placeholder="Rp 0"
                  value={tukarTambah}
                  onChange={(event) => setTukarTambah(event.target.value)}
                />
              </div>

              <div>
                <p className="mb-8">Bunga per Tahun (%)</p>
                <input
                  className="input-large"
                  id="CalculatorInterestRate"
                  name="CalculatorInterestRate"
                  type="text"
                  inputMode="decimal"
                  value={bunga}
                  onChange={(event) => setBunga(event.target.value)}
                  required
                />
              </div>

              <div>
                <p className="mb-8">Pajak Penjualan (%)</p>
                <input
                  className="input-large"
                  id="CalculatorTax"
                  name="CalculatorTax"
                  type="text"
                  inputMode="decimal"
                  value={pajak}
                  onChange={(event) => setPajak(event.target.value)}
                  required
                />
              </div>
            </div>
          </form>
        </div>

        <div className="border-box">
          <p className="h3 mb-8">Perkiraan Cicilan Bulanan*</p>
          <p className="mb-10">
            <span className="text-56 font-weight-600">{rupiah(hasil.cicilanBulanan)}</span>
            <span className="h3 font-weight-600">/bulan</span>
          </p>
          <p className="h5 mb-28 capitalize">
            selama {tenor} bulan{tahun >= 1 ? ` (${tahun} tahun)` : ""}
          </p>
          <div className="divider mb-28 w-full" />

          <p className="h4 mb-20">Ringkasan Pinjaman</p>

          <div className="flex flex-col gap-18 mb-28">
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Harga Mobil</span>
              <span className="h7">{rupiah(angkaDariTeks(harga))}</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Uang Muka</span>
              <span className="h7">-{rupiah(angkaDariTeks(muka))}</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Nilai Tukar Tambah</span>
              <span className="h7">-{rupiah(angkaDariTeks(tukarTambah))}</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Perk. Bunga ({persenDariTeks(bunga)}%)</span>
              <span className="h7">+{rupiah(hasil.bunga)}</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Perk. Pajak ({persenDariTeks(pajak)}%)</span>
              <span className="h7">+{rupiah(hasil.pajak)}</span>
            </p>
            <p className="flex justify-between gap-8">
              <span className="h7 text-secondary">Biaya Lain</span>
              <span className="h7">Tidak Termasuk</span>
            </p>
          </div>

          <div className="divider mb-28 w-full" />

          <div className="flex justify-between gap-8 mb-16">
            <p className="h4">Total Pinjaman</p>
            <p className="h4">{rupiah(hasil.totalPinjaman)}</p>
          </div>

          <div className="flex justify-between gap-8">
            <p className="h4">Cicilan Bulanan</p>
            <p className="h4">{rupiah(hasil.cicilanBulanan)}</p>
          </div>
        </div>
      </div>
    </div>
  );
}
