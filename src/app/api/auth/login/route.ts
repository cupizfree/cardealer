// POST /api/auth/login — masuk, dapat cookie sesi.

import { ApiError, bacaJson, sukses, tangani, wajibEmail, wajibTeks } from "@/lib/api";
import { buatSesi, pasangCookie } from "@/lib/auth";
import { cekSandi } from "@/lib/sandi";
import { ambilUntukLogin, catatLog } from "@/lib/repo/pengguna";
import { seedJikaKosong } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  return tangani(async () => {
    // Basis data menyala sendiri saat pertama kali dipakai.
    seedJikaKosong();

    const b = await bacaJson(req);
    const email = wajibEmail(b.email);
    const sandi = wajibTeks(b.kata_sandi, "kata_sandi", 200);

    const p = ambilUntukLogin(email);
    if (!p || !cekSandi(sandi, p.kata_sandi)) {
      throw new ApiError(401, "KREDENSIAL_SALAH", "Email atau kata sandi salah.");
    }

    const token = buatSesi(p.id, req.headers.get("user-agent"));
    await pasangCookie(token);
    catatLog(p.id, "masuk", "pengguna", p.id, `${p.nama} masuk`);

    const { kata_sandi: _rahasia, ...aman } = p;
    return sukses({ pengguna: aman });
  });
}
