import Image from "next/image";

// Migrated from ../aurexo/home-07.html lines 4540-4558. Genuinely different DOM from both
// `home/DownloadAppSection.tsx` (index.html's own standalone `bg-primary py-100` section, `grid
// grid-cols-2` layout, `image-effect-scale` hover wrapper) and `services-center/DownloadAppSection.tsx`
// (its own standalone `bg-white py-100` section, same `grid-cols-2` shape): this is a `.cta-section
// .background-be` (`.cta--content`/`.cta--image` siblings, plain `<img>` with no hover-scale wrapper)
// nested inside the SAME `py-100 bg-white` "Clients Reviews" section as a trailing `tf-spacing`-
// separated block (confirmed via source diff — one section wraps both), rendered here via
// `common/ClientsReviewsCarousel`'s existing `children` slot rather than forcing a redundant extra
// `<section>`. Uses the `-primary` app-store/google-play icon variant (same as
// `services-center/DownloadAppSection.tsx`'s own), not the plain variant `home/DownloadAppSection.tsx`
// uses. App-store/Google Play links are literal `href="#"` in source (UI_ONLY, no real deep links).
//
// home-09.html reuses this exact same copy/images but as its own genuinely STANDALONE `py-100 bg-white`
// section (not nested inside "Clients Reviews", confirmed via source diff), with a real `.cta-section
// .style-2`/`.cta--content.style-2` modifier (not `.background-be`) and a real `image-effect-scale`
// hover wrapper on `.cta--image` (`.background-be`'s own version has none) — exposed via `variant`/
// `standalone` props rather than forking the component.
export default function DownloadAppCtaSection({
  variant = "background-be",
  standalone = false,
}: {
  variant?: "background-be" | "style-2";
  standalone?: boolean;
}) {
  const isStyle2 = variant === "style-2";

  const content = (
    <div className="container">
      <div className={`cta-section${isStyle2 ? " style-2" : " background-be"}`}>
        <div className={`cta--content wow fadeInUp${isStyle2 ? " style-2" : ""}`} data-wow-delay="0.1s">
          <h2 className="mb-12">Find Your Perfect Used Car Anytime, Anywhere!</h2>
          <p className="mb-32">
            Experience hassle-free car shopping with our app. Browse, compare, and buy used cars wherever
            you are – it&apos;s fast, simple, and convenient.
          </p>
          <div className="flex items-center gap-12">
            <a href="#">
              <Image className="h-40" src="/assets/images/brand/app-store-primary.png" alt="app-store" width={135} height={40} />
            </a>
            <a href="#">
              <Image className="h-40" src="/assets/images/brand/google-play-primary.png" alt="google-play" width={135} height={40} />
            </a>
          </div>
        </div>
        <div className={`cta--image wow fadeIn${isStyle2 ? " image-effect-scale" : ""}`} data-wow-delay="0.2s">
          <Image
            className="w-full object-fit-cover"
            src="/assets/images/home/banner-download-app.jpg"
            alt="banner-download-app"
            width={720}
            height={640}
          />
        </div>
      </div>
    </div>
  );

  if (standalone) {
    return <section className="py-100 bg-white">{content}</section>;
  }

  return (
    <>
      <div className="tf-spacing" />
      {content}
    </>
  );
}
