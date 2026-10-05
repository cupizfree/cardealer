// POST /api/seed — isi basis data dengan data awal. Idempoten.
// Berguna untuk menyiapkan lingkungan baru tanpa menjalankan skrip terpisah.

import { sukses, tangani } from "@/lib/api";
import { seedJikaKosong } from "@/lib/seed";

export const dynamic = "force-dynamic";

export async function POST() {
  return tangani(async () => sukses(seedJikaKosong()));
}
