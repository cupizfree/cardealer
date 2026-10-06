#!/usr/bin/env python3
"""Pastikan setiap unit menampilkan FITUR MILIKNYA SENDIRI di halaman publik.

Latar: dulu hanya `allListings[0]` yang punya `features`, dan 14 listing lain
mewarisinya lewat `listing.features ?? template.features!`. Akibatnya semua unit
menampilkan daftar 12 item yang sama — Honda Brio menampilkan velg 16 inci milik
Avanza. Kerusakan ini tidak terlihat dari `tsc` maupun build: halamannya 200,
judulnya benar, fiturnya salah.

Cara memeriksa: sebuah fitur disebut "khas" kalau hanya muncul di SATU unit di
seluruh basis data. Untuk tiap unit, semua fitur khasnya harus muncul di
halamannya, dan tidak satu pun fitur khas unit lain boleh muncul di situ.

Jebakan: jangan memakai fitur yang generik ("Buku servis lengkap" ada di semua
unit). Itu akan melaporkan gagal palsu di setiap unit. Karena itu penyaring
"hanya muncul di satu unit" di atas bukan hiasan — itu inti pemeriksaannya.

Pakai:  python3 scripts/cek-fitur-unit.py [basis-url]
        (bawaan http://127.0.0.1:3100)
"""

from __future__ import annotations

import html as html_mod
import json
import os
import re
import sqlite3
import sys
from collections import defaultdict
from pathlib import Path
from urllib.request import urlopen

AKAR = Path(__file__).resolve().parent.parent
BASIS = sys.argv[1].rstrip("/") if len(sys.argv) > 1 else "http://127.0.0.1:3100"
DB = os.environ.get("MARF_DB_PATH", str(AKAR / ".data" / "marf.db"))
RUTE = "/listing-details"
KATEGORI = ["Exterior", "Interior", "Safety", "Mechanical", "Technology", "Other"]


def baca_unit() -> list[tuple[int, str, str, dict[str, list[str]]]]:
    k = sqlite3.connect(f"file:{DB}?mode=ro", uri=True)
    hasil = []
    for uid, slug, judul, fitur in k.execute(
        "SELECT id, slug, judul, fitur FROM unit WHERE status IN ('tersedia','dipesan') ORDER BY id"
    ):
        try:
            f = json.loads(fitur or "{}")
        except json.JSONDecodeError:
            f = {}
        if isinstance(f, dict):
            hasil.append((uid, slug, judul, f))
    k.close()
    return hasil


def butir_fitur(h: str) -> set[str]:
    """Ambil butir fitur yang benar-benar dirender, sebagai himpunan utuh.

    Bukan pencarian teks biasa. Dua jebakan yang sudah memakan korban:

    1. Next.js menyisipkan seluruh payload RSC ke dalam <script>, dan payload
       itu memuat data katalog lengkap termasuk fitur SEMUA unit. Mencari di
       HTML mentah karena itu selalu melaporkan "fitur unit lain bocor".
    2. Mencari potongan teks dengan `in` menghasilkan bocor palsu, karena satu
       butir bisa menjadi anak kalimat butir lain: "Power window depan" ada di
       dalam "Power window depan dan belakang", dan "MID TFT" ada di dalam
       "MID TFT berwarna".

    Karena itu yang diambil hanya isi <li> di dalam daftar fitur, lalu
    dibandingkan sebagai himpunan butir utuh.
    """
    h = re.sub(r"<script\b.*?</script>", " ", h, flags=re.S | re.I)
    h = re.sub(r"<style\b.*?</style>", " ", h, flags=re.S | re.I)

    butir = set()
    for isi in re.findall(
        r'<li class="flex items-center gap-8"[^>]*>(.*?)</li>', h, flags=re.S | re.I
    ):
        teks = re.sub(r"<[^>]+>", "", isi)
        teks = html_mod.unescape(teks).strip()
        if teks:
            butir.add(teks)
    return butir


def main() -> int:
    unit = baca_unit()
    if not unit:
        print("  TIDAK ADA unit yang dipublikasikan di basis data.")
        return 1

    # Fitur yang hanya muncul di satu unit.
    pemilik: dict[str, set[int]] = defaultdict(set)
    for uid, _, _, f in unit:
        for kat in KATEGORI:
            for item in f.get(kat, []):
                pemilik[item].add(uid)

    khas: dict[int, set[str]] = defaultdict(set)
    for item, ids in pemilik.items():
        if len(ids) == 1:
            khas[next(iter(ids))].add(item)

    print(f"  {len(unit)} unit dipublikasikan · {len(pemilik)} fitur unik · {sum(len(v) for v in khas.values())} fitur khas")
    print()

    gagal: list[tuple[str, str]] = []
    for uid, slug, judul, f in unit:
        jumlah = sum(len(f.get(kat, [])) for kat in KATEGORI)
        if jumlah == 0:
            gagal.append((slug, "tidak punya fitur sama sekali"))
            print(f"  {uid:>3}  KOSONG    {judul}")
            continue

        try:
            mentah = urlopen(f"{BASIS}{RUTE}/{slug}", timeout=25).read().decode("utf-8", "ignore")
        except Exception as e:  # noqa: BLE001
            gagal.append((slug, f"gagal diambil: {e}"))
            print(f"  {uid:>3}  GAGAL     {judul}")
            continue

        h = butir_fitur(mentah)
        if not h:
            gagal.append((slug, "tidak ada butir fitur yang dirender"))
            print(f"  {uid:>3}  TIDAK RENDER  {judul}")
            continue

        milikku = khas.get(uid, set())
        hilang = sorted(i for i in milikku if i not in h)
        asing = sorted(
            i
            for other, items in khas.items()
            if other != uid
            for i in items
            if i in h
        )
        ok = not hilang and not asing
        if not ok:
            alasan = []
            if hilang:
                alasan.append(f"{len(hilang)} fitur sendiri hilang: {hilang[:2]}")
            if asing:
                alasan.append(f"{len(asing)} fitur unit lain bocor: {asing[:2]}")
            gagal.append((slug, "; ".join(alasan)))

        print(
            f"  {uid:>3}  {'ok' if ok else 'MASALAH':<9} "
            f"fitur={jumlah:<3} khas={len(milikku):<3} hilang={len(hilang):<3} bocor={len(asing):<3} {judul[:32]}"
        )

    print()
    print("═" * 74)
    print(f"  {len(unit) - len(gagal)}/{len(unit)} unit menampilkan fitur miliknya sendiri")
    print("═" * 74)
    if gagal:
        print()
        for s, a in gagal:
            print(f"    {s}: {a}")
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
