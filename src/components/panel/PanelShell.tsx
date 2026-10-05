"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { minta } from "@/lib/klien";

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
    <div className="panel-root">
      <div className="panel-app">
        <aside className="panel-sisi">
          <div className="panel-sisi__merek">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/images/logo-white.png" alt="MARF" />
            <div>
              <strong>MARF</strong>
              <span>{pengguna.peran === "admin" ? "Panel Admin" : "Panel Staff"}</span>
            </div>
          </div>

          <nav className="panel-sisi__nav">
            <div className="panel-sisi__judul">Menu</div>
            {nav.map((b) => {
              const aktif = b.href === "/admin" || b.href === "/staff" ? path === b.href : path.startsWith(b.href);
              return (
                <Link
                  key={b.href}
                  href={b.href}
                  className={`panel-sisi__tautan${aktif ? " panel-sisi__tautan--aktif" : ""}`}
                >
                  <span className="panel-sisi__ikon">{b.ikon}</span>
                  {b.label}
                </Link>
              );
            })}
          </nav>

          <div className="panel-sisi__kaki">
            <div className="panel-sisi__aku">
              <strong>{pengguna.nama}</strong>
              {pengguna.email}
            </div>
            <button className="panel-tombol panel-tombol--kecil" onClick={logout} disabled={keluar} style={{ width: "100%" }}>
              {keluar ? "Keluar…" : "Keluar"}
            </button>
          </div>
        </aside>

        <main className="panel-utama">
          <header className="panel-atas">
            <div>
              <h1>{judul}</h1>
              {ket && <p>{ket}</p>}
            </div>
            <Link href="/" className="panel-tombol panel-tombol--kecil" target="_blank" rel="noreferrer">
              Lihat situs ↗
            </Link>
          </header>

          <div className="panel-isi">{children}</div>
        </main>
      </div>
    </div>
  );
}
