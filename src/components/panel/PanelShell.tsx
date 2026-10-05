"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { minta } from "@/lib/klien";
import { TOMBOL, TOMBOL_KECIL } from "./ui";

export type PenggunaPanel = {
  id: number;
  email: string;
  nama: string;
  peran: "admin" | "staff";
};

type Butir = { href: string; label: string; ikon: string };

const NAV_ADMIN: Butir[] = [
  { href: "/admin", label: "Dasbor", ikon: "▦" },
  { href: "/admin/unit", label: "Unit Mobil", ikon: "▤" },
  { href: "/admin/dealer", label: "Dealer", ikon: "⌂" },
  { href: "/admin/prospek", label: "Prospek", ikon: "✦" },
  { href: "/admin/pengguna", label: "Pengguna", ikon: "☺" },
  { href: "/admin/log", label: "Jejak Aktivitas", ikon: "≡" },
];

const NAV_STAFF: Butir[] = [
  { href: "/staff", label: "Dasbor", ikon: "▦" },
  { href: "/staff/prospek", label: "Prospek Saya", ikon: "✦" },
  { href: "/staff/unit", label: "Unit Mobil", ikon: "▤" },
];

const JUDUL: Record<string, { judul: string; ket: string }> = {
  "/admin": { judul: "Dasbor Admin", ket: "Ringkasan persediaan, prospek, dan aktivitas" },
  "/admin/unit": { judul: "Unit Mobil", ket: "Kelola persediaan kendaraan showroom" },
  "/admin/unit/baru": { judul: "Tambah Unit", ket: "Masukkan kendaraan baru ke persediaan" },
  "/admin/dealer": { judul: "Dealer", ket: "Daftar showroom rekanan" },
  "/admin/prospek": { judul: "Prospek", ket: "Kiriman dari form situs" },
  "/admin/pengguna": { judul: "Pengguna", ket: "Akun admin dan staff" },
  "/admin/log": { judul: "Jejak Aktivitas", ket: "Catatan perubahan terakhir" },
  "/staff": { judul: "Dasbor Staff", ket: "Prospek dan unit yang jadi tanggung jawab Anda" },
  "/staff/prospek": { judul: "Prospek Saya", ket: "Tindak lanjuti kiriman pelanggan" },
  "/staff/unit": { judul: "Unit Mobil", ket: "Perbarui status ketersediaan unit" },
};

function judulUntuk(path: string): { judul: string; ket: string } {
  if (JUDUL[path]) return JUDUL[path];
  if (path.startsWith("/admin/unit/")) return { judul: "Ubah Unit", ket: "Perbarui rincian kendaraan" };
  if (path.startsWith("/admin/")) return { judul: "Admin", ket: "" };
  if (path.startsWith("/staff/")) return { judul: "Staff", ket: "" };
  return { judul: "Panel", ket: "" };
}

export default function PanelShell({
  pengguna,
  children,
}: {
  pengguna: PenggunaPanel;
  children: React.ReactNode;
}) {
  const path = usePathname();
  const router = useRouter();
  const [keluar, setKeluar] = useState(false);

  const nav = pengguna.peran === "admin" ? NAV_ADMIN : NAV_STAFF;
  const { judul, ket } = judulUntuk(path);

  async function logout() {
    setKeluar(true);
    await minta("/api/auth/logout", { method: "POST" });
    router.replace("/masuk");
    router.refresh();
  }

  return (
    <div className="marf-panel min-h-screen bg-kertas font-sans text-tinta antialiased">
      {/* grid-cols eksplisit untuk mobile: kolom `auto` bawaan `grid` mengambil
          lebar min-content anaknya, dan nav yang berisi tautan `shrink-0`
          melebarkan kolom sampai 616px di layar 390px — header dan isi konten
          ikut terpotong. `minmax(0,1fr)` memaksa kolom menyusut selebar layar. */}
      <div className="grid min-h-screen grid-cols-[minmax(0,1fr)] lg:grid-cols-[248px_1fr]">
        <aside className="flex min-w-0 flex-col bg-ink text-[#e8eaee] lg:sticky lg:top-0 lg:h-screen">
          <div className="flex items-center gap-3 border-b border-white/10 px-4 py-3.5 lg:px-[18px] lg:py-5">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/logo-white.png" alt="MARF" className="h-8 w-auto shrink-0" />
            <div className="min-w-0">
              <strong className="block truncate text-sm font-bold tracking-tight text-white">
                MARF
              </strong>
              <span className="block truncate text-[11px] uppercase tracking-[0.05em] text-[#8b93a1]">
                {pengguna.peran === "admin" ? "Panel Admin" : "Panel Staff"}
              </span>
            </div>
            <button
              onClick={logout}
              disabled={keluar}
              className="ml-auto shrink-0 rounded-lg border border-white/15 px-2.5 py-1.5 text-[12px] font-semibold text-[#c3c9d4] transition hover:bg-white/10 hover:text-white disabled:opacity-50 lg:hidden"
            >
              {keluar ? "…" : "Keluar"}
            </button>
          </div>

          <nav className="flex gap-1 overflow-x-auto px-2 py-2 lg:flex-1 lg:flex-col lg:gap-0.5 lg:overflow-y-auto lg:px-2.5 lg:py-3.5">
            <div className="hidden px-2.5 pb-1.5 pt-3.5 text-[10.5px] font-bold uppercase tracking-[0.09em] text-[#8b93a1] lg:block">
              Menu
            </div>
            {nav.map((b) => {
              const aktif =
                b.href === "/admin" || b.href === "/staff"
                  ? path === b.href
                  : path.startsWith(b.href);
              return (
                <Link
                  key={b.href}
                  href={b.href}
                  className={`flex shrink-0 items-center gap-2.5 rounded-lg px-2.5 py-2 text-[13.5px] font-medium transition ${
                    aktif
                      ? "bg-marf font-semibold text-white"
                      : "text-[#c3c9d4] hover:bg-white/[0.06] hover:text-white"
                  }`}
                >
                  <span className="w-4 text-center text-sm opacity-90">{b.ikon}</span>
                  {b.label}
                </Link>
              );
            })}
          </nav>

          <div className="hidden border-t border-white/10 p-3.5 lg:block">
            <div className="mb-2.5 text-[12px] leading-relaxed text-[#8b93a1]">
              <strong className="block truncate text-[13px] text-white">{pengguna.nama}</strong>
              <span className="block truncate">{pengguna.email}</span>
            </div>
            <button onClick={logout} disabled={keluar} className={`${TOMBOL} ${TOMBOL_KECIL} w-full`}>
              {keluar ? "Keluar…" : "Keluar"}
            </button>
          </div>
        </aside>

        <main className="flex min-w-0 flex-col">
          <header className="sticky top-0 z-20 flex items-center justify-between gap-4 border-b border-garis bg-white px-4 py-3.5 lg:px-[26px]">
            <div className="min-w-0">
              <h1 className="truncate text-[17px] font-bold tracking-tight lg:text-[19px]">
                {judul}
              </h1>
              {ket && (
                <p className="mt-0.5 hidden truncate text-[12.5px] text-redup sm:block">{ket}</p>
              )}
            </div>
            <Link
              href="/"
              target="_blank"
              rel="noreferrer"
              className={`${TOMBOL} ${TOMBOL_KECIL} shrink-0`}
            >
              Lihat situs ↗
            </Link>
          </header>

          <div className="flex-1 px-4 pb-14 pt-5 lg:px-[26px] lg:pb-16 lg:pt-6">{children}</div>
        </main>
      </div>
    </div>
  );
}
