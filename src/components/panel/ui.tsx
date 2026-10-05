// Primitif UI panel — dipakai bersama semua halaman.
// Semua kelas Tailwind ditulis UTUH (bukan dirangkai dari potongan) supaya
// pemindai Tailwind bisa menemukannya saat build CSS.

import type { ReactNode } from "react";

// ── Tombol ─────────────────────────────────────────────────────────────────

const DASAR =
  "inline-flex items-center justify-center gap-1.5 rounded-lg px-3.5 py-2 text-[13.5px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-55";

export const TOMBOL = `${DASAR} border border-garis bg-white text-tinta hover:border-[#d3d8e0] hover:bg-[#f7f8fa]`;
export const TOMBOL_UTAMA = `${DASAR} border border-marf bg-marf text-white hover:border-marf-tua hover:bg-marf-tua`;
export const TOMBOL_BAHAYA = `${DASAR} border border-marf-garis bg-white text-marf hover:bg-marf-muda`;
export const TOMBOL_HALUS = `${DASAR} border border-transparent bg-transparent text-redup hover:bg-[#f2f4f7] hover:text-tinta`;
export const TOMBOL_KECIL = "px-2.5 py-1.5 text-[12.5px]";

export const KARTU =
  "rounded-kartu border border-garis bg-white p-5 shadow-[0_1px_2px_rgba(16,24,40,0.04)]";

// ── Kartu ──────────────────────────────────────────────────────────────────

export function Kartu({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`${KARTU} ${className}`}>{children}</section>;
}

export function JudulKartu({ judul, ket }: { judul: string; ket?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-[14.5px] font-bold tracking-tight">{judul}</h2>
      {ket && <p className="mt-0.5 text-[12.5px] text-redup">{ket}</p>}
    </div>
  );
}

// ── Lencana status ─────────────────────────────────────────────────────────

const LENCANA_DASAR =
  "inline-block whitespace-nowrap rounded-full px-2.5 py-[3px] text-[11px] font-bold tracking-wide";

const WARNA: Record<string, string> = {
  // status unit
  tersedia: "bg-hijau-muda text-[#0b7a45]",
  dipesan: "bg-kuning-muda text-[#96660f]",
  terjual: "bg-[#eceef1] text-[#5b6472]",
  draf: "bg-[#eef0f3] text-redup",
  // status prospek
  baru: "bg-marf-muda text-marf-tua",
  dihubungi: "bg-biru-muda text-[#1d4ed8]",
  terjadwal: "bg-ungu-muda text-ungu",
  selesai: "bg-hijau-muda text-[#0b7a45]",
  batal: "bg-[#f0f1f3] text-redup",
  // peran
  admin: "bg-marf-muda text-marf-tua",
  staff: "bg-biru-muda text-[#1d4ed8]",
  // aksi jejak aktivitas
  buat: "bg-hijau-muda text-[#0b7a45]",
  ubah: "bg-biru-muda text-[#1d4ed8]",
  hapus: "bg-marf-muda text-marf-tua",
  masuk: "bg-[#eef0f3] text-[#5b6472]",
  keluar: "bg-[#eef0f3] text-[#5b6472]",
  kirim: "bg-marf-muda text-marf-tua",
  seed: "bg-ungu-muda text-ungu",
  publik: "bg-[#eef0f3] text-redup",
};

export function Lencana({ nilai, className = "" }: { nilai: string; className?: string }) {
  return (
    <span className={`${LENCANA_DASAR} ${WARNA[nilai] ?? "bg-[#eef0f3] text-redup"} ${className}`}>
      {nilai}
    </span>
  );
}

// ── Kartu statistik ────────────────────────────────────────────────────────

const AKSEN: Record<string, string> = {
  marf: "before:bg-marf",
  hijau: "before:bg-hijau",
  biru: "before:bg-biru",
  kuning: "before:bg-kuning",
  ungu: "before:bg-ungu",
};

export function Stat({
  label,
  angka,
  kaki,
  aksen = "marf",
  kecil = false,
}: {
  label: string;
  angka: ReactNode;
  kaki?: ReactNode;
  aksen?: "marf" | "hijau" | "biru" | "kuning" | "ungu";
  kecil?: boolean;
}) {
  return (
    <div
      className={`relative overflow-hidden rounded-kartu border border-garis bg-white px-5 py-[18px] shadow-[0_1px_2px_rgba(16,24,40,0.04)] before:absolute before:inset-y-0 before:left-0 before:w-[3px] ${AKSEN[aksen]}`}
    >
      <p className="mb-2 text-[11.5px] font-bold uppercase tracking-[0.07em] text-redup">{label}</p>
      <p
        className={`font-extrabold leading-tight tracking-tight ${kecil ? "text-[21px]" : "text-[27px]"}`}
      >
        {angka}
      </p>
      {kaki && <p className="mt-1.5 text-[12px] text-redup">{kaki}</p>}
    </div>
  );
}

// ── Tabel ──────────────────────────────────────────────────────────────────

export const TABEL_BUNGKUS = "overflow-x-auto rounded-kartu border border-garis bg-white";

export const TABEL = "w-full text-[13.5px]";

export const TH =
  "whitespace-nowrap border-b border-garis bg-[#fafbfc] px-3.5 py-[11px] text-left text-[11px] font-bold uppercase tracking-[0.06em] text-redup";

export const TD = "border-b border-garis-2 px-3.5 py-3 align-middle";

export function BarisKosong({ kolom, children }: { kolom: number; children: ReactNode }) {
  return (
    <tr>
      <td colSpan={kolom} className="px-5 py-11 text-center text-[13.5px] text-redup">
        {children}
      </td>
    </tr>
  );
}

export function BarisMemuat({ kolom, apa }: { kolom: number; apa: string }) {
  return (
    <tr>
      <td colSpan={kolom} className="px-5 py-11 text-center text-[13.5px] text-redup">
        <span className="inline-flex items-center gap-2.5">
          <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-garis border-t-marf" />
          Memuat {apa}…
        </span>
      </td>
    </tr>
  );
}

// ── Medan isian ────────────────────────────────────────────────────────────

export const INPUT =
  "w-full rounded-lg border border-garis bg-white px-3 py-2.5 text-sm text-tinta outline-none transition placeholder:text-[#9aa1ad] focus:border-marf focus:ring-[3px] focus:ring-marf/15";

/* Dropdown filter. Sengaja memakai padding dan ukuran teks yang sama dengan
   INPUT supaya tingginya sejajar di baris filter — sebelumnya select memakai
   `py-2 text-[13px]` sehingga 2px lebih tinggi daripada kotak pencarian. */
export const SELECT = INPUT;

export function Medan({
  label,
  children,
  wajib = false,
}: {
  label: string;
  children: ReactNode;
  wajib?: boolean;
}) {
  return (
    <label className="mb-3.5 block">
      <span className="mb-1.5 block text-[12.5px] font-semibold text-[#3b4250]">
        {label}
        {wajib && <span className="text-marf"> *</span>}
      </span>
      {children}
    </label>
  );
}

export function Pesan({ jenis, children }: { jenis: "galat" | "sukses"; children: ReactNode }) {
  const gaya =
    jenis === "galat"
      ? "border-marf-garis bg-marf-muda text-marf-tua"
      : "border-[#b9e3ce] bg-hijau-muda text-[#0b7a45]";
  return (
    <p className={`mb-3.5 rounded-lg border px-3.5 py-2.5 text-[13px] ${gaya}`}>{children}</p>
  );
}

// ── Judul halaman di dalam isi ─────────────────────────────────────────────

export function Petunjuk({ children }: { children: ReactNode }) {
  return <p className="mb-4 text-[12.5px] text-redup">{children}</p>;
}

export function KisiKartu({ children, lebar = 215 }: { children: ReactNode; lebar?: number }) {
  return (
    <div
      className="grid gap-4"
      style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${lebar}px, 1fr))` }}
    >
      {children}
    </div>
  );
}
