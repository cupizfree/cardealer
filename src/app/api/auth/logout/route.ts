// POST /api/auth/logout — cabut sesi dan hapus cookie.

import { sukses, tangani } from "@/lib/api";
import { cabutSesi, hapusCookie, tokenDariCookie } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function POST() {
  return tangani(async () => {
    const t = await tokenDariCookie();
    if (t) cabutSesi(t);
    await hapusCookie();
    return sukses({ keluar: true });
  });
}
