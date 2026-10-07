#!/usr/bin/env python3
"""Buktikan tautan navigasi benar-benar menyaring.

Sebelum ini, 26 dari 56 tautan navigasi mengembalikan halaman yang BYTE-IDENTIK:
`?tipe=` / `?harga=` / `?merek=` tidak dibaca siapa pun. Jadi tes ini tidak cukup
memeriksa status 200 — halaman 200 yang isinya sama persis justru kegagalannya.

Yang diperiksa, per tautan:
  1. Himpunan unit yang tampil PERSIS sama dengan yang diharapkan.
  2. Judul halaman ikut berubah.
  3. Himpunannya berbeda dari katalog tanpa penyaring (bukti tidak "pasti-sama").

Unit diambil dari tautan `/listing-details/<slug>` pada kartu. Payload RSC
Next.js membuang seluruh katalog ke dalam <script> di setiap halaman, jadi
<script>/<style> harus dibuang dulu — kalau tidak, semua unit akan terlihat
"cocok" di semua halaman.

Pemakaian:  python3 scripts/uji-filter.py [URL_DASAR]
"""
import re
import sys
import urllib.error
import urllib.request

DASAR = (sys.argv[1] if len(sys.argv) > 1 else "http://127.0.0.1:3100").rstrip("/")
KATALOG = "/listing-grid3-columns"

T = "toyota"
H = "honda"

# Harapan ditulis eksplisit — kalau turunan jenis bodi di `src/lib/bodi.ts`
# salah menebak, tes ini yang menangkapnya.
HARAPAN = {
    "tipe=suv": (
        {
            "daihatsu-terios-r-2020",
            "honda-hr-v-1-5-se-2022",
            "hyundai-creta-2023",
            "mitsubishi-pajero-sport-dakar-2020",
            f"{T}-fortuner-vrz-2021",
            f"{T}-rush-s-gr-sport-2022",
        },
        "SUV",
    ),
    "tipe=mpv": (
        {
            "daihatsu-xenia-r-2021",
            f"{H}-mobilio-rs-2021",
            "mitsubishi-xpander-ultimate-2023",
            "nissan-livina-vl-2021",
            "suzuki-ertiga-gx-2022",
            f"{T}-avanza-1-5-g-2022",
            f"{T}-calya-g-2020",
        },
        "MPV",
    ),
    "tipe=hatchback": (
        {
            f"{H}-city-hatchback-rs-2022",
            "mazda-2-r-2021",
            "suzuki-ignis-gx-2021",
        },
        "Hatchback",
    ),
    "tipe=city-car": (
        {f"{H}-brio-satya-e-2023", f"{T}-agya-g-2019"},
        "City Car",
    ),
    "merek=toyota": (
        {
            f"{T}-agya-g-2019",
            f"{T}-avanza-1-5-g-2022",
            f"{T}-calya-g-2020",
            f"{T}-fortuner-vrz-2021",
            f"{T}-rush-s-gr-sport-2022",
        },
        "Toyota",
    ),
    "merek=honda": (
        {
            f"{H}-brio-satya-e-2023",
            f"{H}-city-hatchback-rs-2022",
            f"{H}-hr-v-1-5-se-2022",
            f"{H}-mobilio-rs-2021",
        },
        "Honda",
    ),
    "merek=daihatsu": ({"daihatsu-terios-r-2020", "daihatsu-xenia-r-2021"}, "Daihatsu"),
    "merek=suzuki": ({"suzuki-ertiga-gx-2022", "suzuki-ignis-gx-2021"}, "Suzuki"),
    "merek=mitsubishi": (
        {"mitsubishi-pajero-sport-dakar-2020", "mitsubishi-xpander-ultimate-2023"},
        "Mitsubishi",
    ),
    "merek=nissan": ({"nissan-livina-vl-2021"}, "Nissan"),
    "merek=hyundai": ({"hyundai-creta-2023"}, "Hyundai"),
    "merek=mazda": ({"mazda-2-r-2021"}, "Mazda"),
    "harga=100-150": (
        {f"{T}-agya-g-2019", f"{T}-calya-g-2020", "suzuki-ignis-gx-2021"},
        "Rp 100 – 150 juta",
    ),
    "harga=150-200": (
        {
            f"{H}-brio-satya-e-2023",
            f"{H}-mobilio-rs-2021",
            "daihatsu-xenia-r-2021",
            "nissan-livina-vl-2021",
            "suzuki-ertiga-gx-2022",
            f"{T}-avanza-1-5-g-2022",
        },
        "Rp 150 – 200 juta",
    ),
    "harga=200-300": (
        {
            "daihatsu-terios-r-2020",
            "mazda-2-r-2021",
            f"{T}-rush-s-gr-sport-2022",
            f"{H}-city-hatchback-rs-2022",
            "mitsubishi-xpander-ultimate-2023",
            f"{H}-hr-v-1-5-se-2022",
        },
        "Rp 200 – 300 juta",
    ),
    "harga=300-plus": (
        {
            "hyundai-creta-2023",
            "mitsubishi-pajero-sport-dakar-2020",
            f"{T}-fortuner-vrz-2021",
        },
        "Di atas Rp 300 juta",
    ),
    # Gabungan dua penyaring sekaligus.
    "tipe=suv&merek=toyota": (
        {f"{T}-fortuner-vrz-2021", f"{T}-rush-s-gr-sport-2022"},
        "SUV · Toyota",
    ),
    "tipe=mpv&harga=100-150": ({f"{T}-calya-g-2020"}, "MPV · Rp 100 – 150 juta"),
    # Rentang yang tidak sama dengan kotak mana pun — penggeser harga sidebar.
    "harga_min=250000000&harga_maks=400000000": (
        {"mitsubishi-xpander-ultimate-2023", f"{H}-hr-v-1-5-se-2022", "hyundai-creta-2023", "mitsubishi-pajero-sport-dakar-2020"},
        "Rp 250.000.000 - Rp 400.000.000",
    ),
    # Kotak yang memang kosong: tidak boleh diam-diam menampilkan semua unit.
    "harga=0-100": (set(), "Di bawah Rp 100 juta"),
}


def teks_tampil(html: str) -> str:
    html = re.sub(r"<script\b.*?</script>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<style\b.*?</style>", " ", html, flags=re.S | re.I)
    html = re.sub(r"<!--.*?-->", " ", html, flags=re.S)
    return html


def ambil(url: str) -> tuple[int, str]:
    try:
        with urllib.request.urlopen(url, timeout=40) as r:
            return r.status, r.read().decode("utf-8", "ignore")
    except urllib.error.HTTPError as e:
        return e.code, ""
    except Exception as e:  # noqa: BLE001
        return 0, f"__ERROR__ {e}"


def unit_di(html: str) -> set[str]:
    """Slug unit yang benar-benar dirender sebagai kartu."""
    return set(re.findall(r'href="/listing-details/([a-z0-9-]+)"', teks_tampil(html)))


def main() -> int:
    print(f"  dasar: {DASAR}\n")
    gagal = 0

    kode, html = ambil(f"{DASAR}{KATALOG}")
    if kode != 200:
        print(f"  GAGAL  katalog tidak bisa dibuka: {kode}")
        return 1
    tanpa_penyaring = unit_di(html)
    print(f"  acuan tanpa penyaring (halaman 1): {len(tanpa_penyaring)} kartu\n")

    for kueri, (harus, judul) in HARAPAN.items():
        kode, html = ambil(f"{DASAR}{KATALOG}?{kueri}")
        if kode != 200:
            print(f"  GAGAL  ?{kueri}  -> {kode}")
            gagal += 1
            continue

        dapat = unit_di(html)
        if dapat == harus:
            print(f"  ok     ?{kueri:44} {len(dapat)} unit")
        else:
            kurang = harus - dapat
            lebih = dapat - harus
            print(f"  GAGAL  ?{kueri:44} dapat {len(dapat)}, harus {len(harus)}")
            if kurang:
                print(f"           hilang : {sorted(kurang)}")
            if lebih:
                print(f"           kelebihan: {sorted(lebih)}")
            gagal += 1

        if judul and judul not in teks_tampil(html):
            print(f"           judul '{judul}' tidak muncul di halaman")
            gagal += 1

    # Inti perbaikannya: penyaring yang berbeda harus memberi hasil berbeda.
    print("\n  ── bukti tidak 'pasti-sama' ──")
    kode, h_suv = ambil(f"{DASAR}{KATALOG}?tipe=suv")
    kode, h_mpv = ambil(f"{DASAR}{KATALOG}?tipe=mpv")
    s_suv, s_mpv = unit_di(h_suv), unit_di(h_mpv)
    if s_suv and s_mpv and s_suv != s_mpv:
        print(f"  ok     SUV ({len(s_suv)}) != MPV ({len(s_mpv)})")
    else:
        print(f"  GAGAL  SUV dan MPV memberi himpunan yang sama: {sorted(s_suv)}")
        gagal += 1

    # `tipe` adalah himpunan TERTUTUP: nilainya selalu dibuat oleh kita, jadi
    # nilai tak dikenal berarti URL-nya diubah dengan tangan. Harus diabaikan,
    # bukan mengosongkan halaman.
    kode, html = ambil(f"{DASAR}{KATALOG}?tipe=pesawat")
    if kode == 200 and unit_di(html) == tanpa_penyaring:
        print("  ok     ?tipe=pesawat diabaikan, katalog utuh")
    else:
        print(f"  GAGAL  ?tipe=pesawat mengubah hasil: {len(unit_di(html))} kartu")
        gagal += 1

    # `merek` adalah himpunan TERBUKA — merek berubah mengikuti stok, jadi tidak
    # ada daftar tetap yang bisa dipakai memvalidasi. Merek yang tidak ada memang
    # harus memberi 0 unit, TAPI halamannya harus menjelaskan, bukan tampil
    # kosong begitu saja.
    kode, html = ambil(f"{DASAR}{KATALOG}?merek=ferrari")
    tampil = teks_tampil(html)
    pesan_kosong = "Belum ada unit" in tampil
    if kode == 200 and not unit_di(html) and pesan_kosong:
        print("  ok     ?merek=ferrari -> 0 unit, pesan kosong tampil")
    else:
        print(
            f"  GAGAL  ?merek=ferrari: {len(unit_di(html))} unit, "
            f"pesan kosong={'ada' if pesan_kosong else 'TIDAK ADA'}"
        )
        gagal += 1

    print(f"\n  {'SEMUA LULUS' if gagal == 0 else f'{gagal} MASALAH'}")
    return 1 if gagal else 0


if __name__ == "__main__":
    sys.exit(main())
