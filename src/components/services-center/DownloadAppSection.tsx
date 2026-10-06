import Image from "next/image";

// Migrated from ../aurexo/services-center.html lines 661-682. App store/Google Play buttons both link
// to `href="#"` in source (decorative, no real app to download) — preserved as-is.
export default function DownloadAppSection() {
  return (
    <section className="bg-white py-100">
      <div className="container">
        <div className="grid grid-cols-2 xl-grid-cols-2 lg-grid-cols-1 gap-30">
          <div className="flex flex-col justify-center pr-40 wow fadeInUp">
            <h2 className="mb-12">Temukan Mobil Bekas Impian Anda, Kapan Saja!</h2>
            <p className="mb-32">
              Nikmati kemudahan mencari mobil bekas lewat aplikasi kami. Jelajahi, bandingkan, dan
              beli mobil bekas{" "}
              <br className="lg-hidden" /> dari mana saja - cepat, simpel, dan praktis.
            </p>
            <div className="flex items-center gap-12">
              <a href="#">
                <Image className="h-40" src="/assets/images/brand/app-store-primary.png" alt="app-store" width={270} height={80} />
              </a>
              <a href="#">
                <Image className="h-40" src="/assets/images/brand/google-play-primary.png" alt="google-play" width={270} height={80} />
              </a>
            </div>
          </div>
          <div className="ml-24 flex lg-ml-0 wow fadeInUp image-effect-scale overflow-hidden radius-20">
            <Image className="w-full" src="/assets/images/home/banner-download-app.jpg" alt="banner-download-app" width={1330} height={996} />
          </div>
        </div>
      </div>
    </section>
  );
}
