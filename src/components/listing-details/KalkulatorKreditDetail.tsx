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

// Kalkulator kredit 4-isian di halaman detail unit.
//
// Sebelumnya UI_ONLY di dalam `ListingDetailsContent`: `$46.300` / `$788.56/Month`
// adalah defaultValue statis salinan templat, tanpa state dan tanpa perhitungan.
// Dipisah ke komponen klien sendiri karena `ListingDetailsContent` adalah
// komponen server dan tidak boleh memuat hook.
export default function KalkulatorKreditDetail({ hargaAwal }: { hargaAwal?: number }) {
  const awal = hargaAwal && hargaAwal > 0 ? hargaAwal : AWAL_KREDIT.harga;
  const [harga, setHarga] = useState(String(awal));
  const [bunga, setBunga] = useState(String(AWAL_KREDIT.bungaPerTahun));
  const [tenor, setTenor] = useState(AWAL_KREDIT.tenorBulan);
  const [muka, setMuka] = useState(String(Math.round(awal * 0.2)));

  const hasil = hitungKredit({
    harga: angkaDariTeks(harga),
    uangMuka: angkaDariTeks(muka),
    tenorBulan: tenor,
    bungaPerTahun: persenDariTeks(bunga),
    pajakPersen: AWAL_KREDIT.pajakPersen,
    tukarTambah: 0,
  });

  return (
    <form action="#" className="financing-calculator mb-40" onSubmit={(event) => event.preventDefault()}>
      <div className="financing-calculator-form mb-24">
        <div className="grid grid-cols-4 xl2-grid-cols-2 md-grid-cols-1 gap-12">
          <div>
            <p className="mb-10">Harga Mobil</p>
            <input
              className="active"
              id="FinancingCalculatorCarPrice"
              name="FinancingCalculatorCarPrice"
              type="text"
              inputMode="numeric"
              value={harga}
              onChange={(event) => setHarga(event.target.value)}
              required
            />
          </div>
          <div>
            <p className="mb-10">Bunga per Tahun (%)</p>
            <input
              id="FinancingCalculatorInterestRate"
              name="FinancingCalculatorInterestRate"
              type="text"
              inputMode="decimal"
              value={bunga}
              onChange={(event) => setBunga(event.target.value)}
              required
            />
          </div>
          <div>
            <p className="mb-8">Tenor Pinjaman (bulan)</p>
            <select
              id="FinancingCalculatorLoanTerm"
              name="FinancingCalculatorLoanTerm"
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
            <p className="mb-8">Uang Muka</p>
            <input
              id="FinancingCalculatorDownPayment"
              name="FinancingCalculatorDownPayment"
              type="text"
              inputMode="numeric"
              value={muka}
              onChange={(event) => setMuka(event.target.value)}
              required
            />
          </div>
        </div>
        <button type="submit" className="btn btn-medium btn-primary mb-2">
          Hitung
        </button>
      </div>
      <div className="grid gap-8 grid-cols-3 md-grid-cols-1">
        <div>
          <p className="mb-4">Cicilan Bulanan:</p>
          <p className="font-weight-600">{rupiah(hasil.cicilanBulanan)}</p>
        </div>
        <div>
          <p className="mb-4">Total Bunga:</p>
          <p className="font-weight-600">{rupiah(hasil.bunga)}</p>
        </div>
        <div>
          <p className="mb-4">Perk. Total Pinjaman:</p>
          <p className="font-weight-600">{rupiah(hasil.totalPinjaman)}</p>
        </div>
      </div>
    </form>
  );
}
