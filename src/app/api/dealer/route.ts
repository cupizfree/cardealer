// GET  /api/dealer — daftar dealer (publik: hanya yang aktif)
// POST /api/dealer — tambah dealer (perlu masuk)

import { ApiError, bacaJson, dibuat, sukses, tangani } from "@/lib/api";
import { penggunaSekarang, wajibMasuk } from "@/lib/auth";
import { bacaDealer } from "@/lib/masukan";
import { catatLog } from "@/lib/repo/pengguna";
import { buatDealer, daftarDealer, slugDealerTerpakai } from "@/lib/repo/dealer";

export const dynamic = "force-dynamic";

export async function GET() {
  return tangani(async () => {
    const masuk = !!(await penggunaSekarang());
    return sukses(daftarDealer(!masuk), { lingkup: masuk ? "semua" : "aktif" });
  });
}

export async function POST(req: Request) {
  return tangani(async () => {
    const p = await wajibMasuk();
    const b = await bacaJson(req);
    const m = bacaDealer(b, "baru");

    const slug = String(m.slug ?? "");
    if (!slug) throw new ApiError(422, "VALIDASI", "Slug tidak bisa dibuat dari nama ini.");
    if (slugDealerTerpakai(slug)) {
      throw new ApiError(409, "SLUG_TERPAKAI", `Slug "${slug}" sudah dipakai dealer lain.`);
    }

    const d = buatDealer({ slug, nama: String(m.nama), ...m });
    catatLog(p.id, "buat", "dealer", d.id, `Tambah dealer "${d.nama}"`);
    return dibuat(d);
  });
}
