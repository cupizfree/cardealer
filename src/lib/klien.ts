"use client";

// Pembungkus fetch untuk sisi peramban. Semua halaman panel memakai ini,
// jadi penanganan galat dan bentuk balasan seragam di seluruh UI.

export type Balasan<T> =
  | { ok: true; data: T; meta?: Record<string, unknown> }
  | { ok: false; pesan: string; kode: string };

export async function minta<T>(url: string, opsi?: RequestInit): Promise<Balasan<T>> {
  try {
    const r = await fetch(url, {
      ...opsi,
      headers: { "Content-Type": "application/json", ...(opsi?.headers ?? {}) },
      cache: "no-store",
      credentials: "same-origin",
    });

    const j = (await r.json().catch(() => null)) as
      | { ok?: boolean; data?: T; meta?: Record<string, unknown>; error?: { pesan?: string; kode?: string } }
      | null;

    if (!j) {
      return { ok: false, pesan: `Balasan server tidak terbaca (HTTP ${r.status}).`, kode: "BALASAN_KOSONG" };
    }
    if (j.ok) return { ok: true, data: j.data as T, meta: j.meta };
    return {
      ok: false,
      pesan: j.error?.pesan ?? `Permintaan gagal (HTTP ${r.status}).`,
      kode: j.error?.kode ?? "GALAT",
    };
  } catch {
    return { ok: false, pesan: "Tidak bisa menghubungi server.", kode: "JARINGAN" };
  }
}

export const rupiah = (n: number) => `Rp ${new Intl.NumberFormat("id-ID").format(n)}`;

export const tanggal = (s: string | null | undefined) => {
  if (!s) return "—";
  const d = new Date(s.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleDateString("id-ID", { day: "2-digit", month: "short", year: "numeric" });
};

export const waktu = (s: string | null | undefined) => {
  if (!s) return "—";
  const d = new Date(s.replace(" ", "T"));
  if (Number.isNaN(d.getTime())) return s;
  return d.toLocaleString("id-ID", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
};
