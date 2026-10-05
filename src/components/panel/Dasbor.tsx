"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { minta, rupiah, waktu } from "@/lib/klien";
import {
  BarisKosong,
  BarisMemuat,
  JudulKartu,
  Kartu,
  KisiKartu,
  Lencana,
  Stat,
  TABEL,
  TABEL_BUNGKUS,
  TD,
  TH,
  TOMBOL,
  TOMBOL_KECIL,
  TOMBOL_UTAMA,
} from "./ui";

type Stat2 = {
  angka: {
    totalUnit: number;
    totalDealer: number;
    totalPengguna: number;
    nilaiPersediaan: number;
    unitTersedia: number;
    unitTerjual: number;
  };
  perStatusUnit: Record<string, number>;
  prospek: Record<string, number>;
  unitTerbaru: { id: number; judul: string; merek: string; harga: number; status: string }[];
  prospekPanas: {
    id: number;
    nama: string;
    telepon: string | null;
    sumber: string;
    status: string;
    dibuat_pada: string;
  }[];
  dealerTeratas: { id: number; nama: string; jumlah: number }[];
  logTerakhir: {
    id: number;
    aksi: string;
    entitas: string;
    ringkasan: string | null;
    nama_pengguna: string | null;
    dibuat_pada: string;
  }[];
};

export default function Dasbor({ peran }: { peran: "admin" | "staff" }) {
  const [d, setD] = useState<Stat2 | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(true);

  const muat = useCallback(async () => {
    setMemuat(true);
    const h = await minta<Stat2>("/api/statistik");
    if (h.ok) {
      setD(h.data);
      setGalat(null);
    } else {
      setGalat(h.pesan);
    }
    setMemuat(false);
  }, []);

  useEffect(() => {
    muat();
  }, [muat]);

  if (memuat && !d) {
    return (
      <p className="py-16 text-center text-[13.5px] text-redup">
        <span className="inline-flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-garis border-t-marf" />
          Memuat ringkasan…
        </span>
      </p>
    );
  }

  if (galat) {
    return (
      <p className="rounded-lg border border-marf-garis bg-marf-muda px-3.5 py-2.5 text-[13px] text-marf-tua">
        {galat}
      </p>
    );
  }

  if (!d) return null;

  const prospekBaru = d.prospek.baru ?? 0;
  const prospekAktif = prospekBaru + (d.prospek.dihubungi ?? 0) + (d.prospek.terjadwal ?? 0);

  return (
    <div className="space-y-[18px]">
      <KisiKartu>
        <Stat
          label="Unit Tersedia"
          angka={d.angka.unitTersedia}
          kaki={`dari ${d.angka.totalUnit} unit · ${d.angka.unitTerjual} terjual`}
        />
        <Stat
          label="Prospek Baru"
          angka={prospekBaru}
          kaki={`${prospekAktif} sedang ditangani`}
          aksen="kuning"
        />
        <Stat
          label="Nilai Persediaan"
          angka={rupiah(d.angka.nilaiPersediaan)}
          kaki="total harga unit tersedia"
          aksen="biru"
          kecil
        />
        <Stat
          label={peran === "admin" ? "Pengguna Aktif" : "Dealer Rekanan"}
          angka={peran === "admin" ? d.angka.totalPengguna : d.angka.totalDealer}
          kaki={peran === "admin" ? `${d.angka.totalDealer} dealer aktif` : "showroom terdaftar"}
          aksen="hijau"
        />
      </KisiKartu>

      <div className="grid gap-4 xl:grid-cols-2">
        <Kartu>
          <JudulKartu judul="Prospek yang Perlu Ditindak" ket="Kiriman terbaru yang belum selesai" />

          <div className="overflow-hidden rounded-lg border border-garis">
            <table className={TABEL}>
              <tbody>
                {d.prospekPanas.length === 0 ? (
                  <BarisKosong kolom={2}>Belum ada prospek masuk.</BarisKosong>
                ) : (
                  d.prospekPanas.map((p) => (
                    <tr key={p.id} className="transition hover:bg-[#fcfcfd]">
                      <td className={TD}>
                        <strong className="font-semibold">{p.nama}</strong>
                        <div className="text-[12px] text-redup">{p.telepon ?? "tanpa telepon"}</div>
                      </td>
                      <td className={`${TD} text-right`}>
                        <Lencana nilai={p.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={peran === "admin" ? "/admin/prospek" : "/staff/prospek"}
              className={`${TOMBOL} ${TOMBOL_KECIL}`}
            >
              Buka prospek
            </Link>
          </div>
        </Kartu>

        <Kartu>
          <JudulKartu judul="Unit Terbaru" ket="Lima unit yang paling baru dimasukkan" />

          <div className="overflow-hidden rounded-lg border border-garis">
            <table className={TABEL}>
              <tbody>
                {d.unitTerbaru.length === 0 ? (
                  <BarisKosong kolom={2}>Belum ada unit.</BarisKosong>
                ) : (
                  d.unitTerbaru.map((u) => (
                    <tr key={u.id} className="transition hover:bg-[#fcfcfd]">
                      <td className={TD}>
                        <strong className="font-semibold">{u.judul}</strong>
                        <div className="text-[12px] text-redup">{rupiah(u.harga)}</div>
                      </td>
                      <td className={`${TD} text-right`}>
                        <Lencana nilai={u.status} />
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          <div className="mt-4 flex flex-wrap gap-2">
            <Link
              href={peran === "admin" ? "/admin/unit" : "/staff/unit"}
              className={`${TOMBOL} ${TOMBOL_KECIL}`}
            >
              Buka unit
            </Link>
            {peran === "admin" && (
              <Link href="/admin/unit/baru" className={`${TOMBOL_UTAMA} ${TOMBOL_KECIL}`}>
                + Tambah unit
              </Link>
            )}
          </div>
        </Kartu>

        {peran === "admin" && (
          <>
            <Kartu>
              <JudulKartu judul="Dealer dengan Unit Terbanyak" ket="Sebaran persediaan per showroom" />

              <div className={TABEL_BUNGKUS}>
                <table className={TABEL}>
                  <thead>
                    <tr>
                      <th className={TH}>Showroom</th>
                      <th className={`${TH} text-right`}>Jumlah unit</th>
                    </tr>
                  </thead>
                  <tbody>
                    {d.dealerTeratas.length === 0 ? (
                      <BarisKosong kolom={2}>Belum ada dealer.</BarisKosong>
                    ) : (
                      d.dealerTeratas.map((x) => (
                        <tr key={x.id} className="transition hover:bg-[#fcfcfd]">
                          <td className={`${TD} font-medium`}>{x.nama}</td>
                          <td className={`${TD} text-right font-bold tabular-nums`}>{x.jumlah}</td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Kartu>

            <Kartu>
              <JudulKartu judul="Aktivitas Terakhir" ket="Delapan catatan paling baru" />

              <div className={TABEL_BUNGKUS}>
                <table className={TABEL}>
                  <tbody>
                    {d.logTerakhir.length === 0 ? (
                      <BarisKosong kolom={2}>Belum ada aktivitas.</BarisKosong>
                    ) : (
                      d.logTerakhir.map((l) => (
                        <tr key={l.id} className="transition hover:bg-[#fcfcfd]">
                          <td className={TD}>
                            <Lencana nilai={l.aksi} />
                            <span className="ml-2.5 text-[13px] text-redup">
                              {l.ringkasan ?? l.entitas}
                            </span>
                          </td>
                          <td className={`${TD} whitespace-nowrap text-right text-[11.5px] text-redup`}>
                            {waktu(l.dibuat_pada)}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </Kartu>
          </>
        )}
      </div>
    </div>
  );
}
