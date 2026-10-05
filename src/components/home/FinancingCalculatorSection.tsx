"use client";

import Image from "next/image";
import ParallaxImage from "@/components/common/ParallaxImage";

// Migrated from ../aurexo/index.html lines 2511-2573. Static/UI_ONLY — no JS handler anywhere wires
// `#Financing...`-style inputs on this page (same conclusion already reached for the near-identical
// inline calculator in `listing-details/ListingDetailsContent.tsx`, which shares the same static demo
// numbers by design, not coincidence). Kept as its own component rather than extracted/shared: the
// wrapping card, field grid (2-col here vs. 4-col there), and companion image column are genuinely
// different DOM.
//
// home-04.html reuses the same form/values but a genuinely different wrapper: no companion image
// column (the right `col-lg-6` is empty), `relative py-90` (not `background-light py-100`) with a real
// `simpleParallax` background (`.overlay.image`, `bg-video.jpg` — same mechanism as `ParallaxImage`),
// field `mb-8` (not `mb-10`) on the first two labels, and `action="calculator.html"` (not `#`) — exposed
// via `variant="parallax"` rather than forking the component. Source's own "Harga Mobil" input there also
// carries a literal stray `value="$46.300|"` (trailing pipe character, confirmed via direct source
// read) — kept verbatim as a disclosed source content quirk, not silently corrected.
//
// home-06.html reuses the same form/values yet again with a THIRD wrapper: `bg-white py-100` (not
// `background-light`/parallax), `.caculator-box.bg-white.outline.radius-12` (an `outline radius-12`
// modifier neither other variant has), `h2.mb-18` (not `mb-20`), `gap-22 gap-x-16` grid gap (not
// `gap-13`), `mb-2` result labels (not `mb-4`), and a plain `caculator-box--image` companion image
// class (not `max-w-628 ml-60 move5`) — exposed via `variant="outline"`. Also carries the same real
// stray `value="$46.300|"` trailing-pipe quirk as home-04's own version. home-06.html's own version
// also shares this SAME section with a following 2-column promo banner (`tf-spacing` + `car-box-
// style-3` pair, confirmed via source diff — one `bg-white py-100` section wraps both, not two
// separately-padded sections) — the `afterContent` slot renders that banner inside the same section.
//
// home-08.html reuses the exact same `.caculator-box.bg-white.outline.radius-12` shape, but with its
// own `background-light py-100` section (not `bg-white`), `h2.mb-20` (not `mb-18`), uniform `mb-8` on
// EVERY field label (not home-06's own mixed `mb-10`/`mb-8`), and `mb-4` result labels (not `mb-2`) —
// all real, confirmed per-page differences, exposed via 4 new props on the `"outline"` variant rather
// than a 4th variant string, since the wrapper/grid/image shape is otherwise identical to home-06's own.
export default function FinancingCalculatorSection({
  variant = "withImage",
  afterContent,
  outlineSectionClassName = "bg-white py-100",
  outlineHeadingClassName = "mb-18",
  outlinePriceRateLabelClassName = "mb-10",
  outlineResultLabelClassName = "mb-2",
  outlineImageClassName = "max-w-628 caculator-box--image",
}: {
  variant?: "withImage" | "parallax" | "outline";
  afterContent?: React.ReactNode;
  outlineSectionClassName?: string;
  outlineHeadingClassName?: string;
  outlinePriceRateLabelClassName?: string;
  outlineResultLabelClassName?: string;
  /** home-09.html's own companion image is `max-w-628 ml-60 move3` — a THIRD distinct animation-class
   *  variant (neither home-06's own plain `caculator-box--image` nor the default `"withImage"` variant's
   *  own `move5`), confirmed via source diff. */
  outlineImageClassName?: string;
}) {
  if (variant === "outline") {
    return (
      <section className={outlineSectionClassName}>
        <div className="container">
          <div className="row items-center">
            <div className="col-lg-6 wow fadeInUp">
              <div className="caculator-box bg-white outline radius-12">
                <h2 className={outlineHeadingClassName}>Simulasi Kredit</h2>

                <form action="calculator.html" onSubmit={(event) => event.preventDefault()}>
                  <div className="grid gap-22 gap-x-16 grid-cols-2 mb-20 md-grid-cols-1">
                    <div className="md-colspan-1">
                      <p className={outlinePriceRateLabelClassName}>Harga Mobil</p>
                      <input className="active" type="text" defaultValue="$46.300|" required />
                    </div>

                    <div className="md-colspan-1">
                      <p className={outlinePriceRateLabelClassName}>Bunga per Tahun</p>
                      <input type="text" defaultValue="1.2%" required />
                    </div>

                    <div className="md-colspan-1">
                      <p className="mb-8">Tenor Pinjaman (bulan)</p>
                      <select>
                        <option>60 bulan</option>
                        <option>30 months</option>
                        <option>10 months</option>
                      </select>
                    </div>

                    <div>
                      <p className="mb-8">Uang Muka</p>
                      <input type="text" defaultValue="$400" required />
                    </div>

                    <button type="submit" className="btn btn-medium btn-primary col-span-2">
                      Hitung
                    </button>
                  </div>

                  <div className="grid gap-8 grid-cols-3 md-grid-cols-1">
                    <div>
                      <p className={outlineResultLabelClassName}>Cicilan Bulanan:</p>
                      <p className="font-weight-600">$788.56/Month</p>
                    </div>

                    <div>
                      <p className={outlineResultLabelClassName}>Total Bunga:</p>
                      <p className="font-weight-600">$1413.60</p>
                    </div>

                    <div>
                      <p className={outlineResultLabelClassName}>Perk. Total Pinjaman:</p>
                      <p className="font-weight-600">$47713.60</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="col-lg-6 text-center wow fadeInUp">
              <Image
                className={outlineImageClassName}
                src="/assets/images/home/banner-calulator.png"
                alt="caculator-image"
                width={628}
                height={520}
              />
            </div>
          </div>
        </div>

        {afterContent && (
          <>
            <div className="tf-spacing" />
            {afterContent}
          </>
        )}
      </section>
    );
  }

  if (variant === "parallax") {
    return (
      <section className="relative py-90">
        <ParallaxImage src="/assets/images/banner/bg-video.jpg" />
        <div className="container">
          <div className="row">
            <div className="col-lg-6" />
            <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.2s">
              <div className="caculator-box bg-white p-40 md-mb-0">
                <h2 className="mb-20">Simulasi Kredit</h2>

                <form action="calculator.html" onSubmit={(event) => event.preventDefault()}>
                  <div className="grid gap-13 grid-cols-2 mb-20 md-grid-cols-1">
                    <div className="md-colspan-1">
                      <p className="mb-8">Harga Mobil</p>
                      <input id="Harga" name="Harga" className="active" type="text" defaultValue="$46.300|" required />
                    </div>

                    <div className="md-colspan-1">
                      <p className="mb-8">Bunga per Tahun</p>
                      <input id="Rate" name="Rate" type="text" defaultValue="1.2%" required />
                    </div>

                    <div className="md-colspan-1">
                      <p className="mb-8">Tenor Pinjaman (bulan)</p>
                      <select>
                        <option>60 bulan</option>
                        <option>30 months</option>
                        <option>10 months</option>
                      </select>
                    </div>

                    <div className="md-colspan-1">
                      <p className="mb-8">Uang Muka</p>
                      <input name="Payment" id="Payment" type="text" defaultValue="$400" required />
                    </div>

                    <button type="submit" className="btn btn-medium btn-primary col-span-2">
                      Hitung
                    </button>
                  </div>

                  <div className="grid gap-8 grid-cols-3 md-grid-cols-1">
                    <div>
                      <p className="mb-4">Cicilan Bulanan:</p>
                      <p className="font-weight-600">$788.56/Month</p>
                    </div>

                    <div>
                      <p className="mb-4">Total Bunga:</p>
                      <p className="font-weight-600">$1413.60</p>
                    </div>

                    <div>
                      <p className="mb-4">Perk. Total Pinjaman:</p>
                      <p className="font-weight-600">$47713.60</p>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="background-light py-100">
      <div className="container">
        <div className="row items-center">
          <div className="col-lg-6 wow fadeInUp" data-wow-delay="0.1s">
            <div className="caculator-box bg-white p-40">
              <h2 className="mb-20">Simulasi Kredit</h2>

              <form action="#" onSubmit={(event) => event.preventDefault()}>
                <div className="grid gap-13 grid-cols-2 mb-20 md-grid-cols-1">
                  <div className="md-colspan-1">
                    <p className="mb-10">Harga Mobil</p>
                    <input className="active" type="text" defaultValue="$46.300" required />
                  </div>

                  <div className="md-colspan-1">
                    <p className="mb-10">Bunga per Tahun</p>
                    <input type="text" defaultValue="1.2%" required />
                  </div>

                  <div className="md-colspan-1">
                    <p className="mb-8">Tenor Pinjaman (bulan)</p>
                    <select>
                      <option>60 bulan</option>
                      <option>30 months</option>
                      <option>10 months</option>
                    </select>
                  </div>

                  <div>
                    <p className="mb-8">Uang Muka</p>
                    <input type="text" defaultValue="$400" required />
                  </div>

                  <button type="submit" className="btn btn-medium btn-primary col-span-2">
                    Hitung
                  </button>
                </div>

                <div className="grid gap-8 grid-cols-3 md-grid-cols-1">
                  <div>
                    <p className="mb-4">Cicilan Bulanan:</p>
                    <p className="font-weight-600">$788.56/Month</p>
                  </div>

                  <div>
                    <p className="mb-4">Total Bunga:</p>
                    <p className="font-weight-600">$1413.60</p>
                  </div>

                  <div>
                    <p className="mb-4">Perk. Total Pinjaman:</p>
                    <p className="font-weight-600">$47713.60</p>
                  </div>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-6 text-center wow fadeInUp" data-wow-delay="0.3s">
            <Image
              className="max-w-628 ml-60 move5"
              src="/assets/images/home/banner-calulator.png"
              alt="caculator-image"
              width={628}
              height={520}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
