// GET  /api/pengguna — daftar admin & staff (khusus admin)
// POST /api/pengguna — tambah pengguna (khusus admin)

import { ApiError, bacaJson, dibuat, sukses, tangani } from "@/lib/api";
import { wajibPeran } from "@/lib/auth";
import { bacaPengguna } from "@/lib/masukan";
import { buatPengguna, catatLog, daftarPengguna, emailTerpakai } from "@/lib/repo/pengguna";

export const dynamic = "force-dynamic";

export async function GET() {
  return tangani(async () => {
    await wajibPeran("admin");
    return sukses(daftarPengguna());
  });
}

export async function POST(req: Request) {
  return tangani(async () => {
    const admin = await wajibPeran("admin");
    const b = await bacaJson(req);
    const m = bacaPengguna(b, "baru");

    const email = String(m.email);
    if (emailTerpakai(email)) {
      throw new ApiError(409, "EMAIL_TERPAKAI", `Surel "${email}" sudah terdaftar.`);
    }

    const p = buatPengguna({
      email,
      nama: String(m.nama),
      peran: m.peran ?? "staff",
      kata_sandi: String(m.kata_sandi),
      telepon: m.telepon ?? null,
      aktif: m.aktif !== false,
    });

    catatLog(admin.id, "buat", "pengguna", p.id, `Tambah ${p.peran} "${p.nama}"`);
    return dibuat(p);
  });
}
