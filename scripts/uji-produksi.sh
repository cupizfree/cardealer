#!/usr/bin/env bash
# Verifikasi server MARF — API + halaman panel.
#
# Pemakaian:  bash scripts/uji-produksi.sh [BASE_URL]
# Default:    http://127.0.0.1:3101  (server uji, basis data terpisah)
#
# Lewat scripts/uji.sh, server uji dinyalakan dan basis data uji disiapkan dulu.
# Sandi TIDAK ditulis di berkas ini — dibaca saat jalan dari src/lib/seed.ts,
# satu-satunya tempat sandi awal didefinisikan.
#
# Setiap unit yang dibuat di sini WAJIB dihapus di akhir. Versi lama tidak
# menangkap ID dua unit, sehingga keduanya bocor ke basis data setiap kali uji
# dijalankan.

set -uo pipefail

AKAR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
B="${1:-http://127.0.0.1:3101}"
JAR="$(mktemp)"; JAR2="$(mktemp)"
DIBUAT=()   # id unit yang harus dihapus di akhir

# Bagian I menguji `logout` — cookie admin di $JAR sudah mati saat pembersihan
# berjalan, sehingga DELETE akan dijawab 401 dan unitnya tertinggal. Karena itu
# pembersihan masuk ulang dulu dengan jar sendiri.
bersihkan() {
  if [ "${#DIBUAT[@]}" -gt 0 ] && [ -n "${ADMIN_EMAIL:-}" ]; then
    JARBERSIH=$(mktemp)
    curl -s -o /dev/null -m 30 -c "$JARBERSIH" -X POST "$B/api/auth/login" \
      -H 'Content-Type: application/json' \
      -d "{\"email\":\"$ADMIN_EMAIL\",\"kata_sandi\":\"$ADMIN_SANDI\"}"
    for id in "${DIBUAT[@]}"; do
      kode=$(curl -s -o /dev/null -w '%{http_code}' -m 20 -b "$JARBERSIH" -X DELETE "$B/api/unit/$id")
      # 404 = sudah terhapus oleh uji DELETE di bagian D. Itu bukan kegagalan.
      case "$kode" in
        200|404) ;;
        *) echo "  PERINGATAN: gagal hapus unit uji id=$id (HTTP $kode)" >&2 ;;
      esac
    done
    rm -f "$JARBERSIH"
  fi
  rm -f "$JAR" "$JAR2"
}
trap bersihkan EXIT

lulus=0; gagal=0
cek() { # cek <label> <harapan> <dapat>
  if [ "$2" = "$3" ]; then printf "  \033[32m✓\033[0m %-44s %s\n" "$1" "$3"; lulus=$((lulus+1));
  else printf "  \033[31m✗\033[0m %-44s harap %s, dapat %s\n" "$1" "$2" "$3"; gagal=$((gagal+1)); fi
}
kode() { curl -s -o /dev/null -w "%{http_code}" -m 30 "$@"; }
ambil_id() { python3 -c "import json,sys;print(json.load(sys.stdin)['data']['id'])" 2>/dev/null; }

# ── kredensial dibaca dari sumbernya, tidak ditulis di sini ─────────────────
# `node --experimental-strip-types` tidak bisa mengimpor seed.ts (impor tanpa
# ekstensi + alias "@/"), jadi baris AKUN_AWAL dibaca langsung dari berkasnya.
AKUN=$(python3 - "$AKAR/src/lib/seed.ts" <<'PY'
import re, sys
s = open(sys.argv[1], encoding="utf-8").read()
blok = re.search(r"AKUN_AWAL\s*=\s*\[(.*?)\]", s, re.S)
if blok:
    for m in re.finditer(r'email:\s*"([^"]+)".*?sandi:\s*"([^"]+)"', blok.group(1), re.S):
        print(f"{m.group(1)}\t{m.group(2)}")
PY
)
ADMIN_EMAIL=$(echo "$AKUN" | awk -F'\t' '$1 ~ /admin/ {print $1}')
ADMIN_SANDI=$(echo "$AKUN" | awk -F'\t' '$1 ~ /admin/ {print $2}')
STAFF_EMAIL=$(echo "$AKUN" | awk -F'\t' '$1 ~ /staff/ {print $1}')
STAFF_SANDI=$(echo "$AKUN" | awk -F'\t' '$1 ~ /staff/ {print $2}')

if [ -z "$ADMIN_EMAIL" ] || [ -z "$STAFF_EMAIL" ]; then
  echo "GAGAL: tidak bisa membaca akun awal dari src/lib/seed.ts" >&2
  exit 1
fi

printf "\n\033[1m── A. API PUBLIK (tanpa login) ──\033[0m\n"
cek "GET /api/unit"          200 "$(kode "$B/api/unit")"
cek "GET /api/dealer"        200 "$(kode "$B/api/dealer")"
cek "GET /api/auth/me"       200 "$(kode "$B/api/auth/me")"
cek "GET /api/statistik (401)"  401 "$(kode "$B/api/statistik")"
cek "GET /api/prospek (401)"    401 "$(kode "$B/api/prospek")"
cek "GET /api/pengguna (401)"   401 "$(kode "$B/api/pengguna")"
cek "POST /api/unit (401)"      401 "$(kode -X POST "$B/api/unit" -H 'Content-Type: application/json' -d '{}')"

printf "\n\033[1m── B. PROSPEK PUBLIK (form kontak) ──\033[0m\n"
R=$(curl -s -m 30 -X POST "$B/api/prospek" -H 'Content-Type: application/json' \
  -d '{"nama":"Verifikasi Produksi","telepon":"0811-9999-0000","email":"verif@contoh.id","pesan":"Uji dari skrip","sumber":"kontak"}')
cek "POST /api/prospek terima"  true "$(echo "$R" | python3 -c "import json,sys;print(str(json.load(sys.stdin)['data']['diterima']).lower())" 2>/dev/null)"
cek "POST tanpa kontak (422)"   422 "$(kode -X POST "$B/api/prospek" -H 'Content-Type: application/json' -d '{"nama":"X","sumber":"kontak"}')"
PID=$(echo "$R" | ambil_id)

printf "\n\033[1m── C. MASUK ──\033[0m\n"
cek "login admin"   200 "$(kode -c "$JAR"  -X POST "$B/api/auth/login" -H 'Content-Type: application/json' -d "{\"email\":\"$ADMIN_EMAIL\",\"kata_sandi\":\"$ADMIN_SANDI\"}")"
cek "login staff"   200 "$(kode -c "$JAR2" -X POST "$B/api/auth/login" -H 'Content-Type: application/json' -d "{\"email\":\"$STAFF_EMAIL\",\"kata_sandi\":\"$STAFF_SANDI\"}")"
cek "login salah"   401 "$(kode -X POST "$B/api/auth/login" -H 'Content-Type: application/json' -d "{\"email\":\"$ADMIN_EMAIL\",\"kata_sandi\":\"sandi-yang-salah\"}")"

printf "\n\033[1m── D. CRUD UNIT ──\033[0m\n"
UNIK="Uji-$RANDOM$RANDOM"
# Setiap POST yang mengharapkan 201: ID-nya ditangkap dan unitnya dihapus di akhir.
BARU1=$(curl -s -m 30 -b "$JAR" -X POST "$B/api/unit" -H 'Content-Type: application/json' \
  -d "{\"judul\":\"Suzuki Ertiga GX $UNIK\",\"merek\":\"Suzuki\",\"harga\":225000000,\"tahun\":2022}")
ID1=$(echo "$BARU1" | ambil_id); [ -n "$ID1" ] && DIBUAT+=("$ID1")
cek "POST /api/unit"        201 "$(echo "$BARU1" | python3 -c "import json,sys;print('201' if json.load(sys.stdin)['data']['id'] else '000')" 2>/dev/null)"

BARU2=$(curl -s -m 30 -b "$JAR" -X POST "$B/api/unit" -H 'Content-Type: application/json' \
  -d "{\"judul\":\"Mazda 2 R $UNIK\",\"merek\":\"Mazda\",\"harga\":210000000}")
ID2=$(echo "$BARU2" | ambil_id); [ -n "$ID2" ] && DIBUAT+=("$ID2")
cek "POST /api/unit (kedua)" 201 "$(echo "$BARU2" | python3 -c "import json,sys;print('201' if json.load(sys.stdin)['data']['id'] else '000')" 2>/dev/null)"

cek "PATCH /api/unit/$ID1"    200 "$(kode -b "$JAR" -X PATCH "$B/api/unit/$ID1" -H 'Content-Type: application/json' -d '{"status":"dipesan"}')"
cek "DELETE /api/unit/$ID1"   200 "$(kode -b "$JAR" -X DELETE "$B/api/unit/$ID1")"
cek "GET unit terhapus (404)" 404 "$(kode -b "$JAR" "$B/api/unit/$ID1")"
cek "POST slug ganda (409)"   409 "$(kode -b "$JAR" -X POST "$B/api/unit" -H 'Content-Type: application/json' -d "{\"judul\":\"Mazda 2 R $UNIK\",\"merek\":\"Mazda\",\"harga\":1}")"

printf "\n\033[1m── E. PENJAGAAN PERAN ──\033[0m\n"
cek "staff -> /api/pengguna (403)" 403 "$(kode -b "$JAR2" "$B/api/pengguna")"
cek "admin -> /api/pengguna"       200 "$(kode -b "$JAR"  "$B/api/pengguna")"

BARU3=$(curl -s -m 30 -b "$JAR2" -X POST "$B/api/unit" -H 'Content-Type: application/json' \
  -d "{\"judul\":\"Hyundai Creta $UNIK\",\"merek\":\"Hyundai\",\"harga\":315000000}")
ID3=$(echo "$BARU3" | ambil_id); [ -n "$ID3" ] && DIBUAT+=("$ID3")
cek "staff buat unit"              201 "$(echo "$BARU3" | python3 -c "import json,sys;print('201' if json.load(sys.stdin)['data']['id'] else '000')" 2>/dev/null)"

printf "\n\033[1m── F. PROSPEK (admin) ──\033[0m\n"
cek "GET /api/prospek"  200 "$(kode -b "$JAR" "$B/api/prospek")"
cek "PATCH prospek"     200 "$(kode -b "$JAR" -X PATCH "$B/api/prospek/$PID" -H 'Content-Type: application/json' -d '{"status":"dihubungi","catatan":"Sudah ditelepon"}')"
cek "DELETE prospek"    200 "$(kode -b "$JAR" -X DELETE "$B/api/prospek/$PID")"

printf "\n\033[1m── G. HALAMAN PANEL ──\033[0m\n"
cek "/masuk"             200 "$(kode "$B/masuk")"
cek "/admin (belum masuk)" 307 "$(kode "$B/admin")"
cek "/admin"             200 "$(kode -b "$JAR" "$B/admin")"
cek "/admin/unit"        200 "$(kode -b "$JAR" "$B/admin/unit")"
cek "/admin/unit/baru"   200 "$(kode -b "$JAR" "$B/admin/unit/baru")"
cek "/admin/dealer"      200 "$(kode -b "$JAR" "$B/admin/dealer")"
cek "/admin/prospek"     200 "$(kode -b "$JAR" "$B/admin/prospek")"
cek "/admin/pengguna"    200 "$(kode -b "$JAR" "$B/admin/pengguna")"
cek "/admin/log"         200 "$(kode -b "$JAR" "$B/admin/log")"
cek "/admin/unit/1"      200 "$(kode -b "$JAR" "$B/admin/unit/1")"
cek "staff -> /admin"    307 "$(kode -b "$JAR2" "$B/admin")"
cek "/staff"             200 "$(kode -b "$JAR2" "$B/staff")"
cek "/staff/prospek"     200 "$(kode -b "$JAR2" "$B/staff/prospek")"
cek "/staff/unit"        200 "$(kode -b "$JAR2" "$B/staff/unit")"

printf "\n\033[1m── H. SITUS PUBLIK MASIH UTUH ──\033[0m\n"
cek "/"                  200 "$(kode "$B/")"
cek "/contact-us"        200 "$(kode "$B/contact-us")"
cek "/listing-grid3-columns" 200 "$(kode "$B/listing-grid3-columns")"
cek "/about-us"          200 "$(kode "$B/about-us")"

printf "\n\033[1m── I. KELUAR ──\033[0m\n"
cek "logout"             200 "$(kode -b "$JAR" -c "$JAR" -X POST "$B/api/auth/logout")"
cek "/admin setelah keluar" 307 "$(kode -b "$JAR" "$B/admin")"

printf "\n\033[1m════ HASIL: %d lulus, %d gagal ════\033[0m\n\n" "$lulus" "$gagal"
[ "$gagal" -eq 0 ] && exit 0 || exit 1
