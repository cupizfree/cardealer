"use client";

import { useEffect, useState } from "react";
import { minta, waktu } from "@/lib/klien";

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

  if (galat) return <p className="panel-galat">{galat}</p>;
  if (memuat) return <p className="panel-kosong">Memuat jejak aktivitas…</p>;

  return (
    <>
      <p className="panel-kartu__ket" style={{ marginBottom: 14 }}>
        Delapan catatan terakhir. Setiap perubahan pada unit, dealer, prospek, dan pengguna
        tercatat otomatis di sini.
      </p>

      <div className="panel-tabel-bungkus">
        <table className="panel-tabel">
          <thead>
            <tr>
              <th>Waktu</th>
              <th>Pelaku</th>
              <th>Aksi</th>
              <th>Objek</th>
              <th>Keterangan</th>
            </tr>
          </thead>
          <tbody>
            {baris.length === 0 && (
              <tr><td colSpan={5} className="panel-kosong">Belum ada aktivitas tercatat.</td></tr>
            )}
            {baris.map((l) => (
              <tr key={l.id}>
                <td style={{ fontSize: 12.5, whiteSpace: "nowrap" }}>{waktu(l.dibuat_pada)}</td>
                <td>{l.nama_pengguna ?? <span style={{ color: "var(--redup)" }}>publik</span>}</td>
                <td>
                  <span className="panel-lencana panel-lencana--draf" style={{ textTransform: "capitalize" }}>
                    {l.aksi}
                  </span>
                </td>
                <td style={{ fontSize: 12.5 }}>
                  {l.entitas}
                  {l.entitas_id ? ` #${l.entitas_id}` : ""}
                </td>
                <td style={{ fontSize: 12.5, color: "var(--redup)" }}>{l.ringkasan ?? "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
