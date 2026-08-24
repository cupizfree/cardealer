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
        <h2 className="mb-12 text-white capitalize">Get in Touch with Us</h2>
        <p className="h7 line-height-28 text-white mb-20">
          We&apos;re here to assist with any questions, concerns, or <br className="lg-hidden" /> inquiries
          contact us today!
        </p>
        <p className="mb-4 text-white">Monday - Saturday: 08:00AM - 17:00PM</p>
        <p className="mb-20 text-white">Sunday: Close</p>

        <div className="flex">
          <Link href="/contact-us" className="btn btn-white text-primary btn-large-3 font-weight-600">
            Contact Us
          </Link>
        </div>
      </div>
    </section>
  );
}
