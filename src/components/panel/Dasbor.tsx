"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { minta, rupiah, waktu } from "@/lib/klien";

type Stat = {
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
  prospekPanas: { id: number; nama: string; telepon: string | null; sumber: string; status: string; dibuat_pada: string }[];
  dealerTeratas: { id: number; nama: string; jumlah: number }[];
  logTerakhir: { id: number; aksi: string; entitas: string; ringkasan: string | null; nama_pengguna: string | null; dibuat_pada: string }[];
};

export default function Dasbor({ peran }: { peran: "admin" | "staff" }) {
  const [d, setD] = useState<Stat | null>(null);
  const [galat, setGalat] = useState<string | null>(null);
  const [memuat, setMemuat] = useState(true);

  const muat = useCallback(async () => {
    setMemuat(true);
    const h = await minta<Stat>("/api/statistik");
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

  if (memuat && !d) return <p className="panel-kosong">Memuat ringkasan…</p>;
  if (galat) return <p className="panel-galat">{galat}</p>;
  if (!d) return null;

  const prospekBaru = d.prospek.baru ?? 0;
  const prospekAktif = prospekBaru + (d.prospek.dihubungi ?? 0) + (d.prospek.terjadwal ?? 0);

  return (
    <>
      <div className="panel-kisi panel-kisi--4" style={{ marginBottom: 18 }}>
        <div className="panel-stat">
          <p className="panel-stat__label">Unit Tersedia</p>
          <p className="panel-stat__angka">{d.angka.unitTersedia}</p>
          <p className="panel-stat__kaki">
            dari {d.angka.totalUnit} unit · {d.angka.unitTerjual} terjual
          </p>
        </div>

        <div className="panel-stat panel-stat--kuning">
          <p className="panel-stat__label">Prospek Baru</p>
          <p className="panel-stat__angka">{prospekBaru}</p>
          <p className="panel-stat__kaki">{prospekAktif} sedang ditangani</p>
        </div>

        <div className="panel-stat panel-stat--biru">
          <p className="panel-stat__label">Nilai Persediaan</p>
          <p className="panel-stat__angka" style={{ fontSize: 21 }}>
            {rupiah(d.angka.nilaiPersediaan)}
          </p>
          <p className="panel-stat__kaki">total harga unit tersedia</p>
        </div>

        <div className="panel-stat panel-stat--hijau">
          <p className="panel-stat__label">{peran === "admin" ? "Pengguna Aktif" : "Dealer Rekanan"}</p>
          <p className="panel-stat__angka">{peran === "admin" ? d.angka.totalPengguna : d.angka.totalDealer}</p>
          <p className="panel-stat__kaki">
            {peran === "admin" ? `${d.angka.totalDealer} dealer aktif` : "showroom terdaftar"}
          </p>
        </div>
      </div>

      <div className="panel-kisi panel-kisi--2">
        <section className="panel-kartu">
          <h2 className="panel-kartu__judul">Prospek yang Perlu Ditindak</h2>
          <p className="panel-kartu__ket">Kiriman terbaru yang belum selesai</p>

          {d.prospekPanas.length === 0 ? (
            <p className="panel-kosong">Belum ada prospek masuk.</p>
          ) : (
            <div className="panel-tabel-bungkus" style={{ border: "none" }}>
              <table className="panel-tabel">
                <tbody>
                  {d.prospekPanas.map((p) => (
                    <tr key={p.id}>
                      <td>
                        <strong>{p.nama}</strong>
                        <div style={{ fontSize: 12, color: "var(--redup)" }}>{p.telepon ?? "tanpa telepon"}</div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className={`panel-lencana panel-lencana--${p.status}`}>{p.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="panel-aksi">
            <Link href={peran === "admin" ? "/admin/prospek" : "/staff/prospek"} className="panel-tombol panel-tombol--kecil">
              Buka prospek
            </Link>
          </div>
        </section>

        <section className="panel-kartu">
          <h2 className="panel-kartu__judul">Unit Terbaru</h2>
          <p className="panel-kartu__ket">Lima unit yang paling baru dimasukkan</p>

          {d.unitTerbaru.length === 0 ? (
            <p className="panel-kosong">Belum ada unit.</p>
          ) : (
            <div className="panel-tabel-bungkus" style={{ border: "none" }}>
              <table className="panel-tabel">
                <tbody>
                  {d.unitTerbaru.map((u) => (
                    <tr key={u.id}>
                      <td>
                        <strong>{u.judul}</strong>
                        <div style={{ fontSize: 12, color: "var(--redup)" }}>{rupiah(u.harga)}</div>
                      </td>
                      <td style={{ textAlign: "right" }}>
                        <span className={`panel-lencana panel-lencana--${u.status}`}>{u.status}</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="panel-aksi">
            <Link href={peran === "admin" ? "/admin/unit" : "/staff/unit"} className="panel-tombol panel-tombol--kecil">
              Buka unit
            </Link>
            {peran === "admin" && (
              <Link href="/admin/unit/baru" className="panel-tombol panel-tombol--utama panel-tombol--kecil">
                + Tambah unit
              </Link>
            )}
          </div>
        </section>

        {peran === "admin" && (
          <>
            <section className="panel-kartu">
              <h2 className="panel-kartu__judul">Dealer dengan Unit Terbanyak</h2>
              <p className="panel-kartu__ket">Sebaran persediaan per showroom</p>

              <div className="panel-tabel-bungkus" style={{ border: "none" }}>
                <table className="panel-tabel">
                  <tbody>
                    {d.dealerTeratas.map((x) => (
                      <tr key={x.id}>
                        <td>{x.nama}</td>
                        <td style={{ textAlign: "right", fontWeight: 700 }}>{x.jumlah} unit</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            <section className="panel-kartu">
              <h2 className="panel-kartu__judul">Aktivitas Terakhir</h2>
              <p className="panel-kartu__ket">Delapan catatan paling baru</p>

              {d.logTerakhir.length === 0 ? (
                <p className="panel-kosong">Belum ada aktivitas.</p>
              ) : (
                <ul style={{ listStyle: "none", margin: 0, padding: 0, fontSize: 13 }}>
                  {d.logTerakhir.map((l) => (
                    <li
                      key={l.id}
                      style={{
                        padding: "9px 0",
                        borderBottom: "1px solid #f0f2f5",
                        display: "flex",
                        justifyContent: "space-between",
                        gap: 12,
                      }}
                    >
                      <span>
                        <strong style={{ textTransform: "capitalize" }}>{l.aksi}</strong>{" "}
                        <span style={{ color: "var(--redup)" }}>{l.ringkasan ?? l.entitas}</span>
                      </span>
                      <span style={{ color: "var(--redup)", fontSize: 11.5, whiteSpace: "nowrap" }}>
                        {waktu(l.dibuat_pada)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          </>
        )}
      </div>
    </>
  );
}
