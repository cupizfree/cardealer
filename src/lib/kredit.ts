// Mesin hitung kredit mobil — dipakai bersama oleh seluruh kalkulator di situs.
//
// Sebelumnya ketiga kalkulator (halaman /calculator, blok "Simulasi Kredit" di
// beranda & varian home-0x, dan kalkulator di halaman detail unit) hanya
// menampilkan angka dolar statis hasil salin dari templat: tidak ada perhitungan,
// tidak ada state, dan tombol "Hitung" tidak tersambung ke apa pun.
//
// Rumus yang dipakai adalah bunga flat (bunga tetap), bentuk yang lazim dipakai
// dealer di Indonesia:
//
//   pokok         = harga - uang muka - tukar tambah
//   bunga         = pokok x (bunga% / 100) x (tenor / 12)
//   pajak         = harga x (pajak% / 100)
//   total pinjaman= pokok + bunga + pajak
//   cicilan       = total pinjaman / tenor

export type InputKredit = {
  harga: number;
  uangMuka: number;
  tenorBulan: number;
  /** Persen per tahun, mis. 8 untuk 8%. */
  bungaPerTahun: number;
  /** Persen dari harga, mis. 3 untuk 3%. */
  pajakPersen: number;
  tukarTambah: number;
};

export type HasilKredit = {
  pokok: number;
  bunga: number;
  pajak: number;
  totalPinjaman: number;
  cicilanBulanan: number;
};

export function hitungKredit(i: InputKredit): HasilKredit {
  const harga = Math.max(0, i.harga || 0);
  const pokok = Math.max(0, harga - (i.uangMuka || 0) - (i.tukarTambah || 0));
  const bunga = pokok * ((i.bungaPerTahun || 0) / 100) * ((i.tenorBulan || 0) / 12);
  const pajak = harga * ((i.pajakPersen || 0) / 100);
  const totalPinjaman = pokok + bunga + pajak;
  const cicilanBulanan = i.tenorBulan > 0 ? totalPinjaman / i.tenorBulan : 0;
  return { pokok, bunga, pajak, totalPinjaman, cicilanBulanan };
}

/** "Rp 315.000.000" */
export function rupiah(n: number): string {
  const v = Math.round(Number.isFinite(n) ? n : 0);
  return `Rp ${v.toLocaleString("id-ID")}`;
}

/** "Rp 8,4 jt" / "Rp 1,2 M" — untuk ruang sempit. */
export function rupiahRingkas(n: number): string {
  const v = Math.round(Number.isFinite(n) ? n : 0);
  const polos = (x: number) => x.toFixed(Number.isInteger(x) ? 0 : 1).replace(".", ",");
  if (v >= 1_000_000_000) return `Rp ${polos(v / 1_000_000_000)} M`;
  if (v >= 1_000_000) return `Rp ${polos(v / 1_000_000)} jt`;
  return rupiah(v);
}

/** Terima "Rp 315.000.000", "315000000", "315jt", "1,2m" → angka. */
export function angkaDariTeks(teks: string): number {
  const t = (teks || "").toLowerCase().replace(/rp|\s|\./g, "").replace(",", ".");
  const jt = t.match(/^([\d.]+)\s*jt$/);
  if (jt) return Math.round(parseFloat(jt[1]) * 1_000_000);
  const juta = t.match(/^([\d.]+)\s*juta$/);
  if (juta) return Math.round(parseFloat(juta[1]) * 1_000_000);
  const m = t.match(/^([\d.]+)\s*m$/);
  if (m) return Math.round(parseFloat(m[1]) * 1_000_000_000);
  const n = parseFloat(t.replace(/[^\d.]/g, ""));
  return Number.isFinite(n) ? n : 0;
}

/** Terima "8%", "8,5", "8.5%" → angka. */
export function persenDariTeks(teks: string): number {
  const n = parseFloat((teks || "").replace(/[^\d.,]/g, "").replace(",", "."));
  return Number.isFinite(n) ? n : 0;
}

/** Isian awal yang masuk akal untuk pasar Indonesia. */
export const AWAL_KREDIT: InputKredit = {
  harga: 315_000_000,
  uangMuka: 63_000_000,
  tenorBulan: 36,
  bungaPerTahun: 8,
  pajakPersen: 0,
  tukarTambah: 0,
};

export const PILIHAN_TENOR = [12, 24, 36, 48, 60];
