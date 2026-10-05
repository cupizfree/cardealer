import { redirect } from "next/navigation";
import { penggunaSekarang } from "@/lib/auth";
import PanelShell from "@/components/panel/PanelShell";
import "@/styles/panel.css";

export const dynamic = "force-dynamic";

export const metadata = {
  title: { default: "Panel", template: "%s | Panel MARF" },
  robots: { index: false, follow: false },
};

// Penjaga lapis pertama: siapa pun yang belum masuk dikirim ke /masuk.
// Penjagaan peran ada di masing-masing sub-layout (admin / staff).
export default async function PanelLayout({ children }: { children: React.ReactNode }) {
  const p = await penggunaSekarang();
  if (!p) redirect("/masuk");

  return (
    <PanelShell pengguna={p}>
      {children}
    </PanelShell>
  );
}
