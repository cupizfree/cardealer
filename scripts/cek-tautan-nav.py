#!/usr/bin/env python3
"""Periksa setiap tautan di navigasi: apakah halamannya benar-benar berubah?

Dua jenis cacat yang dicari, dan keduanya tidak terlihat dari `tsc`/build:

  1. MATI — rutenya 404.
  2. PASTI-SAMA — rutenya 200, tetapi isinya byte-identik dengan katalog tanpa
     penyaring. Ini yang paling menipu: tautan "SUV" tampak berfungsi,
     halamannya terbuka, padahal menampilkan seluruh unit tanpa disaring.

Daftar tautannya dibaca dari navigasi yang BENAR-BENAR DIRENDER di halaman, bukan
dari `src/data/menu.ts`. Sejak kolom "Jenis Mobil" dan "Merek" dihitung dari stok
(`src/lib/faset.ts`), sebagian besar tautan tidak ada di sumber statis sama
sekali — versi lama skrip ini memindai menu.ts dan karenanya hanya melihat 10 dari
27 tautan, tanpa satu pun peringatan. Membaca DOM berarti tautan yang dibuat saat
render ikut terperiksa.

Pakai:  python3 scripts/cek-tautan-nav.py [basis-url]
"""

from __future__ import annotations

import re
import sys
import urllib.error
import urllib.request

BASIS = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100").rstrip("/")

# Tautan yang dibandingkan byte-nya. Halaman lain tidak dibandingkan karena
# memang tidak punya varian berkueri.
HALAMAN_KATALOG = "/listing-grid3-columns"


def ambil(jalur: str) -> tuple[int, str]:
    """-> (status, html tanpa <script>/<style>)."""
    try:
        with urllib.request.urlopen(BASIS + jalur, timeout=40) as r:
            h = r.read().decode("utf-8", "ignore")
            status = r.status
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception:  # noqa: BLE001
        return 0, ""

    h = re.sub(r"<script\b.*?</script>", " ", h, flags=re.S | re.I)
    h = re.sub(r"<style\b.*?</style>", " ", h, flags=re.S | re.I)
    return status, h


def tautan_nav() -> list[tuple[str, str]]:
    """[(label, href)] dari `<nav id="main-nav">` yang dirender di beranda."""
    status, html = ambil("/")
    if status != 200:
        print(f"  GAGAL  beranda tidak bisa dibuka: {status}")
        return []

    m = re.search(r'<nav id="main-nav"[^>]*>(.*?)</nav>', html, flags=re.S)
    if not m:
        print('  GAGAL  tidak menemukan <nav id="main-nav"> di beranda')
        return []

    blok = m.group(1)
    hasil: list[tuple[str, str]] = []
    terlihat: set[str] = set()

    for a in re.finditer(r'<a[^>]*href="([^"]+)"[^>]*>(.*?)</a>', blok, flags=re.S):
        href = a.group(1).strip()
        if not href or href.startswith("#") or href in terlihat:
            continue
        label = re.sub(r"<[^>]+>", " ", a.group(2))
        label = re.sub(r"\s+", " ", label).strip() or href
        terlihat.add(href)
        hasil.append((label, href))

    return hasil


def main() -> int:
    tautan = tautan_nav()
    if not tautan:
        print("  tidak ada tautan terbaca dari navigasi yang dirender")
        return 1

    dasar_status, dasar = ambil(HALAMAN_KATALOG)
    dasar_byte = len(dasar)
    print(f"  dasar {HALAMAN_KATALOG} -> {dasar_status}, {dasar_byte} byte")
    print(f"  {len(tautan)} tautan terbaca dari <nav id=\"main-nav\">\n")

    mati: list[tuple[str, str]] = []
    sama: list[tuple[str, str]] = []
    hidup: list[tuple[str, str]] = []

    print(f"  {'label':<34} {'status':>6} {'byte':>8}  {'hasil':<12} href")
    print("  " + "─" * 100)
    for label, href in tautan:
        status, html = ambil(href)
        byte = len(html)

        if status == 0 or status >= 400:
            tanda = "MATI"
            mati.append((label, href))
        elif (
            href != HALAMAN_KATALOG
            and href.startswith("/listing-grid")
            and byte == dasar_byte
        ):
            # Halaman dasar sendiri selalu sama dengan dirinya — bukan cacat.
            tanda = "PASTI-SAMA"
            sama.append((label, href))
        else:
            tanda = "ok"
            hidup.append((label, href))
        print(f"  {label[:32]:<34} {status:>6} {byte:>8}  {tanda:<12} {href}")

    print()
    print("═" * 102)
    print(f"  hidup         : {len(hidup)}")
    print(f"  pasti-sama    : {len(sama)}  (200 tapi isinya identik — penyaring tidak jalan)")
    print(f"  mati (4xx/5xx): {len(mati)}")
    print("═" * 102)

    if sama:
        print()
        print("  PASTI-SAMA — tautan ini tampak berfungsi padahal tidak menyaring apa pun:")
        for label, href in sama:
            print(f"    {label}  ->  {href}")
    if mati:
        print()
        print("  MATI:")
        for label, href in mati:
            print(f"    {label}  ->  {href}")

    return 1 if (sama or mati) else 0


if __name__ == "__main__":
    sys.exit(main())
