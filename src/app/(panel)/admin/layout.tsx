import { redirect } from "next/navigation";
import { penggunaSekarang } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Penjaga peran: hanya admin. Staff yang mencoba masuk dikembalikan ke panelnya.
export default async function LayoutAdmin({ children }: { children: React.ReactNode }) {
  const p = await penggunaSekarang();
  if (!p) redirect("/masuk");
  if (p.peran !== "admin") redirect("/staff");

  return <>{children}</>;
}
