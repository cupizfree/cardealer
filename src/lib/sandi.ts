// Hashing kata sandi — modul terpisah tanpa impor `next/headers`,
// supaya bisa dipakai dari seed maupun dari route tanpa terikat konteks permintaan.

import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";

const PANJANG = 64;

export function hashSandi(sandi: string): string {
  const garam = randomBytes(16);
  const kunci = scryptSync(sandi, garam, PANJANG);
  return `scrypt$${garam.toString("hex")}$${kunci.toString("hex")}`;
}

export function cekSandi(sandi: string, tersimpan: string): boolean {
  const bagian = tersimpan.split("$");
  if (bagian.length !== 3 || bagian[0] !== "scrypt") return false;
  try {
    const garam = Buffer.from(bagian[1], "hex");
    const kunci = Buffer.from(bagian[2], "hex");
    const coba = scryptSync(sandi, garam, kunci.length);
    return timingSafeEqual(kunci, coba);
  } catch {
    return false;
  }
}
