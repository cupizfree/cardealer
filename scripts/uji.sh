#!/usr/bin/env bash
# Siklus uji MARF di basis data TERPISAH.
#
# Akar masalah lama: uji-produksi.sh menulis ke .data/marf.db — basis data yang
# dipakai situs. Dua unit bocor setiap kali dijalankan (unit dibuat untuk diuji
# tapi ID-nya tidak pernah ditangkap, jadi tidak pernah dihapus).
#
# Skrip ini:
#   1. menolak berjalan kalau sasarannya bukan localhost
#   2. menghapus basis data uji (bukan basis data produksi)
#   3. menyalakan server uji di port 3101 dengan MARF_DB_PATH ke basis data uji
#   4. mengisi data awal
#   5. menjalankan uji-produksi.sh terhadap server uji
#   6. mematikan server uji
#
# Basis data produksi (.data/marf.db) tidak pernah disentuh.

set -uo pipefail

AKAR="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
PORT_UJI="${PORT_UJI:-3101}"
B="http://127.0.0.1:$PORT_UJI"
DB_UJI="$AKAR/.data/marf-uji.db"
LOG="$AKAR/.data/uji-server.log"
PIDFILE="$AKAR/.data/uji-server.pid"

# ── pengaman 1: harus dari akar proyek ───────────────────────────────────────
if [ ! -f "$AKAR/package.json" ]; then
  echo "GAGAL: bukan akar proyek cardealer ($AKAR)" >&2
  exit 1
fi

# ── pengaman 2: hanya localhost ──────────────────────────────────────────────
case "$B" in
  http://127.0.0.1:*|http://localhost:*) ;;
  *) echo "GAGAL: hanya boleh menunjuk localhost, bukan $B" >&2; exit 1 ;;
esac

# ── pengaman 3: jangan pernah menyentuh basis data produksi ──────────────────
case "$DB_UJI" in
  *marf-uji.db) ;;
  *) echo "GAGAL: jalur basis data uji tidak wajar: $DB_UJI" >&2; exit 1 ;;
esac

# Pembunuhan harus tuntas dan presisi.
#
# `ss -lptn -p` TIDAK bisa melihat pemilik soket di kontainer ini (uid tanpa
# CAP_SYS_ADMIN) — daftarnya kosong walau port jelas dipakai. Akibatnya versi
# awal skrip ini tidak pernah membunuh apa pun: server uji lama tetap melayani
# dengan berkas basis data yang sudah dihapus, dan uji berjalan melawan basis
# data hantu.
#
# Cara yang presisi: server uji satu-satunya proses yang membawa
# MARF_DB_PATH=...marf-uji... di lingkungannya. Induk maupun anaknya mewarisi
# variabel itu, jadi keduanya tersapu — dan server produksi tidak pernah
# tersentuh karena ia tidak membawa variabel itu sama sekali.
pids_uji() {
  for e in /proc/[0-9]*/environ; do
    [ -r "$e" ] || continue
    if tr '\0' '\n' < "$e" 2>/dev/null | grep -q "MARF_DB_PATH=.*marf-uji"; then
      p=${e#/proc/}; echo "${p%/environ}"
    fi
  done
}

matikan() {
  for i in $(seq 1 15); do
    pids=$(pids_uji)
    [ -z "$pids" ] && { rm -f "$PIDFILE"; return 0; }
    for p in $pids; do kill -9 "$p" 2>/dev/null; done
    sleep 1
  done
  echo "GAGAL: proses server uji masih hidup setelah 15 detik: $(pids_uji | tr '\n' ' ')" >&2
  return 1
}

printf '\n\033[1m══ SIAPKAN LINGKUNGAN UJI ══\033[0m\n'
matikan || exit 1
# Baru setelah port benar-benar bebas, basis data uji boleh dihapus.
rm -f "$DB_UJI" "$DB_UJI-wal" "$DB_UJI-shm"
echo "  port $PORT_UJI bebas; basis data uji dihapus: ${DB_UJI#$AKAR/}"

cd "$AKAR"

# Kata sandi untuk basis data UJI saja.
#
# Server uji menyemai akunnya sendiri dari variabel ini, jadi tidak ada sandi
# sungguhan yang perlu ada di skrip — dan tidak ada sandi di repositori publik.
# Nilainya sengaja tetap: uji harus bisa diulang dan hasilnya sama.
export SEED_ADMIN_SANDI="uji-admin-sandi-tetap"
export SEED_STAFF_SANDI="uji-staff-sandi-tetap"

# `npx next start -p PORT` TIDAK jalan: npx menafsirkan `-p` sebagai `--package`
# miliknya sendiri dan mencari paket bernama "3101". Pakai binernya langsung.
MARF_DB_PATH="./.data/marf-uji.db" NODE_OPTIONS="--max-old-space-size=384" \
  ./node_modules/.bin/next start -p "$PORT_UJI" >"$LOG" 2>&1 &
echo $! > "$PIDFILE"
echo "  server uji dinyalakan (pid $(cat "$PIDFILE"), port $PORT_UJI)"

printf '  menunggu siap'
for i in $(seq 1 60); do
  code=$(curl -s -o /dev/null -w '%{http_code}' -m 5 "$B/masuk" 2>/dev/null)
  if [ "$code" = "200" ]; then printf ' — siap (%ss)\n' "$i"; break; fi
  if grep -qE "EADDRINUSE|Failed to start server" "$LOG" 2>/dev/null; then
    printf '\n  GAGAL: server uji tidak bisa memulai\n'; tail -12 "$LOG"; matikan; exit 1
  fi
  printf '.'
  sleep 1
  if [ "$i" = "60" ]; then printf '\n  GAGAL: server uji tidak siap\n'; tail -20 "$LOG"; matikan; exit 1; fi
done

# Pastikan yang melayani benar-benar server uji yang baru, bukan sisa proses lama.
tercatat=$(cat "$PIDFILE" 2>/dev/null || echo 0)
pelayan=$(pids_uji | tr '\n' ' ')
echo "  pid uji aktif: ${pelayan:-TIDAK ADA}"

# ── isi data awal (idempoten) ────────────────────────────────────────────────
seed=$(curl -s -m 60 -X POST "$B/api/seed")
echo "  seed: $(echo "$seed" | head -c 160)"

# ── jalankan uji ─────────────────────────────────────────────────────────────
bash "$AKAR/scripts/uji-produksi.sh" "$B"
hasil=$?

# ── periksa kebocoran: basis data uji harus tetap sama jumlahnya ─────────────
printf '\n\033[1m══ PERIKSA KEBOCORAN ══\033[0m\n'
python3 - "$DB_UJI" <<'PY'
import sqlite3, sys
k = sqlite3.connect(f"file:{sys.argv[1]}?mode=ro", uri=True)
k.row_factory = sqlite3.Row
sisa = k.execute("SELECT id,slug,judul FROM unit WHERE slug LIKE '%uji%' OR judul LIKE '%Uji-%'").fetchall()
n = k.execute("SELECT COUNT(*) FROM unit").fetchone()[0]
if sisa:
    print(f"  \033[31m✗ BOCOR: {len(sisa)} unit uji tertinggal\033[0m")
    for r in sisa:
        print(f"      id={r['id']} {r['slug']} | {r['judul']}")
else:
    print(f"  \033[32m✓ tidak ada unit uji tertinggal (total {n} unit)\033[0m")
p = k.execute("SELECT COUNT(*) FROM prospek WHERE nama LIKE 'Verifikasi%'").fetchone()[0]
print(f"  {'✗' if p else '✓'} prospek uji tertinggal: {p}")
PY

matikan
printf '  server uji dimatikan\n\n'
exit $hasil
