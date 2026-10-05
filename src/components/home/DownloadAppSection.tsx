import Image from "next/image";

// Migrated from ../aurexo/index.html lines 3373-3395. Purely decorative — app-store/google-play links
// are literal `href="#"` in source (UI_ONLY, not real deep links).
export default function DownloadAppSection() {
  return (
    <section className="bg-primary py-100">
      <div className="container">
        <div className="grid grid-cols-2 xl-grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="flex flex-col justify-center pr-100 wow fadeInUp" data-wow-delay="0.1s">
            <h2 className="text-white mb-12">Temukan Mobil Bekas Impian Anda, Kapan Saja!</h2>
            <p className="text-white mb-40">
              Belanja mobil tanpa ribet lewat aplikasi kami. Jelajahi, bandingkan, dan beli mobil bekas dari mana saja – cepat, simpel, dan praktis.
            </p>
            <div className="flex items-center gap-12">
              <a href="#">
                <Image className="h-40" src="/assets/images/brand/app-store.png" alt="app-store" width={135} height={40} />
              </a>
              <a href="#">
                <Image className="h-40" src="/assets/images/brand/google-play.png" alt="google-play" width={135} height={40} />
              </a>
            </div>
          </div>
          <div
            className="image-effect-scale flex md-ml-0 ml-24 radius-20 overflow-hidden wow fadeInUp hover-this img-animation animated"
            data-wow-delay="0.3s"
          >
            <Image className="w-full" src="/assets/images/home/banner-download-app.jpg" alt="banner-download-app" width={720} height={640} />
          </div>
        </div>
      </div>
    </section>
  );
}
