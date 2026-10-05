import { redirect } from "next/navigation";
import { penggunaSekarang } from "@/lib/auth";

export const dynamic = "force-dynamic";

// Penjaga peran: staff boleh, admin juga boleh (biar bisa meninjau).
export default async function LayoutStaff({ children }: { children: React.ReactNode }) {
  const p = await penggunaSekarang();
  if (!p) redirect("/masuk");

  return <>{children}</>;
}
