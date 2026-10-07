#!/usr/bin/env python3
"""Pembaca kata sandi untuk skrip uji.

Skrip uji TIDAK boleh memuat kata sandi di dalam kodenya. Repositori ini publik:
sandi yang ditulis di sini sama dengan diumumkan, dan karena ikut ter-commit,
sandi itu tetap bisa dibaca dari riwayat git meski barisnya dihapus kemudian.
Yang sudah terjadi sekali jangan diulang.

Urutan pembacaan:

  1. Variabel lingkungan `SEED_ADMIN_SANDI` / `SEED_STAFF_SANDI`
     (inilah yang dipakai `scripts/uji.sh` untuk server uji)
  2. Berkas `.env` di akar proyek
  3. Menyerah dengan pesan yang menjelaskan cara mengisinya

Pemakaian:

    from _akun import surel_uji, sandi_uji
    SUREL = surel_uji("admin")
    SANDI = sandi_uji("admin")
"""

from __future__ import annotations

import os
import sys
from pathlib import Path

AKAR = Path(__file__).resolve().parent.parent

_VARIABEL = {"admin": "SEED_ADMIN_SANDI", "staff": "SEED_STAFF_SANDI"}
_SUREL_BAWAAN = {"admin": "admin@marf.id", "staff": "staff@marf.id"}
_SUREL_VARIABEL = {"admin": "SEED_ADMIN_EMAIL", "staff": "SEED_STAFF_EMAIL"}


def _dari_env_file(nama: str) -> str | None:
    """Baca satu variabel dari .env, kalau berkasnya ada.

    Sengaja hanya menangani bentuk sederhana `NAMA=nilai` — .env di proyek ini
    tidak butuh ekspansi, tanda kutip bersarang, atau substitusi.
    """
    berkas = AKAR / ".env"
    if not berkas.is_file():
        return None
    try:
        for baris in berkas.read_text(encoding="utf-8").splitlines():
            baris = baris.strip()
            if not baris or baris.startswith("#") or "=" not in baris:
                continue
            kunci, _, nilai = baris.partition("=")
            if kunci.strip() != nama:
                continue
            nilai = nilai.strip()
            if len(nilai) >= 2 and nilai[0] == nilai[-1] and nilai[0] in "\"'":
                nilai = nilai[1:-1]
            return nilai or None
    except OSError:
        return None
    return None


def sandi_uji(peran: str = "admin") -> str:
    variabel = _VARIABEL[peran]
    nilai = os.environ.get(variabel) or _dari_env_file(variabel)
    if nilai:
        return nilai

    print(
        f"GAGAL: kata sandi uji tidak ditemukan.\n"
        f"  Setel {variabel} di lingkungan, atau tulis di {AKAR / '.env'}\n"
        f"  (lihat .env.example). Skrip uji tidak menyimpan kata sandi di dalam kodenya\n"
        f"  karena repositori ini publik.",
        file=sys.stderr,
    )
    raise SystemExit(2)


def surel_uji(peran: str = "admin") -> str:
    variabel = _SUREL_VARIABEL[peran]
    return os.environ.get(variabel) or _dari_env_file(variabel) or _SUREL_BAWAAN[peran]
