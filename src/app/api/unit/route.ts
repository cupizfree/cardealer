// GET  /api/unit   — daftar unit (publik hanya melihat yang tersedia)
// POST /api/unit   — tambah unit (perlu masuk)

import { angkaDari, bacaJson, dibuat, paramUrl, sukses, tangani, ApiError } from "@/lib/api";
import { penggunaSekarang, wajibMasuk } from "@/lib/auth";
import { bacaUnit } from "@/lib/masukan";
import { catatLog } from "@/lib/repo/pengguna";
import { buatUnit, daftarMerek, daftarUnit, slugTerpakai } from "@/lib/repo/unit";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  return tangani(async () => {
    const s = paramUrl(req);
    const masuk = !!(await penggunaSekarang());

    // Pengunjung anonim hanya boleh melihat unit yang benar-benar tersedia.
    const statusDiminta = s.get("status");
    const status = masuk ? statusDiminta : "tersedia";

    const halaman = angkaDari(s.get("halaman"), 1, 1, 10000);
    const batas = angkaDari(s.get("batas"), 20, 1, 100);

    const { baris, total } = daftarUnit({
      q: s.get("q"),
      merek: s.get("merek"),
      status,
      unggulan: s.get("unggulan") === "1",
      halaman,
      batas,
      urut: s.get("urut"),
    });

    return sukses(baris, {
      total,
      halaman,
      batas,
      halamanTotal: Math.max(1, Math.ceil(total / batas)),
      merek: masuk ? daftarMerek() : undefined,
      lingkup: masuk ? "semua" : "tersedia",
    });
  });
}

export async function POST(req: Request) {
  return tangani(async () => {
    const p = await wajibMasuk();
    const b = await bacaJson(req);
    const m = bacaUnit(b, "baru");

    const slug = String(m.slug ?? "");
    if (!slug) throw new ApiError(422, "VALIDASI", "Slug tidak bisa dibuat dari judul ini.");
    if (slugTerpakai(slug)) {
      throw new ApiError(409, "SLUG_TERPAKAI", `Slug "${slug}" sudah dipakai unit lain.`);
    }

    const unit = buatUnit(
      {
        slug,
        judul: String(m.judul),
        merek: String(m.merek),
        harga: Number(m.harga),
        ...m,
      },
      p.id,
    );

    catatLog(p.id, "buat", "unit", unit.id, `Tambah unit "${unit.judul}"`);
    return dibuat(unit);
  });
}
