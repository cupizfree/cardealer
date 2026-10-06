#!/usr/bin/env python3
"""Isi kolom `fitur` tiap unit dari `src/data/listings.ts`.

Kenapa perlu: situs publik membaca fitur dari kolom `fitur` di basis data, bukan
dari `src/data/listings.ts`. Seed hanya menulis kolom itu sekali, saat basis data
masih kosong. Jadi setelah `FITUR_UNIT` diubah, basis data yang sudah ada tetap
memegang nilai lama sampai disinkronkan lewat skrip ini.

Kenapa tidak sekalian dibaca lewat Node: proyek ini tidak punya `tsx`, `ts-node`,
maupun `esbuild` di `node_modules`, dan `listings.ts` memakai alias `@/`. Parser
baris di bawah karena itu bekerja pada bentuk teks yang dihasilkan tangan dan
sangat teratur — dan hasilnya diverifikasi dulu (jumlah unit, jumlah kategori,
jumlah fitur per kategori) sebelum ada satu baris pun ditulis ke basis data.

Pakai:
  python3 scripts/isi-fitur-unit.py            # tulis ke .data/marf.db
  MARF_DB_PATH=./.data/marf-uji.db python3 scripts/isi-fitur-unit.py
  python3 scripts/isi-fitur-unit.py --kering   # hanya periksa, jangan tulis
"""

from __future__ import annotations

import json
import os
import re
import sqlite3
import sys
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent
SUMBER = AKAR / "src" / "data" / "listings.ts"
KERING = "--kering" in sys.argv

KATEGORI = ["Exterior", "Interior", "Safety", "Mechanical", "Technology", "Other"]

# Unit yang dibuat lewat panel, jadi tidak ada di `allListings` — fiturnya tidak
# bisa diambil dari sumber dan ditulis di sini. Tambahkan di sini kalau ada unit
# panel baru yang perlu diisi.
UNIT_PANEL: dict[str, dict[str, list[str]]] = {
    "daihatsu-terios-r-2020": {
        "Exterior": [
            "Lampu depan LED",
            "Lampu kabut depan",
            "Velg alloy 16 inci",
            "Spion elektrik lipat",
            "Wiper kaca belakang",
            "Spoiler belakang",
            "Roof rail",
        ],
        "Interior": [
            "Kursi 7 penumpang",
            "Jok baris kedua 50:50 split",
            "Jok baris ketiga 50:50 tumble",
            "Power window semua baris",
            "AC double blower",
            "Setir tilt adjust",
            "Konsol tengah",
        ],
        "Safety": [
            "Dual SRS airbag",
            "ABS + EBD",
            "Vehicle Stability Control",
            "Hill Start Assist",
            "ISOFIX",
            "Sensor parkir belakang",
            "Kamera belakang",
            "Immobilizer",
        ],
        "Mechanical": [
            "Mesin 1.5L 2NR-VE Dual VVT-i 105 PS",
            "Transmisi manual 5 percepatan",
            "Penggerak roda belakang",
            "Rem depan cakram, belakang tromol",
            "Suspensi depan MacPherson",
            "Suspensi belakang multilink",
            "Ground clearance 220 mm",
        ],
        "Technology": [
            "Head unit layar sentuh 9 inci",
            "Apple CarPlay dan Android Auto",
            "Bluetooth dan USB",
            "Keyless entry",
            "MID",
            "Kamera belakang",
        ],
        "Other": [
            "Buku servis lengkap",
            "Kunci cadangan",
            "Ban cadangan",
            "Dongkrak dan kunci roda",
            "Dokumen lengkap BPKB dan STNK",
        ],
    },
    "mazda-2-r-2021": {
        "Exterior": [
            "Lampu depan LED dengan auto light",
            "Lampu kabut depan",
            "Velg alloy 16 inci",
            "Spion elektrik lipat otomatis",
            "Wiper kaca belakang",
            "Spoiler belakang",
            "Gril dengan aksen krom",
        ],
        "Interior": [
            "Kursi 5 penumpang berbalut kulit sintetis",
            "Jok baris kedua 60:40 split",
            "Power window semua baris",
            "AC otomatis",
            "Setir tilt dan telescopic",
            "Konsol tengah dengan penutup",
        ],
        "Safety": [
            "Enam SRS airbag",
            "ABS + EBD",
            "Dynamic Stability Control",
            "Traction Control",
            "Hill Start Assist",
            "ISOFIX",
            "Sensor parkir belakang",
            "Kamera belakang",
            "Immobilizer",
        ],
        "Mechanical": [
            "Mesin 1.5L SkyActiv-G 110 PS",
            "Transmisi otomatis 6 percepatan",
            "Penggerak roda depan",
            "Rem depan dan belakang cakram",
            "Suspensi depan MacPherson",
            "Suspensi belakang torsion beam",
            "Paddle shift",
        ],
        "Technology": [
            "Head unit layar sentuh 8 inci",
            "Apple CarPlay dan Android Auto",
            "Bluetooth dan USB",
            "Keyless entry dengan tombol start",
            "Head-up display",
            "MID",
        ],
        "Other": [
            "Buku servis lengkap",
            "Kunci cadangan",
            "Ban cadangan",
            "Dongkrak dan kunci roda",
            "Dokumen lengkap BPKB dan STNK",
        ],
    },
    "hyundai-creta-2023": {
        "Exterior": [
            "Lampu depan LED",
            "Lampu kabut depan LED",
            "Velg alloy 17 inci",
            "Spion elektrik lipat otomatis",
            "Wiper kaca belakang",
            "Spoiler belakang",
            "Roof rail",
            "DRL LED",
        ],
        "Interior": [
            "Kursi 5 penumpang berbalut kulit sintetis",
            "Jok baris kedua 60:40 split",
            "Power window semua baris",
            "AC otomatis dengan ventilasi belakang",
            "Setir tilt dan telescopic",
            "Konsol tengah dengan armrest",
        ],
        "Safety": [
            "Enam SRS airbag",
            "ABS + EBD",
            "Electronic Stability Control",
            "Vehicle Stability Management",
            "Hill Start Assist",
            "Hill Descent Control",
            "ISOFIX",
            "Sensor parkir belakang",
            "Kamera belakang",
            "Tire Pressure Monitoring System",
        ],
        "Mechanical": [
            "Mesin 1.5L Smartstream 115 PS",
            "Transmisi IVT",
            "Penggerak roda depan",
            "Rem depan dan belakang cakram",
            "Suspensi depan MacPherson",
            "Suspensi belakang torsion beam",
            "Ground clearance 190 mm",
        ],
        "Technology": [
            "Head unit layar sentuh 10,25 inci",
            "Apple CarPlay dan Android Auto",
            "Bluetooth dan USB",
            "Keyless entry dengan tombol start",
            "MID TFT 10,25 inci",
            "Cruise control",
        ],
        "Other": [
            "Buku servis lengkap",
            "Kunci cadangan",
            "Ban cadangan",
            "Dongkrak dan kunci roda",
            "Dokumen lengkap BPKB dan STNK",
        ],
    },
}


def baca_peta() -> dict[str, dict[str, list[str]]]:
    """Baca `FITUR_UNIT` dari listings.ts, baris per baris."""
    baris = SUMBER.read_text(encoding="utf-8").split("\n")

    awal = next(
        (i for i, b in enumerate(baris) if b.startswith("export const FITUR_UNIT:")),
        None,
    )
    if awal is None:
        raise SystemExit("  GAGAL: tidak menemukan `export const FITUR_UNIT` di listings.ts")

    peta: dict[str, dict[str, list[str]]] = {}
    slug: str = ""
    kategori: str = ""

    for b in baris[awal + 1 :]:
        if b == "};":
            break
        if m := re.fullmatch(r'  "([^"]+)": \{', b):
            slug, kategori = m.group(1), ""
            peta[slug] = {}
        elif m := re.fullmatch(r"    ([A-Za-z]+): \[", b):
            kategori = m.group(1)
            peta[slug][kategori] = []
        elif (m := re.fullmatch(r'      "(.+)",', b)) and kategori:
            peta[slug][kategori].append(m.group(1))
        elif b == "  },":
            slug, kategori = "", ""

    return peta


def main() -> int:
    peta = baca_peta()
    peta.update(UNIT_PANEL)

    # ── Verifikasi sebelum menulis apa pun ────────────────────────────────
    masalah = []
    if len(peta) != 18:
        masalah.append(f"jumlah unit {len(peta)}, seharusnya 18")
    for slug, kat in peta.items():
        if sorted(kat) != sorted(KATEGORI):
            masalah.append(f"{slug}: kategori tidak lengkap -> {sorted(kat)}")
        for k, isi in kat.items():
            if len(isi) < 5:
                masalah.append(f"{slug}/{k}: hanya {len(isi)} fitur")
    if masalah:
        print("  PARSING GAGAL — tidak ada yang ditulis ke basis data:")
        for m in masalah:
            print(f"    {m}")
        return 1

    db = os.environ.get("MARF_DB_PATH", str(AKAR / ".data" / "marf.db"))
    if not Path(db).exists():
        print(f"  basis data tidak ada: {db}")
        return 1

    k = sqlite3.connect(db)
    baris = {r[0]: (r[1], r[2]) for r in k.execute("SELECT slug, id, judul FROM unit")}

    belum = [s for s in peta if s not in baris]
    if belum:
        print(f"  peringatan: {len(belum)} slug di peta tidak ada di basis data: {belum}")

    total_fitur = 0
    diperbarui = 0
    print(f"  {'unit':<42} {'kategori':<9} fitur")
    for slug, kat in sorted(peta.items(), key=lambda x: baris.get(x[0], (0, ""))[0]):
        if slug not in baris:
            continue
        jml = sum(len(v) for v in kat.values())
        total_fitur += jml
        if not KERING:
            k.execute(
                "UPDATE unit SET fitur = ? WHERE slug = ?",
                (json.dumps(kat, ensure_ascii=False), slug),
            )
        diperbarui += 1
        print(f"  {baris[slug][1][:40]:<42} {len(kat):<9} {jml}")

    if not KERING:
        k.commit()

    kosong = k.execute(
        "SELECT COUNT(*) FROM unit WHERE fitur IS NULL OR fitur = '{}'"
    ).fetchone()[0]

    print()
    print("═" * 62)
    print(f"  unit diperbarui     : {diperbarui}")
    print(f"  total fitur         : {total_fitur}")
    print(f"  masih kosong di DB  : {kosong}")
    print(f"  mode                : {'KERING (tidak ditulis)' if KERING else 'TULIS'}")
    print("═" * 62)
    k.close()
    return 0 if kosong == 0 else 1


if __name__ == "__main__":
    sys.exit(main())
