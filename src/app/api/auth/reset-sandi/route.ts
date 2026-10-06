// POST /api/auth/reset-sandi — pasang sandi baru dengan token sekali pakai.
//
// Setelah sandi berubah, SEMUA sesi pengguna itu dicabut. Kalau tidak, perangkat
// yang sudah masuk dengan sandi lama tetap punya akses — persis yang ingin
// dicegah dengan mengubah sandi.

import { ApiError, bacaJson, sukses, tangani, wajibTeks } from "@/lib/api";
import { cabutSemuaSesi, catatLog, ubahSandi } from "@/lib/repo/pengguna";
import { pakaiTokenReset } from "@/lib/repo/reset";
import { hashSandi } from "@/lib/sandi";

export const dynamic = "force-dynamic";

const MIN_PANJANG = 8;

export async function POST(req: Request) {
  return tangani(async () => {
    const b = await bacaJson(req);
    const token = wajibTeks(b.token, "token", 128);
    const sandi = wajibTeks(b.kata_sandi, "kata_sandi", 200);

    if (sandi.length < MIN_PANJANG) {
      throw new ApiError(422, "SANDI_TERLALU_PENDEK", `Kata sandi minimal ${MIN_PANJANG} karakter.`);
    }

    const hasil = pakaiTokenReset(token);
    if (!hasil.ok) {
      throw new ApiError(400, "TOKEN_TIDAK_SAH", hasil.alasan);
    }

    if (!ubahSandi(hasil.penggunaId, hashSandi(sandi))) {
      throw new ApiError(404, "PENGGUNA_TIDAK_ADA", "Akun tidak ditemukan.");
    }

    const dicabut = cabutSemuaSesi(hasil.penggunaId);
    catatLog(hasil.penggunaId, "reset-sandi", "pengguna", hasil.penggunaId,
      `Sandi diubah lewat tautan atur ulang; ${dicabut} sesi dicabut`);

    return sukses({ pesan: "Kata sandi berhasil diubah. Silakan masuk dengan sandi baru.", sesi_dicabut: dicabut });
  });
}
