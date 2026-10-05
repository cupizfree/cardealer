import Link from "next/link";
import ParallaxImage from "@/components/common/ParallaxImage";

// Migrated from ../aurexo/sell-your-car.html lines 699-714. Source's `.overlay-parallax` (a 40% black
// tint, `assets/scss/app.scss`) + `.overlay.image` (position:absolute background layer) wrap a plain
// `<img>` that `app.js`'s `parallax()` hands to `simpleParallaxVanilla.umd.js` at runtime for a real
// scroll effect — see `common/ParallaxImage.tsx` for the reproduction.
export default function GetInTouchBanner() {
  return (
    <section className="relative py-100">
      <div className="overlay-parallax" />
      <ParallaxImage src="/assets/images/banner/bg-cta.jpg" />
      <div className="container relative index-10">
        <h2 className="mb-12 text-white capitalize">Hubungi Kami</h2>
        <p className="h7 line-height-28 text-white mb-20">
          Kami siap membantu dengan pertanyaan, keluhan, atau <br className="lg-hidden" /> permintaan
          apa pun—hubungi kami hari ini!
        </p>
        <p className="mb-4 text-white">Senin - Sabtu: 08.00 - 17.00</p>
        <p className="mb-20 text-white">Minggu: Tutup</p>

        <div className="flex">
          <Link href="/contact-us" className="btn btn-white text-primary btn-large-3 font-weight-600">
            Hubungi Kami
          </Link>
        </div>
      </div>
    </section>
  );
}
