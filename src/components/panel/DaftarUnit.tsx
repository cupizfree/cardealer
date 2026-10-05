"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { minta, rupiah } from "@/lib/klien";
import {
  BarisKosong,
  BarisMemuat,
  INPUT,
  Pesan,
  SELECT,
  TABEL,
  TABEL_BUNGKUS,
  TD,
  TH,
  TOMBOL,
  TOMBOL_BAHAYA,
  TOMBOL_KECIL,
  TOMBOL_UTAMA,
} from "./ui";

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

// Select status berwarna sesuai nilainya — supaya status langsung terbaca
// dari tabel tanpa harus membuka apa pun.
const WARNA_SELECT: Record<string, string> = {
  tersedia: "border-[#b9e3ce] bg-hijau-muda text-[#0b7a45]",
  dipesan: "border-[#f0dcb4] bg-kuning-muda text-[#96660f]",
  terjual: "border-[#d8dce2] bg-[#eceef1] text-[#5b6472]",
  draf: "border-[#e0e3e8] bg-[#eef0f3] text-redup",
};

const KECIL =
  "rounded-lg border px-2.5 py-1.5 text-[11.5px] font-bold tracking-wide outline-none transition focus:ring-[3px] focus:ring-marf/15";

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
    setGalat(null);
    const h = await minta(`/api/unit/${id}`, { method: "PATCH", body: JSON.stringify({ status }) });
    if (h.ok) {
      setPesan(`Status unit #${id} diubah jadi ${status}.`);
      muat();
    } else {
      setGalat(h.pesan);
      muat();
    }
  }

  async function hapus(id: number, judul: string) {
    if (!confirm(`Hapus unit "${judul}"? Tindakan ini tidak bisa dibatalkan.`)) return;
    setPesan(null);
    setGalat(null);
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
    <div className="space-y-4">
      {galat && <Pesan jenis="galat">{galat}</Pesan>}
      {pesan && <Pesan jenis="sukses">{pesan}</Pesan>}

      {/* Grid, bukan flex: dengan flex, kotak pencarian terbatas `max-w-xs`
          (320px) sementara ketiga dropdown melebar penuh 1135px — baris filter
          jadi timpang. Grid memberi pencarian 2 bagian dan tiap dropdown 1
          bagian, sehingga semuanya sejajar. Di mobile menumpuk satu kolom. */}
      <div className="grid gap-2.5 sm:grid-cols-2 lg:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))]">
        <input
          className={`${INPUT} sm:col-span-2 lg:col-span-1`}
          placeholder="Cari judul, merek, atau model…"
          value={q}
          onChange={(e) => {
            setQ(e.target.value);
            setHalaman(1);
          }}
        />

        <select
          className={SELECT}
          value={fMerek}
          onChange={(e) => {
            setFMerek(e.target.value);
            setHalaman(1);
          }}
        >
          <option value="">Semua merek</option>
          {merek.map((m) => (
            <option key={m} value={m}>
              {m}
            </option>
          ))}
        </select>

        <select
          className={SELECT}
          value={fStatus}
          onChange={(e) => {
            setFStatus(e.target.value);
            setHalaman(1);
          }}
        >
          <option value="">Semua status</option>
          {STATUS.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>

        <select
          className={SELECT}
          value={urut}
          onChange={(e) => {
            setUrut(e.target.value);
            setHalaman(1);
          }}
        >
          <option value="terbaru">Terbaru</option>
          <option value="termurah">Termurah</option>
          <option value="termahal">Termahal</option>
          <option value="tahun">Tahun terbaru</option>
          <option value="judul">Judul A–Z</option>
        </select>

        <span className="ml-auto text-[12.5px] font-medium text-redup">{total} unit</span>

        {peran === "admin" && (
          <Link href="/admin/unit/baru" className={`${TOMBOL_UTAMA} ${TOMBOL_KECIL}`}>
            + Tambah unit
          </Link>
        )}
      </div>

      <div className={TABEL_BUNGKUS}>
        <table className={TABEL}>
          <thead>
            <tr>
              <th className={TH}>Unit</th>
              <th className={TH}>Tahun</th>
              <th className={`${TH} hidden md:table-cell`}>Kilometer</th>
              <th className={`${TH} hidden lg:table-cell`}>Transmisi</th>
              <th className={`${TH} text-right`}>Harga</th>
              <th className={TH}>Status</th>
              <th className={`${TH} text-right`}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {memuat && baris.length === 0 && <BarisMemuat kolom={7} apa="unit" />}

            {!memuat && baris.length === 0 && (
              <BarisKosong kolom={7}>Tidak ada unit yang cocok dengan filter ini.</BarisKosong>
            )}

            {baris.map((u) => (
              <tr key={u.id} className="transition hover:bg-[#fcfcfd]">
                <td className={TD}>
                  <div className="flex items-center gap-2">
                    <strong className="font-semibold">{u.judul}</strong>
                    {u.unggulan && (
                      <span className="whitespace-nowrap rounded-full bg-marf-muda px-2 py-[2px] text-[10px] font-bold uppercase tracking-wide text-marf-tua">
                        unggulan
                      </span>
                    )}
                  </div>
                  <div className="marf-pecah text-[11.5px] text-redup">{u.slug}</div>
                </td>
                <td className={`${TD} tabular-nums`}>{u.tahun ?? "—"}</td>
                <td className={`${TD} hidden md:table-cell`}>{u.kilometer ?? "—"}</td>
                <td className={`${TD} hidden lg:table-cell`}>{u.transmisi ?? "—"}</td>
                <td className={`${TD} whitespace-nowrap text-right font-semibold tabular-nums`}>
                  {rupiah(u.harga)}
                </td>
                <td className={TD}>
                  <select
                    value={u.status}
                    onChange={(e) => ubahStatus(u.id, e.target.value)}
                    aria-label={`Status ${u.judul}`}
                    className={`${KECIL} ${WARNA_SELECT[u.status] ?? WARNA_SELECT.draf} cursor-pointer`}
                  >
                    {STATUS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </select>
                </td>
                <td className={TD}>
                  <div className="flex flex-wrap justify-end gap-1.5">
                    {peran === "admin" && (
                      <Link href={`/admin/unit/${u.id}`} className={`${TOMBOL} ${TOMBOL_KECIL}`}>
                        Ubah
                      </Link>
                    )}
                    {peran === "admin" && (
                      <button
                        className={`${TOMBOL_BAHAYA} ${TOMBOL_KECIL}`}
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
        <div className="flex items-center justify-center gap-3">
          <button
            className={`${TOMBOL} ${TOMBOL_KECIL}`}
            disabled={halaman <= 1}
            onClick={() => setHalaman((n) => n - 1)}
          >
            ← Sebelumnya
          </button>
          <span className="text-[12.5px] font-medium text-redup">
            Halaman {halaman} dari {halamanTotal}
          </span>
          <button
            className={`${TOMBOL} ${TOMBOL_KECIL}`}
            disabled={halaman >= halamanTotal}
            onClick={() => setHalaman((n) => n + 1)}
          >
            Berikutnya →
          </button>
        </div>
      )}
    </div>
  );
}
