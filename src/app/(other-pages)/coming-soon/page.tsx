import type { Metadata } from "next";
import ComingSoonHero from "@/components/coming-soon/ComingSoonHero";

export const metadata: Metadata = {
  title: "Segera Hadir",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/coming-soon.html. Source has NO header/footer at all — a standalone
// full-viewport page (`.coming-soon-page` is `width/height: 100vw/100vh`, confirmed in
// assets/scss/inner-page.scss) — same "genuinely bare document" situation as 404.html, reproduced the
// same way (no `<Header>`/`<Footer>` here either).
export default function ComingSoonPage() {
  return <ComingSoonHero />;
}
