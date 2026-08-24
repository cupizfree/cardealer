import Image from "next/image";
import Link from "next/link";
import CountUpNumber from "./CountUpNumber";

// Extracted out of `about-us/WhyChooseUs.tsx` once home-03.html needed the exact same "Why Choose Us"
// content (same image/checklist/CTA/stats — confirmed byte-identical via source diff) on a dark
// (`bg-primary`) background instead of light — same "extract into `common/` once a second page needs
// it" precedent as `Pagination`/`ClientsReviewsCarousel`. `animateCounters` reproduces `app.js`'s real
// `flatCounter()`, which only ever runs when `<body>` carries `counter-scroll` (about-us.html's body
// lacks it — stays static there; home-03.html's body has it — real animated count-up there, see
// `CountUpNumber.tsx`).
const stats: Array<{ dataTo: number; decimals?: number; suffix: string; label: string }> = [
  { dataTo: 18, suffix: "K+", label: "Car For Sale" },
  { dataTo: 8, suffix: "k+", label: "Visitors per day" },
  { dataTo: 4.5, decimals: 1, suffix: "k+", label: "Dealer Reviews" },
  { dataTo: 3.5, decimals: 1, suffix: "k+", label: "Verified Dealers" },
];

export default function WhyChooseUsSection({
  variant = "light",
  animateCounters = false,
  wrapperClassName,
  statsGridModifierClass,
  sectionExtraClassName,
  headingClassName,
}: {
  variant?: "light" | "dark";
  animateCounters?: boolean;
  /** home-04.html's own version is `.why-choose-us.outline.style2` — a real, confirmed 3rd modifier
   *  combo (light background like `variant="light"`, but neither `style3` nor plain) not covered by
   *  the binary variant split. Defaults to each variant's own established classes when omitted. */
  wrapperClassName?: string;
  /** home-04.html's own stat grid is `gap-30` (no `counter-spacing`) even though its background is
   *  light, unlike `variant="light"`'s own `gap-130 counter-spacing` — confirmed via source diff.
   *  Defaults to each variant's own established classes when omitted. */
  statsGridModifierClass?: string;
  /** home-09.html's own section carries a real `radius-40` modifier (rounded corners, same page-wide
   *  signature as its hero/other sections, confirmed via source diff) appended to the computed
   *  `py-100 background-light`/`py-100 bg-primary` base. */
  sectionExtraClassName?: string;
  /** home-09.html's own heading is `mb-15` (not `mb-12` like every other caller, confirmed via source
   *  diff). Defaults to each variant's own established class when omitted. */
  headingClassName?: string;
}) {
  const dark = variant === "dark";
  const resolvedWrapperClassName = wrapperClassName ?? (dark ? "" : "style2 style3");
  const resolvedStatsGridClass = statsGridModifierClass ?? (dark ? "gap-30" : "gap-130 counter-spacing");
  const resolvedHeadingClassName = headingClassName ?? (dark ? "text-white mb-12" : "mb-12");

  return (
    <section className={`py-100${dark ? " bg-primary" : " background-light"}${sectionExtraClassName ? ` ${sectionExtraClassName}` : ""}`}>
      <div className="container">
        <div className={`why-choose-us${resolvedWrapperClassName ? ` ${resolvedWrapperClassName}` : ""}`}>
          <div className="wow fadeIn" data-wow-delay="0.1s">
            <Image className="move5" src="/assets/images/card/why-choose-us.png" alt="why-choose-us" width={1210} height={710} />
          </div>

          <div className="wow fadeIn" data-wow-delay={dark ? "0.3s" : "0.2s"}>
            <h2 className={resolvedHeadingClassName}>Why Choose Us?</h2>
            <p className="text-muted mb-20">
              Explore our wide selection, competitive prices, and exceptional service for a hassle-free
              car-buying experience.
            </p>

            <ul className="list mb-32">
              <li className={`flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start${dark ? " text-white" : ""}`}>
                <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
                Wide Selection – A variety of cars to fit every need.
              </li>
              <li className={`flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start${dark ? " text-white" : ""}`}>
                <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
                Competitive Prices: Great deals and flexible financing.
              </li>
              <li className={`flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start${dark ? " text-white" : ""}`}>
                <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
                Trusted Service: Transparent, honest, and reliable.
              </li>
              <li className={`flex items-center gap-12 mb-8 font-weight-500 h7 md-items-start${dark ? " text-white" : ""}`}>
                <Image src="/assets/icons/check.svg" alt="check" width={20} height={20} />
                Excellent Support: Always here to assist you.
              </li>
            </ul>

            <Link
              href="/sell-your-car"
              className={`btn btn-large font-weight-600 max-w-min${dark ? " btn-white text-primary" : " btn-primary"}`}
            >
              Find Your Car Now!
            </Link>
          </div>
        </div>

        <div className={`grid grid-cols-4 md-grid-cols-2 ${resolvedStatsGridClass}`}>
          {stats.map((stat, index) => (
            <div
              key={stat.label}
              className={`box-couter-item${index < 3 ? " outline-right" : ""} wow fadeInUp`}
              data-wow-delay={`${(index + 1) * 0.1}s`}
            >
              <div className="content">
                <div className="box-couter counter">
                  <div className={`number-content font-main-2${dark ? " text-white" : ""}`}>
                    {animateCounters ? (
                      <CountUpNumber
                        className={`count-number font-main-2${dark ? " text-white" : ""}`}
                        to={stat.dataTo}
                        speed={1500}
                        decimals={stat.decimals}
                      />
                    ) : (
                      <span
                        className={`count-number font-main-2${dark ? " text-white" : ""}`}
                        data-to={stat.dataTo}
                        data-speed="1500"
                        data-decimals={stat.decimals}
                        data-inviewport="yes"
                      >
                        {stat.dataTo.toFixed(stat.decimals ?? 0).replace(".", ",")}
                      </span>
                    )}
                    {stat.suffix}
                  </div>
                </div>
                <p className="font-weight-500 text-muted h7 text-center">{stat.label}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
