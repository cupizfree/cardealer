"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { minta, rupiah } from "@/lib/klien";

type Unit = {
  id: number;
  slug: string;
  judul: string;
  merek: string;
  tahun: number | null;
  harga: number;
  kilometer: string | null;
  transmisi: string | null;
  status: string;
  unggulan: boolean;
  diubah_pada: string;
};

const STATUS = ["draf", "tersedia", "dipesan", "terjual"];

export default function DaftarUnit({ peran }: { peran: "admin" | "staff" }) {
  const [baris, setBaris] = useState<Unit[]>([]);
  const [total, setTotal] = useState(0);
  const [merek, setMerek] = useState<string[]>([]);
  const [q, setQ] = useState("");
  const [fMerek, setFMerek] = useState("");
  const [fStatus, setFStatus] = useState("");
  const [urut, setUrut] = useState("terbaru");
  const [halaman, setHalaman] = useState(1);
  const [memuat, setMemuat] = useState(true);
  const [galat, setGalat] = useState<string | null>(null);
  const [pesan, setPesan] = useState<string | null>(null);
  const batas = 10;

  const muat = useCallback(async () => {
    setMemuat(true);
    const s = new URLSearchParams({ halaman: String(halaman), batas: String(batas), urut });
    if (q) s.set("q", q);
    if (fMerek) s.set("merek", fMerek);
    if (fStatus) s.set("status", fStatus);

    const h = await minta<Unit[]>(`/api/unit?${s}`);
    if (h.ok) {
      setBaris(h.data);
      setTotal(Number(h.meta?.total ?? 0));
      setMerek((h.meta?.merek as string[]) ?? []);
      setGalat(null);
    } else {
      setGalat(h.pesan);
    }
    setMemuat(false);
  }, [halaman, q, fMerek, fStatus, urut]);

  useEffect(() => {
    muat();
  }, [muat]);

  async function ubahStatus(id: number, status: string) {
    setPesan(null);
    const h = await minta(`/api/unit/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    if (h.ok) {
      setPesan(`Status unit #${id} diubah jadi ${status}.`);
      muat();
    } else {
      setGalat(h.pesan);
    }
  }

  async function hapus(id: number, judul: string) {
    if (!confirm(`Hapus unit "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setPesan(null);
    const h = await minta(`/api/unit/${id}`, { method: "DELETE" });
    if (h.ok) {
      setPesan(`Unit "${judul}" dihapus.`);
      muat();
    } else {
      setGalat(h.pesan);
    }
  }

  const halamanTotal = Math.max(1, Math.ceil(total / batas));

  return (
    <>
      {galat && <p className="panel-galat">{galat}</p>}
      {pesan && <p className="panel-sukses">{pesan}</p>}

      <div className="panel-alat">
        <input
          placeholder="Cari judul, merek, atau model…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setHalaman(1);
          }}
        />

        <select value={fMerek} onChange={(e) => { setFMerek(e.target.value); setHalaman(1); }}>
          <option value="">Semua merek</option>
          {merek.map((m) => (
            <option key={m} value={m}>{m}</option>
          ))}
        </select>

        <select value={fStatus} onChange={(e) => { setFStatus(e.target.value); setHalaman(1); }}>
          <option value="">Semua status</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </select>

        <select value={urut} onChange={(e) => { setUrut(e.target.value); setHalaman(1); }}>
          <option value="terbaru">Terbaru</option>
          <option value="termurah">Termurah</option>
          <option value="termahal">Termahal</option>
          <option value="tahun">Tahun terbaru</option>
          <option value="judul">Judul A–Z</option>
        </select>

        <span className="panel-alat__dorong" style={{ fontSize: 12.5, color: "var(--redup)" }}>
          {total} unit
        </span>

        {peran === "admin" && (
          <Link href="/admin/unit/baru" className="panel-tombol panel-tombol--utama panel-tombol--kecil">
            + Tambah unit
          </Link>
        )}
      </div>

      <div className="panel-tabel-bungkus">
        <table className="panel-tabel">
          <thead>
            <tr>
              <th>Unit</th>
              <th>Tahun</th>
              <th>Kilometer</th>
              <th>Transmisi</th>
              <th style={{ textAlign: "right" }}>Harga</th>
              <th>Status</th>
              <th style={{ textAlign: "right" }}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {memuat && baris.length === 0 && (
              <tr>
                <td colSpan={7} className="panel-kosong">Memuat unit…</td>
              </tr>
            )}

            {!memuat && baris.length === 0 && (
              <tr>
                <td colSpan={7} className="panel-kosong">
                  Tidak ada unit yang cocok dengan filter ini.
                </td>
              </tr>
            )}

            {baris.map((u) => (
              <tr key={u.id}>
                <td>
                  <strong>{u.judul}</strong>
                  {u.unggulan && (
                    <span className="panel-lencana panel-lencana--baru" style={{ marginLeft: 7 }}>
                      unggulan
                    </span>
                  )}
                  <div style={{ fontSize: 11.5, color: "var(--redup)" }}>{u.slug}</div>
                </td>
                <td>{u.tahun ?? "—"}</td>
                <td>{u.kilometer ?? "—"}</td>
                <td>{u.transmisi ?? "—"}</td>
                <td style={{ textAlign: "right", fontWeight: 600, whiteSpace: "nowrap" }}>{rupiah(u.harga)}</td>
                <td>
                  <select
                    value={u.status}
                    onChange={(e) => ubahStatus(u.id, e.target.value)}
                    className="panel-lencana"
                    style={{
                      border: "1px solid var(--garis)",
                      cursor: "pointer",
                      padding: "4px 7px",
                      fontFamily: "inherit",
                    }}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <div className="panel-tabel__aksi">
                    {peran === "admin" && (
                      <Link href={`/admin/unit/${u.id}`} className="panel-tombol panel-tombol--kecil">
                        Ubah
                      </Link>
                    )}
                    {peran === "admin" && (
                      <button
                        className="panel-tombol panel-tombol--kecil panel-tombol--bahaya"
                        onClick={() => hapus(u.id, u.judul)}
                      >
                        Hapus
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {halamanTotal > 1 && (
        <div className="panel-aksi" style={{ marginTop: 16, justifyContent: "center" }}>
          <button
            className="panel-tombol panel-tombol--kecil"
            disabled={halaman <= 1}
            onClick={() => setHalaman((n) => n - 1)}
          >
            ← Sebelumnya
          </button>
          <span style={{ fontSize: 12.5, color: "var(--redup)" }}>
            Halaman {halaman} dari {halamanTotal}
          </span>
          <button
            className="panel-tombol panel-tombol--kecil"
            disabled={halaman >= halamanTotal}
            onClick={() => setHalaman((n) => n + 1)}
          >
            Berikutnya →
          </button>
        </div>
      )}
    </>
  );
}
