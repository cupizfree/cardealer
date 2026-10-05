// GET /api/auth/me — siapa yang sedang masuk.

import { sukses, tangani } from "@/lib/api";
import { penggunaSekarang } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET() {
  return tangani(async () => {
    const p = await penggunaSekarang();
    return sukses({ masuk: !!p, pengguna: p });
  });
}
