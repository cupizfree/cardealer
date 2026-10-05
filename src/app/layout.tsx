import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";
import "swiper/css/grid";
// `swiper/css/pagination` and `swiper/css/effect-fade` were missing entirely (only base `swiper/css`
// was imported) — found while migrating listing-details-6.html's fade+autoplay+pagination gallery.
// Without effect-fade's CSS, non-active fade slides keep `pointer-events: auto` (Swiper only sets
// `pointer-events: none` on them via this stylesheet, not JS), so clicks anywhere on the gallery hit
// whichever inactive slide happens to sit later in DOM order — a real, silent click-hijacking bug for
// any current/future page using the fade effect. Without pagination's CSS, `.swiper-pagination` has no
// `z-index` at all, so it can get covered by unrelated sibling content (see
// docs/migration/COMPONENT_MAP.md #33). Importing both here (not just in the one component) also
// benefits `RelatedListings.tsx`, which already uses the Pagination module. `swiper/css/grid` added
// while fixing `home/NewCarsSection.tsx`'s own `.swiper-card-7` (New/Used Cars tabs) — without it the
// Grid module's 2-row layout has no spacing/sizing rules and renders broken.
import "../../public/assets/scss/app.scss";
import type { Metadata } from "next";
import { Manrope, Albert_Sans } from "next/font/google";
import { ModalProvider } from "@/components/common/ModalProvider";
import { CompareProvider } from "@/components/common/CompareProvider";
import { WishlistProvider } from "@/components/common/WishlistProvider";
import { CartProvider } from "@/components/common/CartProvider";
import Preloader from "@/components/common/Preloader";
import BackToTop from "@/components/common/BackToTop";
import WowInit from "@/components/common/WowInit";
import LoginModal from "@/components/common/LoginModal";
import ForgotPasswordModal from "@/components/common/ForgotPasswordModal";
import SignUpModal from "@/components/common/SignUpModal";
import SearchModal from "@/components/common/SearchModal";
import CompareTrayModal from "@/components/common/CompareTrayModal";
import CardCompareModal from "@/components/common/CardCompareModal";
import ShoppingCartModal from "@/components/common/ShoppingCartModal";
import QuickViewModal from "@/components/common/QuickViewModal";
import TeamModal from "@/components/common/TeamModal";
import ThemeSwitcher from "@/components/common/ThemeSwitcher";

// Self-hosted via next/font/google instead of the source's CDN `@import url(fonts.googleapis.com...)`
// in `reset.scss` — that raw @import was silently dropped by the browser (a CSS @import must be the
// first rule in a stylesheet; Next bundles `swiper/css` ahead of it), so Manrope/Albert Sans never
// actually loaded and the whole site rendered in a fallback system font. next/font sidesteps the
// ordering issue entirely and self-hosts (resolves COMPONENT_MAP.md ambiguity #8). Same weight/style
// ranges as the source's Google Fonts URL (`Manrope:wght@200..800`, `Albert+Sans:ital,wght@0,100..900;1,100..900`).
// `variable` exposes each as a CSS custom property; `variables.scss`'s `$font-main-1`/`$font-main-2`
// reference those variables so every existing `font-family: $font-main-*` declaration picks this up
// with no other file needing to change.
const manrope = Manrope({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700", "800"],
  variable: "--font-manrope",
  display: "swap",
});

const albertSans = Albert_Sans({
  subsets: ["latin"],
  weight: ["100", "200", "300", "400", "500", "600", "700", "800", "900"],
  style: ["normal", "italic"],
  variable: "--font-albert-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "MARF | Showroom Mobil Purwokerto",
    template: "%s | MARF Showroom Mobil",
  },
  description:
    "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
  keywords: [
    "showroom mobil purwokerto",
    "jual mobil bekas purwokerto",
    "beli mobil bekas",
    "MARF showroom",
    "dealer mobil banyumas",
  ],
  icons: { icon: "/favicon.png" },
  openGraph: {
    title: "MARF | Showroom Mobil Purwokerto",
    description:
      "Jual beli mobil bekas berkualitas di Purwokerto. Unit terawat, harga jujur, dokumen lengkap.",
    locale: "id_ID",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="id" className={`${manrope.variable} ${albertSans.variable}`}>
      <body>
        <CompareProvider>
          <WishlistProvider>
            <CartProvider>
              <ModalProvider>
                <WowInit />
                <Preloader />
                <div id="wrapper">{children}</div>
                <LoginModal />
                <ForgotPasswordModal />
                <SignUpModal />
                <SearchModal />
                <CompareTrayModal />
                <CardCompareModal />
                <ShoppingCartModal />
                <QuickViewModal />
                {/* TeamModal is inert until an Executive Team card's `openModal("TeamModal")` trigger fires
                    (currently only about-us's ExecutiveTeam), same "mount globally, trigger per-page" pattern
                    as CardCompareModal above. NewsletterModal is NOT mounted here — unlike these, it opens
                    ITSELF via its own timer effect, and source only includes it on 11 of 63 pages, so it's
                    mounted per-page instead (see NewsletterModal.tsx's header comment). */}
                <TeamModal />
                <BackToTop />
                <ThemeSwitcher />
              </ModalProvider>
            </CartProvider>
          </WishlistProvider>
        </CompareProvider>
      </body>
    </html>
  );
}
