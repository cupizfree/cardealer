"use client";

import { useEffect, useState } from "react";
import { minta, waktu } from "@/lib/klien";
import {
  BarisKosong,
  BarisMemuat,
  KARTU,
  Lencana,
  Pesan,
  TABEL,
  TABEL_BUNGKUS,
  TD,
  TH,
} from "./ui";

type Log = {
  id: number;
  aksi: string;
  entitas: string;
  entitas_id: number | null;
  ringkasan: string | null;
  nama_pengguna: string | null;
  dibuat_pada: string;
};

export default function DaftarLog() {
  const [baris, setBaris] = useState<Log[]>([]);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);

  useEffect(() => {
    minta<{ logTerakhir: Log[] }>("/api/statistik").then((h) => {
      if (h.ok) setBaris(h.data.logTerakhir);
      else setGalat(h.pesan);
      setMemuat(false);
    });
  }, []);

  if (galat) return <Pesan jenis="galat">{galat}</Pesan>;

  return (
    <div className="space-y-4">
      <p className="text-[12.5px] leading-relaxed text-redup">
        Delapan catatan terakhir. Setiap perubahan pada unit, dealer, prospek, dan pengguna
        tercatat otomatis di sini.
      </p>

      <div className={TABEL_BUNGKUS}>
        <table className={TABEL}>
          <thead>
            <tr>
              <th className={TH}>Waktu</th>
              <th className={TH}>Pelaku</th>
              <th className={TH}>Aksi</th>
              <th className={`${TH} hidden sm:table-cell`}>Objek</th>
              <th className={`${TH} hidden lg:table-cell`}>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {memuat && <BarisMemuat kolom={5} apa="jejak aktivitas" />}
            {!memuat && baris.length === 0 && (
              <BarisKosong kolom={5}>Belum ada aktivitas tercatat.</BarisKosong>
            )}

            {baris.map((l) => (
              <tr key={l.id} className="transition hover:bg-[#fcfcfd]">
                <td className={`${TD} whitespace-nowrap text-[12.5px] text-redup`}>
                  {waktu(l.dibuat_pada)}
                </td>
                <td className={`${TD} font-medium`}>
                  {l.nama_pengguna ?? <span className="text-redup">publik</span>}
                </td>
                <td className={TD}>
                  <Lencana nilai={l.aksi} />
                </td>
                <td className={`${TD} hidden text-[12.5px] sm:table-cell`}>
                  {l.entitas}
                  {l.entitas_id ? ` #${l.entitas_id}` : ""}
                </td>
                <td className={`${TD} hidden text-[12.5px] text-redup lg:table-cell`}>
                  {l.ringkasan ?? "—"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {!memuat && baris.length > 0 && (
        <p className="text-[12px] text-redup">
          Menampilkan {baris.length} catatan terakhir.
        </p>
      )}
    </div>
  );
}
