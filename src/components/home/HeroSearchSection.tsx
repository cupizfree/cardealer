"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Parallax } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import CheckboxDropdown from "@/components/listing/CheckboxDropdown";
import FilterSelectDropdown from "@/components/common/FilterSelectDropdown";
import RangeSlider from "@/components/listing/RangeSlider";
import { CAR_TYPE_ICONS } from "./carTypeIcons";

// Hero's own `.category-list` stops at 9 types and omits Wagon/Minivan (added only in
// `BrowseByTypeSection`'s 10-item list) — confirmed via direct source read.
const CAR_TYPES = [
  "Listrik",
  "Sedan",
  "SUV",
  "Pikap",
  "Mewah",
  "Hatchback",
  "Crossover",
  "Konvertibel",
  "Coupe",
];

// Migrated from ../aurexo/index.html lines 458-1105 (`.page-title`). Everything under this section —
// tab pills, all filter fields, "Tampilkan 1.029 Unit", and the year range — is UI_ONLY: the homepage
// has no real listing grid to filter, so every field is local, decorative-only state, same scope
// decision already made for `TopSearchFilterBar.tsx`'s own Miles/Price/DriveType/Color/Cylinders/Year
// fields (see that file's header comment). The source's ~40-checkbox "Fitur" collapse under
// Advanced Filters is deliberately NOT reproduced, per the same precedent (COMPONENT_MAP.md #28):
// purely decorative filler riddled with copy-paste id/label mismatches, no functional payoff.
// Fuel Type/Transmission/Drive Type/Color/Cylinders reuse `common/FilterSelectDropdown` (no
// `search-cars__select-wrapper`/label wrapper in source, unlike the primary Brand/Model/Miles/Price
// row, which uses `listing/CheckboxDropdown` instead — a real, confirmed DOM difference between the
// two rows, not an inconsistency on our part).
const DEFAULT_SUBTITLE_CLASS = "h7 text-white font-weight-500 mb-36 text-center wow fadeInUp";
const DEFAULT_BANNER_ORDER = ["banner-1.jpg", "banner-2.jpg", "banner-3.jpg", "banner-5.jpg"];

export default function HeroSearchSection({
  title = "Cari Mobil di Sekitar Anda - Beli Hari Ini!",
  subtitle,
  subtitleClassName = DEFAULT_SUBTITLE_CLASS,
  titleCentered = false,
  sectionModifierClass,
  heightClass = "h-706",
  showNavArrows = false,
  bannerOrder = DEFAULT_BANNER_ORDER,
  categoryHref = "/listing-grid4-columns",
  showCategoryList = true,
  showSlider = true,
  staticImageSrc,
  sliderExtraClassName,
  titleTag: TitleTag = "h1",
  titleExtraClassName,
  filterButtonStyle2,
  showFlex = true,
  searchCarsClassName = "margin-top-auto margin-bottom-auto",
  searchCarsWowDelay,
  showMobileSpacer = false,
  tabTextColorClass = "text-white",
  titleWowDelay = "0.1s",
  tabsWowDelay = "0.3s",
  filtersWowDelay = "0.5s",
}: {
  /** A plain string for most pages; home-03.html's own h1 has a literal mid-string `<br>`
   *  ("Browse, Compare, Drive <br> Find Your Car!"), so this accepts any ReactNode. */
  title?: React.ReactNode;
  subtitle?: React.ReactNode;
  /** home-03.html's own subtitle `<p>` lacks `font-weight-500`/`text-center` (confirmed via source
   *  diff) — index.html/home-02.html's shared default is kept as the fallback. */
  subtitleClassName?: string;
  titleCentered?: boolean;
  /** Extra modifier classes seen on some home variants, e.g. "page-title-style-2
   *  effect-content-slide effect-2" (home-02.html) — index.html's own hero has none. */
  sectionModifierClass?: string;
  /** index.html's own hero literally carries `h-706` in source; home-02.html/home-03.html's own
   *  hero sections carry NO such utility class at all (confirmed via source diff) — their real
   *  height comes entirely from `page-title-style-2`/`-3`'s own SCSS (662px/664px). Shipping the
   *  hardcoded `h-706` unconditionally on every variant was a real bug (a stray 706px utility class
   *  silently fighting the page's own real height rule); pass `""` to omit it. */
  heightClass?: string;
  /** home-02.html adds real `.swiper-btn.navigation-prev/next` buttons wired to the hero swiper's
   *  navigation module — index.html's hero has none (autoplay+pagination only). */
  showNavArrows?: boolean;
  /** home-03.html's own slide sequence is banner-3,1,2,5 (same 4 images, different order) —
   *  confirmed via source diff against index.html/home-02.html's shared banner-1,2,3,5 order. */
  bannerOrder?: string[];
  /** index.html's `.category-list` links to `/listing-grid4-columns`; home-02.html's own links to
   *  `/dealer-details` instead — a real, disclosed per-page href difference. */
  categoryHref?: string;
  /** home-03.html's hero has NO `.category-list` at all (confirmed via grep — genuinely absent, not
   *  an oversight) — index.html/home-02.html both have one. */
  showCategoryList?: boolean;
  /** home-07.html's own `.page-title-style-5.background-blue` variant has NO swiper background slider
   *  at all — no `.page-title--slider` wrapper, no nav arrows, no bullet pagination (confirmed via grep
   *  — genuinely absent). `false` skips the entire swiper block below. */
  showSlider?: boolean;
  /** home-07.html's own variant instead shows one static `.page-title--image` below the filter bar
   *  (confirmed via source read) — rendered when `showSlider` is false and this is set. */
  staticImageSrc?: string;
  /** home-09.html's own `.page-title--slider` carries a real `radius-40` modifier (rounded corners,
   *  confirmed via source diff — its whole page uses `radius-40` on every section), appended to the
   *  default `page-title--slider sw-single` classes. */
  sliderExtraClassName?: string;
  /** home-07.html's own title is a real `<h2>`, not `<h1>` like every other page-title hero (confirmed
   *  via source diff) — a genuine, disclosed heading-level inconsistency in source, preserved rather
   *  than silently normalized to `<h1>`. */
  titleTag?: "h1" | "h2";
  /** home-07.html's own title carries `text-primary letter-normal` in addition to `text-center`
   *  (confirmed via source diff) — appended after the computed `wow fadeInUp`/`text-center` classes. */
  titleExtraClassName?: string;
  /** Retroactive fix: the "Toggle advanced filters" button's `style2` modifier was bundled under
   *  `titleCentered`, but home-07.html's own version has `margin-auto`/`text-center` (same as
   *  `titleCentered`'s other effects) WITHOUT `style2` on this button (confirmed via source diff) — a
   *  real, independent per-page difference, not always paired. Defaults to `titleCentered` so
   *  home-02.html's own existing behavior (both together) is unchanged. */
  filterButtonStyle2?: boolean;
  /** RETROACTIVE FIX: this component always hardcoded `flex` on the root `.page-title` section, but
   *  home-07.html's own real source (`page-title-style-5`) has NO `flex` class at all (confirmed via
   *  source diff against index.html/home-02/03/05/09.html, which all genuinely do carry it) —
   *  `page-title-style-5`'s own SCSS is a plain padded block layout, not a flex-centered hero, so the
   *  unconditional `flex` was laying out `.search-cars` and the static-image `.container` as flex ROW
   *  siblings instead of normal stacked blocks, a real, significant layout break. Defaults to `true` so
   *  every other existing caller is unaffected. */
  showFlex?: boolean;
  /** RETROACTIVE FIX: this component always hardcoded `margin-top-auto margin-bottom-auto` on
   *  `.search-cars` (a vertical-centering trick that only makes sense inside the `flex` parent above) —
   *  correct for index.html/home-02/03.html's own real source, but home-07.html's own is plain
   *  `search-cars container` (no margin-auto at all, consistent with `showFlex={false}` there) and
   *  home-09.html's own is `margin-top-auto wow fadeInUp` (no `margin-bottom-auto`, plus a real WOW.js
   *  reveal animation) — both confirmed via source diff. Defaults to the index/home-02/03 value so
   *  those callers are unaffected. */
  searchCarsClassName?: string;
  /** Pairs with `searchCarsClassName`'s own `wow` class on home-09.html — its `data-wow-delay="0.1s"`. */
  searchCarsWowDelay?: string;
  /** home-07.html's own hero has one extra `<div class="tf-spacing-style2 lg-hidden">` (a 90px,
   *  large-screen-hidden spacer) right after the `.page-title` section, inside the same `<form>`
   *  (confirmed via source diff — no other `HeroSearchSection` caller has this). */
  showMobileSpacer?: boolean;
  /** RETROACTIVE FIX: the "Semua Mobil"/"Mobil Baru"/"Mobil Bekas" tab labels always hardcoded `text-white`, but
   *  home-07.html's own real source uses `text-primary` (dark) on these specific `<span>`s (confirmed
   *  via source diff — every other caller genuinely is `text-white`) — because home-07's own hero sits
   *  on a pale `background-blue` (`#D8E2EA`) rather than a photo/dark background, white text there would
   *  render almost invisibly. The outer `<ul>` itself keeps `text-white` unconditionally on every page
   *  (including home-07's own source), only the inner label spans differ. Defaults to `text-white` so
   *  every other existing caller is unaffected. */
  tabTextColorClass?: string;
  /** RETROACTIVE FIX: the title/tab-bar/filters-row `wow fadeInUp` stagger delays were hardcoded to
   *  index.html's own sequence (`0.1s`/`0.3s`/`0.5s`). home-02.html's/home-03.html's own real sequence is
   *  `0.1s`/`0.5s`/`0.7s` (confirmed via source diff) — a natural consequence of their own subtitle
   *  `<p>` occupying the `0.3s` slot, shifting everything after it by 0.2s, which the previous hardcoded
   *  values never accounted for. home-09.html's own hero has NO `wow` animation on the title/tabs/filters
   *  at all (confirmed via source diff — only the outer `.search-cars` wrapper itself animates as one
   *  block); pass `null` to omit the `wow`/`data-wow-delay` on that element entirely. Defaults match
   *  index.html's/home-07.html's own real sequence. */
  titleWowDelay?: string | null;
  tabsWowDelay?: string | null;
  filtersWowDelay?: string | null;
}) {
  const [activeTab, setActiveTab] = useState<"all" | "new" | "used">("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2026]);
  const swiperRef = useRef<SwiperClass | null>(null);
  const prevRef = useRef<HTMLParagraphElement>(null);
  const nextRef = useRef<HTMLParagraphElement>(null);
  // Reproduces swiper.js's own `.sw-single` init handler: real parallax on `.tp-showcase-slider-bg`
  // (Swiper's Parallax module, `data-swiper-parallax` set to 75% of the swiper's own pixel width) — not
  // just a static background-image swap. Read once on init, same as source (its own `resize` handler
  // only calls `swiper.update()`, never recomputes this value either).
  const [parallaxValue, setParallaxValue] = useState<number | null>(null);

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <form
      action="#"
      onSubmit={(event) => event.preventDefault()}
      className="relative"
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
          setOpenDropdown(null);
        }
      }}
    >
      <section
        className={`page-title${showFlex ? " flex" : ""}${heightClass ? ` ${heightClass}` : ""}${
          sectionModifierClass ? ` ${sectionModifierClass}` : ""
        }`}
      >
        {showSlider && showNavArrows && (
          <>
            <p className="swiper-btn navigation-prev" ref={prevRef}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z" fill="white" />
              </svg>
            </p>
            <p className="swiper-btn navigation-next" ref={nextRef}>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z" fill="white" />
              </svg>
            </p>
          </>
        )}

        {showSlider && (
        <div className={`page-title--slider sw-single${sliderExtraClassName ? ` ${sliderExtraClassName}` : ""}`}>
          <Swiper
            modules={[Autoplay, Navigation, Pagination, Parallax]}
            loop
            speed={1000}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ el: ".pagination-page-title--slider-1", clickable: true }}
            navigation={showNavArrows ? { prevEl: prevRef.current, nextEl: nextRef.current } : undefined}
            parallax
            onBeforeInit={(swiper) => {
              if (showNavArrows && swiper.params.navigation && typeof swiper.params.navigation !== "boolean") {
                swiper.params.navigation.prevEl = prevRef.current;
                swiper.params.navigation.nextEl = nextRef.current;
              }
              swiperRef.current = swiper;
            }}
            onInit={(swiper) => setParallaxValue(swiper.width * 0.75)}
            className="h-full"
          >
            {bannerOrder.map((file) => (
              <SwiperSlide key={file}>
                <div
                  className="tp-showcase-slider-bg"
                  data-swiper-parallax={parallaxValue ?? undefined}
                  style={{ backgroundImage: `url(/assets/images/page-title/${file})` }}
                />
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
        )}

        <div
          className={`search-cars container${searchCarsClassName ? ` ${searchCarsClassName}` : ""}`}
          data-wow-delay={searchCarsWowDelay}
        >
          <TitleTag
            className={`search-cars__title${titleWowDelay ? " wow fadeInUp" : ""}${titleCentered ? " text-center" : ""}${
              titleExtraClassName ? ` ${titleExtraClassName}` : ""
            }`}
            data-wow-delay={titleWowDelay ?? undefined}
          >
            {title}
          </TitleTag>
          {subtitle && (
            <p className={subtitleClassName} data-wow-delay="0.3s">
              {subtitle}
            </p>
          )}

          <div
            className={`flat-tabs mb-16${tabsWowDelay ? " wow fadeInUp" : ""}`}
            data-wow-delay={tabsWowDelay ?? undefined}
          >
            <div className="overflow-x-auto">
              <ul className={`menu-tab menu-tab-style1 text-white${titleCentered ? " margin-auto" : ""}`}>
                <li className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
                  <span className={`${tabTextColorClass} font-weight-600`}>Semua Mobil</span>
                </li>
                <li className={activeTab === "new" ? "active" : ""} onClick={() => setActiveTab("new")}>
                  <span className={`${tabTextColorClass} font-weight-600`}>Mobil Baru</span>
                </li>
                <li className={activeTab === "used" ? "active" : ""} onClick={() => setActiveTab("used")}>
                  <span className={`${tabTextColorClass} font-weight-600`}>Mobil Bekas</span>
                </li>
              </ul>
            </div>
          </div>

          <div
            className={`search-cars__filters${filtersWowDelay ? " wow fadeInUp" : ""}`}
            data-wow-delay={filtersWowDelay ?? undefined}
          >
            <CheckboxDropdown
              name="brand"
              label="Pilih Merek"
              toggleId="HeroBrandSelectToggle"
              defaultText="Semua Merek"
              options={["Toyota", "Honda", "Daihatsu", "Suzuki", "Mitsubishi", "Nissan"]}
              isOpen={openDropdown === "brand"}
              onToggleOpen={() => toggleDropdown("brand")}
              layout="bar"
            />
            <CheckboxDropdown
              name="model"
              label="Pilih Model"
              toggleId="HeroModelSelectToggle"
              defaultText="Semua Model"
              options={["Avanza", "Brio", "Xenia", "Ertiga", "Rush", "Mobilio"]}
              isOpen={openDropdown === "model"}
              onToggleOpen={() => toggleDropdown("model")}
              layout="bar"
            />
            <CheckboxDropdown
              name="miles"
              label="Jarak Tempuh"
              toggleId="HeroMilesSelectToggle"
              defaultText="Semua jarak"
              options={["0-50rb km", "50-100rb km"]}
              isOpen={openDropdown === "miles"}
              onToggleOpen={() => toggleDropdown("miles")}
              layout="bar"
            />
            <CheckboxDropdown
              name="price"
              label="Harga Maksimal"
              toggleId="HeroMaxPriceSelectToggle"
              defaultText="Semua Harga"
              options={["Rp 0-100 jt", "Rp 100-200 jt"]}
              isOpen={openDropdown === "price"}
              onToggleOpen={() => toggleDropdown("price")}
              layout="bar"
            />

            <button
              type="button"
              className={`search-cars__filter${(filterButtonStyle2 ?? titleCentered) ? " style2" : ""}`}
              id="filterToggle"
              aria-label="Buka filter lanjutan"
              onClick={() => setIsAdvancedOpen((prev) => !prev)}
            >
              <Image src="/assets/icons/filter.svg" alt="Filter" width={20} height={20} />
            </button>

            <button type="submit" className="search-cars__search flex items-center gap-8 justify-center md-w-full">
              <Image src="/assets/icons/search.svg" alt="search" width={16} height={16} />
              Tampilkan 1.029 Unit
            </button>
          </div>

          {isAdvancedOpen && (
            <div className="search-cars__advanced" id="advancedFilters" style={{ display: "block" }}>
              <div className="search-cars__advanced-content">
                <div className="search-cars__advanced-row">
                  <div className="search-cars__select-wrapper">
                    <FilterSelectDropdown
                      name="fuel-type"
                      options={[
                        { value: "Bensin", label: "Bensin" },
                        { value: "Solar", label: "Solar" },
                        { value: "Listrik", label: "Listrik" },
                      ]}
                      isOpen={openDropdown === "fuel-type"}
                      onToggleOpen={() => toggleDropdown("fuel-type")}
                    />
                  </div>
                  <div className="search-cars__select-wrapper">
                    <FilterSelectDropdown
                      name="Transmisi"
                      options={[
                        { value: "Manual", label: "Manual" },
                        { value: "Matic", label: "Matic" },
                      ]}
                      isOpen={openDropdown === "Transmisi"}
                      onToggleOpen={() => toggleDropdown("Transmisi")}
                    />
                  </div>
                  <div className="search-cars__select-wrapper">
                    <FilterSelectDropdown
                      name="DriveType"
                      options={[
                        { value: "FWD", label: "FWD" },
                        { value: "RWD", label: "RWD" },
                        { value: "AWD", label: "AWD" },
                      ]}
                      isOpen={openDropdown === "DriveType"}
                      onToggleOpen={() => toggleDropdown("DriveType")}
                    />
                  </div>
                  <div className="search-cars__select-wrapper">
                    <FilterSelectDropdown
                      name="colorTyle"
                      options={[
                        { value: "Red", label: "Merah" },
                        { value: "Biru", label: "Biru" },
                        { value: "Hitam", label: "Hitam" },
                      ]}
                      isOpen={openDropdown === "colorTyle"}
                      onToggleOpen={() => toggleDropdown("colorTyle")}
                    />
                  </div>
                  <div className="search-cars__select-wrapper">
                    <FilterSelectDropdown
                      name="Silinder"
                      options={[
                        { value: "4", label: "4" },
                        { value: "3", label: "3" },
                        { value: "2", label: "2" },
                      ]}
                      isOpen={openDropdown === "Silinder"}
                      onToggleOpen={() => toggleDropdown("Silinder")}
                    />
                  </div>
                  <div className="search-cars__range">
                    <p className="search-cars__range-label">
                      Tahun: <span>{yearRange[0]}</span> - <span>{yearRange[1]}</span>
                    </p>
                    <div className="search-cars__range-wrapper" id="yearRangeWrapper">
                      <RangeSlider min={2015} max={2026} step={1} value={yearRange} onChange={setYearRange} />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {showCategoryList && (
            <div className="wow fadeInUp" data-wow-delay="0.7s">
              <div className="category-list flex-wrap mt-32">
                {CAR_TYPES.map((type) => (
                  <Link className="brand-item-small" href={categoryHref} key={type}>
                    {CAR_TYPE_ICONS[type]}
                    {type}
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {!showSlider && staticImageSrc && (
          <div className="container wow fadeInUp" data-wow-delay="0.7s">
            <div className="page-title--image">
              <Image className="w-full" src={staticImageSrc} alt="page-title-bg" width={1200} height={500} />
            </div>
          </div>
        )}

        <div className="swiper-pagination pagination-white pagination-style pagination-page-title--slider-1 mt-38" />
      </section>
      {showMobileSpacer && <div className="tf-spacing-style2 lg-hidden" />}
    </form>
  );
}
