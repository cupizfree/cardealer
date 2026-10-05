// GET    /api/dealer/:id — satu dealer
// PATCH  /api/dealer/:id — ubah dealer
// DELETE /api/dealer/:id — hapus dealer (ditolak kalau masih menaungi unit)

import { ApiError, bacaJson, sukses, tangani } from "@/lib/api";
import { wajibMasuk } from "@/lib/auth";
import { bacaDealer } from "@/lib/masukan";
import { catatLog } from "@/lib/repo/pengguna";
import {
  ambilDealer,
  hapusDealer,
  jumlahUnitDealer,
  slugDealerTerpakai,
  ubahDealer,
} from "@/lib/repo/dealer";

export const dynamic = "force-dynamic";

type Konteks = { params: Promise<{ id: string }> };

async function idDari(k: Konteks): Promise<number> {
  const { id } = await k.params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ApiError(400, "ID_TIDAK_SAH", "ID dealer harus bilangan bulat positif.");
  }
  return n;
}

export async function GET(_req: Request, k: Konteks) {
  return tangani(async () => {
    const id = await idDari(k);
    const d = ambilDealer(id);
    if (!d) throw new ApiError(404, "TIDAK_DITEMUKAN", "Dealer tidak ditemukan.");
    return sukses({ ...d, jumlah_unit: jumlahUnitDealer(id) });
  });
}

export async function PATCH(req: Request, k: Konteks) {
  return tangani(async () => {
    const p = await wajibMasuk();
    const id = await idDari(k);
    if (!ambilDealer(id)) throw new ApiError(404, "TIDAK_DITEMUKAN", "Dealer tidak ditemukan.");

    const b = await bacaJson(req);
    const m = bacaDealer(b, "ubah");

    if (m.slug && slugDealerTerpakai(m.slug, id)) {
      throw new ApiError(409, "SLUG_TERPAKAI", `Slug "${m.slug}" sudah dipakai dealer lain.`);
    }

    const d = ubahDealer(id, m);
    catatLog(p.id, "ubah", "dealer", id, `Ubah dealer "${d?.nama ?? id}"`);
    return sukses(d);
  });
}

export async function DELETE(_req: Request, k: Konteks) {
  return tangani(async () => {
    const p = await wajibMasuk();
    const id = await idDari(k);
    const d = ambilDealer(id);
    if (!d) throw new ApiError(404, "TIDAK_DITEMUKAN", "Dealer tidak ditemukan.");

    const n = jumlahUnitDealer(id);
    if (n > 0) {
      throw new ApiError(
        409,
        "MASIH_MENAUNGI_UNIT",
        `Dealer "${d.nama}" masih menaungi ${n} unit. Pindahkan unitnya dulu.`,
      );
    }

    hapusDealer(id);
    catatLog(p.id, "hapus", "dealer", id, `Hapus dealer "${d.nama}"`);
    return sukses({ dihapus: true, id });
  });
}
