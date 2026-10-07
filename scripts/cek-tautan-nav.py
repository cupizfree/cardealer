#!/usr/bin/env python3
"""Periksa setiap tautan di navigasi: apakah halamannya benar-benar berubah?

Dua jenis cacat yang dicari, dan keduanya tidak terlihat dari `tsc`/build:

  1. MATI — rutenya 404.
  2. PASTI-SAMA — rutenya 200, tetapi isinya byte-identik dengan halaman dasar.
     Ini yang paling menipu: tautan "SUV" tampak berfungsi, halamannya terbuka,
     padahal menampilkan seluruh unit tanpa disaring. Filter `?tipe=`/`?harga=`/
     `?merek=` belum diproses halaman listing.

Pakai:  python3 scripts/cek-tautan-nav.py [basis-url]
"""

from __future__ import annotations

import re
import sys
import urllib.error
import urllib.request
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent
BASIS = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100").rstrip("/")
MENU = AKAR / "src" / "data" / "menu.ts"


def ambil(jalur: str) -> tuple[int, int]:
    """-> (status, jumlah byte tanpa <script>)."""
    try:
        with urllib.request.urlopen(BASIS + jalur, timeout=30) as r:
            h = r.read().decode("utf-8", "ignore")
            status = r.status
    except urllib.error.HTTPError as e:
        return e.code, 0
    except Exception:  # noqa: BLE001
        return 0, 0
    h = re.sub(r"<script\b.*?</script>", " ", h, flags=re.S | re.I)
    return status, len(h)


def tautan_nav() -> list[tuple[str, str]]:
    """[(label, href)] dari menu.ts — label diambil dari baris yang sama."""
    teks = MENU.read_text(encoding="utf-8")
    hasil = []
    for m in re.finditer(r'\{\s*label:\s*"([^"]+)",\s*href:\s*"([^"]+)"', teks):
        hasil.append((m.group(1), m.group(2)))
    return hasil


def main() -> int:
    tautan = tautan_nav()
    if not tautan:
        print("  tidak ada tautan terbaca dari menu.ts")
        return 1

    # Halaman dasar untuk membandingkan "pasti-sama".
    dasar_status, dasar_byte = ambil("/listing-grid3-columns")
    print(f"  dasar /listing-grid3-columns -> {dasar_status}, {dasar_byte} byte")
    print()

    mati: list[tuple[str, str]] = []
    sama: list[tuple[str, str]] = []
    hidup: list[tuple[str, str]] = []

    print(f"  {'label':<34} {'status':>6} {'byte':>8}  {'href'}")
    print("  " + "─" * 96)
    for label, href in tautan:
        status, byte = ambil(href)
        if status == 0 or status >= 400:
            tanda = "MATI"
            mati.append((label, href))
        elif href.startswith("/listing-grid") and byte == dasar_byte:
            tanda = "PASTI-SAMA"
            sama.append((label, href))
        else:
            tanda = "ok"
            hidup.append((label, href))
        print(f"  {label[:32]:<34} {status:>6} {byte:>8}  {tanda:<12} {href}")

    print()
    print("═" * 98)
    print(f"  hidup        : {len(hidup)}")
    print(f"  pasti-sama   : {len(sama)}  (200 tapi isinya identik — filter belum jalan)")
    print(f"  mati (4xx/5xx): {len(mati)}")
    print("═" * 98)

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
