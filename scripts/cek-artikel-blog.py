#!/usr/bin/env python3
"""Pastikan setiap artikel blog menampilkan ISI SENDIRI, bukan badan artikel lain.

Latar: sebelumnya hanya artikel id 1 yang punya badan tulisan. Dua belas artikel
lain jatuh ke `withBlogPostDetailFallback` di `src/data/blogPosts.ts`, sehingga
halaman berjudul "Cara Memilih Ban Terbaik" menampilkan tulisan tentang SUV
Kompak vs SUV Besar. Kerusakan ini tidak terlihat dari `tsc` maupun build —
halamannya 200, judulnya benar, isinya salah.

Cara memeriksa: ambil potongan khas dari `intro` tiap artikel langsung dari
sumber, lalu pastikan potongan itu MUNCUL di halamannya sendiri dan TIDAK
MUNCUL di halaman artikel lain.

Jebakan yang sudah memakan korban saat memeriksa ini:
  Memeriksa JUDUL akan selalu melaporkan gagal. Widget "Artikel terbaru" di
  sidebar dan `RelatedArticles` menampilkan judul artikel lain di SETIAP
  halaman — itu memang benar. Yang harus diperiksa adalah isi badan tulisan,
  bukan judul.

Pakai:  python3 scripts/cek-artikel-blog.py [basis-url]
        (bawaan http://127.0.0.1:3100)
"""

from __future__ import annotations

import re
import sys
from pathlib import Path
from urllib.request import urlopen

AKAR = Path(__file__).resolve().parent.parent
BASIS = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:3100"
SUMBER = AKAR / "src" / "data" / "blogPosts.ts"
RUTE = "/blog-details-1"


def baca_artikel() -> list[tuple[str, str, str | None]]:
    """[(id, slug, potongan intro)] langsung dari sumber, bukan dari halaman."""
    teks = SUMBER.read_text()
    awal = teks.index("export const allBlogPosts")
    akhir = teks.index("export type BlogPostWithDetail")
    bagian = re.split(r"\n  \{\n    id: (\d+),", teks[awal:akhir])

    hasil: list[tuple[str, str, str | None]] = []
    for i in range(1, len(bagian), 2):
        aid, blok = bagian[i], bagian[i + 1]
        slug_m = re.search(r'slug: "([^"]+)"', blok)
        if not slug_m:
            continue
        intro_m = re.search(r'intro:\s*\n\s*"([^"]{40,})"', blok)
        hasil.append((aid, slug_m.group(1), intro_m.group(1)[:60] if intro_m else None))
    return hasil


def main() -> int:
    artikel = baca_artikel()
    if not artikel:
        print("  TIDAK ADA artikel terbaca dari sumber — periksa regex/berkas.")
        return 1

    print(f"  memeriksa {len(artikel)} artikel di {BASIS}{RUTE}/<slug>")
    print()

    bermasalah: list[tuple[str, str]] = []
    for aid, slug, intro in artikel:
        if not intro:
            bermasalah.append((slug, "tidak punya `intro` di sumber"))
            print(f"  {aid:>3}  TANPA INTRO   {slug}")
            continue
        try:
            h = urlopen(f"{BASIS}{RUTE}/{slug}", timeout=20).read().decode("utf-8", "ignore")
        except Exception as e:  # noqa: BLE001
            bermasalah.append((slug, f"gagal diambil: {e}"))
            print(f"  {aid:>3}  GAGAL         {slug}")
            continue

        sendiri = intro in h
        lain = [s for _, s, i in artikel if s != slug and i and i in h]
        ok = sendiri and not lain
        if not ok:
            alasan = []
            if not sendiri:
                alasan.append("intro sendiri tidak muncul")
            if lain:
                alasan.append(f"menampilkan badan artikel lain: {', '.join(lain[:3])}")
            bermasalah.append((slug, "; ".join(alasan)))

        print(f"  {aid:>3}  {'ok' if ok else 'MASALAH':<9} intro_sendiri={sendiri}  intro_lain={len(lain)}  {slug}")

    print()
    print("═" * 68)
    print(f"  {len(artikel) - len(bermasalah)}/{len(artikel)} artikel menampilkan isinya sendiri")
    print("═" * 68)
    if bermasalah:
        print()
        for s, a in bermasalah:
            print(f"    {s}: {a}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
