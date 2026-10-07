// POST /api/auth/login — masuk, dapat cookie sesi.

import { randomBytes } from "node:crypto";
import { ApiError, bacaJson, sukses, tangani, wajibEmail, wajibTeks } from "@/lib/api";
import { buatSesi, pasangCookie } from "@/lib/auth";
import { hashSandi, cekSandi } from "@/lib/sandi";
import { ambilUntukLogin, catatLog } from "@/lib/repo/pengguna";
import { seedJikaKosong } from "@/lib/seed";
import { bersihkanKunci, catatGagal, kunciLogin, sisaBlokir } from "@/lib/pembatasan";

export const dynamic = "force-dynamic";

// Hash boneka untuk surel yang tidak ada.
//
// Tanpa ini, `!p || !cekSandi(...)` membuat scrypt HANYA berjalan kalau surelnya
// terdaftar — dan scrypt itu lambat dengan sengaja. Selisih waktunya cukup untuk
// membedakan "surel ini ada" dari "tidak ada", yang berarti form masuk berubah
// jadi alat untuk memetakan akun staf. Dengan selalu menjalankan scrypt terhadap
// hash boneka, kedua jalur memakan waktu yang sama.
const HASH_BONEKA = hashSandi(randomBytes(32).toString("hex"));

export async function POST(req: Request) {
  return tangani(async () => {
    // Basis data menyala sendiri saat pertama kali dipakai.
    seedJikaKosong();

    const b = await bacaJson(req);
    const email = wajibEmail(b.email);
    const sandi = wajibTeks(b.kata_sandi, "kata_sandi", 200);

    const kunci = kunciLogin(req, email);
    const sisa = sisaBlokir(kunci);
    if (sisa > 0) {
      const menit = Math.ceil(sisa / 60);
      throw new ApiError(
        429,
        "TERLALU_BANYAK_PERCOBAAN",
        `Terlalu banyak percobaan masuk. Coba lagi dalam ${menit} menit.`,
        { sisaDetik: sisa },
      );
    }

    const p = ambilUntukLogin(email);
    const cocok = cekSandi(sandi, p?.kata_sandi ?? HASH_BONEKA);
    if (!p || !cocok) {
      catatGagal(kunci);
      throw new ApiError(401, "KREDENSIAL_SALAH", "Email atau kata sandi salah.");
    }

    bersihkanKunci(kunci);

    const token = buatSesi(p.id, req.headers.get("user-agent"));
    await pasangCookie(token);
    catatLog(p.id, "masuk", "pengguna", p.id, `${p.nama} masuk`);

    const { kata_sandi: _rahasia, ...aman } = p;
    return sukses({ pengguna: aman });
  });
}
