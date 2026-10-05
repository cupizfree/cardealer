// GET    /api/unit/:id — satu unit
// PATCH  /api/unit/:id — ubah unit
// DELETE /api/unit/:id — hapus unit

import { ApiError, bacaJson, sukses, tangani } from "@/lib/api";
import { penggunaSekarang, wajibMasuk } from "@/lib/auth";
import { bacaUnit } from "@/lib/masukan";
import { catatLog } from "@/lib/repo/pengguna";
import { ambilUnit, hapusUnit, slugTerpakai, ubahUnit } from "@/lib/repo/unit";

export const dynamic = "force-dynamic";

type Konteks = { params: Promise<{ id: string }> };

async function idDari(k: Konteks): Promise<number> {
  const { id } = await k.params;
  const n = Number(id);
  if (!Number.isInteger(n) || n <= 0) {
    throw new ApiError(400, "ID_TIDAK_SAH", "ID unit harus bilangan bulat positif.");
  }
  return n;
}

export async function GET(_req: Request, k: Konteks) {
  return tangani(async () => {
    const id = await idDari(k);
    const unit = ambilUnit(id);
    if (!unit) throw new ApiError(404, "TIDAK_DITEMUKAN", "Unit tidak ditemukan.");
    if (unit.status !== "tersedia" && !(await penggunaSekarang())) {
      throw new ApiError(404, "TIDAK_DITEMUKAN", "Unit tidak ditemukan.");
    }
    return sukses(unit);
  });
}

export async function PATCH(req: Request, k: Konteks) {
  return tangani(async () => {
    const p = await wajibMasuk();
    const id = await idDari(k);
    if (!ambilUnit(id)) throw new ApiError(404, "TIDAK_DITEMUKAN", "Unit tidak ditemukan.");

    const b = await bacaJson(req);
    const m = bacaUnit(b, "ubah");

    if (m.slug && slugTerpakai(m.slug, id)) {
      throw new ApiError(409, "SLUG_TERPAKAI", `Slug "${m.slug}" sudah dipakai unit lain.`);
    }

    const unit = ubahUnit(id, m);
    catatLog(p.id, "ubah", "unit", id, `Ubah unit "${unit?.judul ?? id}"`);
    return sukses(unit);
  });
}

export async function DELETE(_req: Request, k: Konteks) {
  return tangani(async () => {
    const p = await wajibMasuk();
    const id = await idDari(k);
    const unit = ambilUnit(id);
    if (!unit) throw new ApiError(404, "TIDAK_DITEMUKAN", "Unit tidak ditemukan.");

    hapusUnit(id);
    catatLog(p.id, "hapus", "unit", id, `Hapus unit "${unit.judul}"`);
    return sukses({ dihapus: true, id });
  });
}
