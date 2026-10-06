// Penyimpanan gambar yang diunggah dari panel.
//
// Berkas disimpan di `.data/unggah/` — direktori yang sama dengan basis data,
// yang memang persisten dan tidak ikut git. Sengaja TIDAK di `public/`, karena
// `public/` ikut ter-bangun ulang setiap kali image dibuat, sehingga gambar
// yang diunggah lewat panel akan hilang.
//
// Gambar disajikan kembali lewat rute `/api/gambar/<nama>`.

import { mkdirSync, readdirSync, readFileSync, statSync, unlinkSync, writeFileSync } from "node:fs";
import { randomBytes } from "node:crypto";
import { resolve } from "node:path";
import { ApiError } from "./api";

const DIR = resolve(process.cwd(), process.env.MARF_UNGGAH_DIR || "./.data/unggah");

/** Batas ukuran satu berkas. Ponsel zaman sekarang menghasilkan JPEG 3–6 MB. */
export const MAKS_BYTE = 8 * 1024 * 1024;

/** Jenis gambar yang diterima, beserta ekstensi simpannya. */
export const JENIS_DITERIMA: Record<string, string> = {
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
  "image/gif": "gif",
};

/** Nama berkas yang sah: tanpa garis miring, tanpa titik ganda. */
const POLA_NAMA = /^[a-z0-9][a-z0-9-]*\.(jpg|png|webp|gif)$/;

export function dirUnggah(): string {
  mkdirSync(DIR, { recursive: true });
  return DIR;
}

export function namaSah(nama: string): boolean {
  return POLA_NAMA.test(nama);
}

export function jalurGambar(nama: string): string {
  if (!namaSah(nama)) {
    throw new ApiError(400, "NAMA_TIDAK_SAH", "Nama berkas gambar tidak sah.");
  }
  return resolve(dirUnggah(), nama);
}

export function jenisDariNama(nama: string): string {
  const ext = nama.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "jpg":
      return "image/jpeg";
    case "png":
      return "image/png";
    case "webp":
      return "image/webp";
    case "gif":
      return "image/gif";
    default:
      return "application/octet-stream";
  }
}

/**
 * Simpan satu gambar. Mengembalikan nama berkasnya.
 * Menolak berkas yang bukan gambar atau yang melebihi batas ukuran.
 */
export async function simpanGambar(berkas: File): Promise<{ nama: string; byte: number; jenis: string }> {
  const jenis = (berkas.type || "").toLowerCase();
  const ext = JENIS_DITERIMA[jenis];
  if (!ext) {
    throw new ApiError(
      415,
      "JENIS_TIDAK_DITERIMA",
      `Jenis berkas "${jenis || "tidak diketahui"}" tidak diterima. Gunakan JPEG, PNG, WebP, atau GIF.`,
    );
  }

  if (berkas.size > MAKS_BYTE) {
    const mb = (berkas.size / 1024 / 1024).toFixed(1);
    throw new ApiError(
      413,
      "BERKAS_TERLALU_BESAR",
      `Ukuran berkas ${mb} MB melebihi batas ${MAKS_BYTE / 1024 / 1024} MB.`,
    );
  }

  if (berkas.size === 0) {
    throw new ApiError(422, "BERKAS_KOSONG", "Berkas yang dikirim kosong.");
  }

  const data = Buffer.from(await berkas.arrayBuffer());

  // Jangan percaya `Content-Type` saja — periksa magic bytes-nya juga.
  if (!terlihatSepertiGambar(data)) {
    throw new ApiError(415, "BUKAN_GAMBAR", "Isi berkas tidak dikenali sebagai gambar.");
  }

  const cap = new Date().toISOString().slice(0, 10);
  const acak = randomBytes(6).toString("hex");
  const nama = `${cap}-${acak}.${ext}`;

  writeFileSync(resolve(dirUnggah(), nama), data);
  return { nama, byte: data.length, jenis: jenisDariNama(nama) };
}

/** Periksa magic bytes: JPEG, PNG, GIF, WebP. */
function terlihatSepertiGambar(d: Buffer): boolean {
  if (d.length < 12) return false;
  if (d[0] === 0xff && d[1] === 0xd8 && d[2] === 0xff) return true; // JPEG
  if (d.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]))) return true; // PNG
  if (d.subarray(0, 3).toString("ascii") === "GIF") return true; // GIF
  if (d.subarray(0, 4).toString("ascii") === "RIFF" && d.subarray(8, 12).toString("ascii") === "WEBP") return true; // WebP
  return false;
}

/** Daftar gambar tersimpan, terbaru lebih dulu. */
export function daftarGambar(): { nama: string; byte: number; diubah: string }[] {
  let isi: string[];
  try {
    isi = readdirSync(dirUnggah());
  } catch {
    return [];
  }
  return isi
    .filter(namaSah)
    .map((nama) => {
      const s = statSync(resolve(dirUnggah(), nama));
      return { nama, byte: s.size, diubah: s.mtime.toISOString() };
    })
    .sort((a, b) => b.diubah.localeCompare(a.diubah));
}

export function bacaGambar(nama: string): Buffer {
  return readFileSync(jalurGambar(nama));
}

export function hapusGambar(nama: string): boolean {
  try {
    unlinkSync(jalurGambar(nama));
    return true;
  } catch {
    return false;
  }
}
