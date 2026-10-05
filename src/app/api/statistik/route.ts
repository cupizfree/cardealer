// GET /api/statistik — ringkasan untuk dasbor admin & staff.

import { sukses, tangani } from "@/lib/api";
import { wajibMasuk } from "@/lib/auth";
import { jumlahUnitDealer } from "@/lib/repo/dealer";
import { daftarLog } from "@/lib/repo/pengguna";
import { ringkasanProspek } from "@/lib/repo/prospek";
import { daftarUnit } from "@/lib/repo/unit";
import { semua, satu } from "@/lib/db";

export const dynamic = "force-dynamic";

export async function GET() {
  return tangani(async () => {
    await wajibMasuk();

    const totalUnit = Number(satu("SELECT COUNT(*) AS n FROM unit")?.n ?? 0);
    const totalDealer = Number(satu("SELECT COUNT(*) AS n FROM dealer WHERE aktif = 1")?.n ?? 0);
    const totalPengguna = Number(satu("SELECT COUNT(*) AS n FROM pengguna WHERE aktif = 1")?.n ?? 0);

    // Nilai persediaan: jumlah harga seluruh unit yang masih tersedia.
    const nilaiPersediaan = Number(
      satu("SELECT COALESCE(SUM(harga), 0) AS n FROM unit WHERE status = 'tersedia'")?.n ?? 0,
    );

    // Sebaran per status unit.
    const perStatus: Record<string, number> = {};
    for (const r of semua("SELECT status, COUNT(*) AS n FROM unit GROUP BY status")) {
      perStatus[String(r.status)] = Number(r.n);
    }

    // Unit terbaru untuk tabel ringkas.
    const { baris: unitTerbaru } = daftarUnit({ batas: 5, urut: "terbaru" });

    // Prospek terbaru yang belum selesai.
    const prospekPanas = semua(
      `SELECT id, nama, telepon, sumber, status, dibuat_pada
         FROM prospek
        WHERE status IN ('baru', 'dihubungi', 'terjadwal')
        ORDER BY dibuat_pada DESC
        LIMIT 5`,
    ).map((r) => ({
      id: Number(r.id),
      nama: String(r.nama),
      telepon: r.telepon ? String(r.telepon) : null,
      sumber: String(r.sumber),
      status: String(r.status),
      dibuat_pada: String(r.dibuat_pada),
    }));

    // Dealer dengan unit terbanyak.
    const dealerTeratas = semua(
      `SELECT d.id, d.nama, COUNT(u.id) AS jumlah
         FROM dealer d LEFT JOIN unit u ON u.dealer_id = d.id
        GROUP BY d.id ORDER BY jumlah DESC, d.nama LIMIT 5`,
    ).map((r) => ({ id: Number(r.id), nama: String(r.nama), jumlah: Number(r.jumlah) }));

    return sukses({
      angka: {
        totalUnit,
        totalDealer,
        totalPengguna,
        nilaiPersediaan,
        unitTersedia: perStatus.tersedia ?? 0,
        unitTerjual: perStatus.terjual ?? 0,
      },
      perStatusUnit: perStatus,
      prospek: ringkasanProspek(),
      unitTerbaru,
      prospekPanas,
      dealerTeratas,
      logTerakhir: daftarLog(8),
      jumlahUnitDealerContoh: jumlahUnitDealer(dealerTeratas[0]?.id ?? 0),
    });
  });
}
