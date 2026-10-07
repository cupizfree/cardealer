"use client";

import { useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Navigation, Pagination, Parallax } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import CheckboxDropdown from "@/components/listing/CheckboxDropdown";
import { useKatalog } from "@/components/common/KatalogProvider";
import {
  KATALOG_SEMUA,
  bahanBakarDiStok,
  jenisDiStok,
  merekDiStok,
  modelDiStok,
  transmisiDiStok,
} from "@/lib/faset";
import { RENTANG_HARGA, RENTANG_JARAK } from "@/lib/saring";
import { CAR_TYPE_ICONS } from "./carTypeIcons";

/**
 * Ikon untuk tiap slug jenis bodi.
 *
 * `CAR_TYPE_ICONS` memakai nama kategori versi templat (SUV, Minivan, Pickup
 * Truck, …) sedangkan katalog memakai slug Indonesia (`suv`, `mpv`, `pikap`, …).
 * Peta ini yang menjembatani keduanya, dan sengaja tidak mengubah nama kunci di
 * `carTypeIcons.tsx` karena berkas itu dipakai lima komponen lain.
 */
const IKON_JENIS: Record<string, string> = {
  suv: "SUV",
  mpv: "Minivan",
  hatchback: "Hatchback",
  "city-car": "Hatchback",
  sedan: "Sedan",
  pikap: "Pickup Truck",
  "double-cabin": "Pickup Truck",
  minibus: "Minivan",
};

// Migrated from ../aurexo/index.html lines 458-1105 (`.page-title`).
//
// SEBELUMNYA SELURUH BAGIAN INI HIASAN, dan itu dilaporkan apa adanya: tombolnya
// berbunyi "Tampilkan 1.029 Unit" padahal stok showroom ini 18 unit, tombol
// carinya `action="#"` dengan `onSubmit` yang cuma `preventDefault` (ditekan,
// tidak terjadi apa-apa), daftar mereknya ditulis tangan (Toyota…Nissan — tidak
// ikut stok), dan sembilan ikon jenis mobil semuanya menuju SATU alamat yang
// sama sehingga memilih SUV atau Sedan memberi hasil identik.
//
// Sekarang seluruhnya membaca stok sungguhan lewat `useKatalog()` dan menyerahkan
// hasilnya ke halaman katalog lewat kueri URL yang sama dengan yang dibaca
// `src/lib/saring.ts`. Jadi tidak ada jalur kedua yang bisa melenceng dari
// penyaring di halaman listing.
//
// Yang dibuang karena tidak punya data pendukung sama sekali: tab "Semua Mobil /
// Mobil Baru / Mobil Bekas" (tidak ada kolom kondisi di `Listing` — semua unit
// memang bekas) dan isian Penggerak/Warna/Silinder/Tahun di panel lanjutan.
// Menampilkannya berarti menawarkan saringan yang tidak menyaring apa pun.
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
  titleWowDelay = "0.1s",
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
  /** RETROACTIVE FIX: the title/filters-row `wow fadeInUp` stagger delays were hardcoded to
   *  index.html's own sequence (`0.1s`/`0.3s`/`0.5s`). home-02.html's/home-03.html's own real sequence is
   *  `0.1s`/`0.5s`/`0.7s` (confirmed via source diff) — a natural consequence of their own subtitle
   *  `<p>` occupying the `0.3s` slot, shifting everything after it by 0.2s. home-09.html's own hero has
   *  NO `wow` animation at all (confirmed via source diff); pass `null` to omit it entirely.
   *  `tabsWowDelay` dihapus bersama tabnya — baris isian kini memakai `filtersWowDelay`. */
  titleWowDelay?: string | null;
  filtersWowDelay?: string | null;
}) {
  const router = useRouter();
  const katalog = useKatalog();

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const swiperRef = useRef<SwiperClass | null>(null);
  const prevRef = useRef<HTMLParagraphElement>(null);
  const nextRef = useRef<HTMLParagraphElement>(null);
  // Reproduces swiper.js's own `.sw-single` init handler: real parallax on `.tp-showcase-slider-bg`
  // (Swiper's Parallax module, `data-swiper-parallax` set to 75% of the swiper's own pixel width) — not
  // just a static background-image swap. Read once on init, same as source (its own `resize` handler
  // only calls `swiper.update()`, never recomputes this value either).
  const [parallaxValue, setParallaxValue] = useState<number | null>(null);

  const [merek, setMerek] = useState<string[]>([]);
  const [model, setModel] = useState<string[]>([]);
  const [bahanBakar, setBahanBakar] = useState<string[]>([]);
  const [transmisi, setTransmisi] = useState<string[]>([]);
  // Harga dan jarak satu pilihan: keduanya bermuara ke SATU pasangan batas di
  // `FilterState`, jadi dua kotak sekaligus tidak bisa diwakili.
  const [harga, setHarga] = useState<string[]>([]);
  const [jarak, setJarak] = useState<string[]>([]);

  const opsiMerek = merekDiStok(katalog).map((m) => m.label);
  const opsiModel = modelDiStok(katalog).map((m) => m.label);
  const opsiBahanBakar = bahanBakarDiStok(katalog).map((b) => b.label);
  const opsiTransmisi = transmisiDiStok(katalog).map((t) => t.label);
  const jenis = jenisDiStok(katalog);

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  function toggle(list: string[], set: (v: string[]) => void, value: string) {
    set(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  }

  /** Satu pilihan saja: klik kedua membatalkan. */
  function toggleTunggal(list: string[], set: (v: string[]) => void, value: string) {
    set(list.includes(value) ? [] : [value]);
  }

  function teksTombol(dipilih: string[], kosong: string, label?: (v: string) => string): string {
    if (dipilih.length === 0) return kosong;
    const tampil = dipilih.map((v) => label?.(v) ?? v);
    return tampil.length === 1 ? tampil[0] : `${tampil.length} dipilih`;
  }

  /**
   * Serahkan pilihan ke halaman katalog sebagai kueri URL.
   *
   * Sengaja `router.push` ke halaman listing, bukan menyaring di tempat: beranda
   * tidak punya grid unit untuk disaring, dan menyalin logika penyaring ke sini
   * berarti dua tempat yang bisa saling melenceng. Kunci kuerinya sama persis
   * dengan yang dibaca `src/lib/saring.ts`.
   */
  function cari(event: React.FormEvent) {
    event.preventDefault();
    const q = new URLSearchParams();
    if (merek.length) q.set("merek", merek.join(","));
    if (model.length) q.set("model", model.join(","));
    if (harga.length) q.set("harga", harga[0]);
    if (jarak.length) q.set("jarak", jarak[0]);
    if (bahanBakar.length) q.set("bahan_bakar", bahanBakar.join(","));
    if (transmisi.length) q.set("transmisi", transmisi.join(","));
    const s = q.toString();
    router.push(s ? `${KATALOG_SEMUA}?${s}` : KATALOG_SEMUA);
  }

  return (
    <form
      action={KATALOG_SEMUA}
      method="get"
      onSubmit={cari}
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
            className={`search-cars__filters${filtersWowDelay ? " wow fadeInUp" : ""}${
              titleCentered ? " justify-center" : ""
            }`}
            data-wow-delay={filtersWowDelay ?? undefined}
          >
            <CheckboxDropdown
              name="merek"
              label="Pilih Merek"
              toggleId="HeroBrandSelectToggle"
              defaultText={teksTombol(merek, "Semua Merek")}
              options={opsiMerek}
              selected={merek}
              onToggle={(value) => toggle(merek, setMerek, value)}
              isOpen={openDropdown === "brand"}
              onToggleOpen={() => toggleDropdown("brand")}
              layout="bar"
            />
            <CheckboxDropdown
              name="model"
              label="Pilih Model"
              toggleId="HeroModelSelectToggle"
              defaultText={teksTombol(model, "Semua Model")}
              options={opsiModel}
              selected={model}
              onToggle={(value) => toggle(model, setModel, value)}
              isOpen={openDropdown === "model"}
              onToggleOpen={() => toggleDropdown("model")}
              layout="bar"
            />
            <CheckboxDropdown
              name="jarak"
              label="Jarak Tempuh"
              toggleId="HeroMilesSelectToggle"
              defaultText={teksTombol(jarak, "Semua jarak", (v) => RENTANG_JARAK.find((r) => r.slug === v)?.label ?? v)}
              options={RENTANG_JARAK.map((r) => ({ value: r.slug, label: r.label }))}
              selected={jarak}
              onToggle={(value) => toggleTunggal(jarak, setJarak, value)}
              isOpen={openDropdown === "miles"}
              onToggleOpen={() => toggleDropdown("miles")}
              layout="bar"
            />
            <CheckboxDropdown
              name="harga"
              label="Harga Maksimal"
              toggleId="HeroMaxPriceSelectToggle"
              defaultText={teksTombol(harga, "Semua Harga", (v) => RENTANG_HARGA.find((r) => r.slug === v)?.label ?? v)}
              options={RENTANG_HARGA.map((r) => ({ value: r.slug, label: r.label }))}
              selected={harga}
              onToggle={(value) => toggleTunggal(harga, setHarga, value)}
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
              Tampilkan {katalog.length} Unit
            </button>
          </div>

          {isAdvancedOpen && (
            <div className="search-cars__advanced" id="advancedFilters" style={{ display: "block" }}>
              <div className="search-cars__advanced-content">
                <div className="search-cars__advanced-row">
                  <div className="search-cars__select-wrapper">
                    <CheckboxDropdown
                      name="bahan_bakar"
                      label="Bahan Bakar"
                      toggleId="HeroFuelSelectToggle"
                      defaultText={teksTombol(bahanBakar, "Semua Bahan Bakar")}
                      options={opsiBahanBakar}
                      selected={bahanBakar}
                      onToggle={(value) => toggle(bahanBakar, setBahanBakar, value)}
                      isOpen={openDropdown === "fuel-type"}
                      onToggleOpen={() => toggleDropdown("fuel-type")}
                      layout="bar"
                    />
                  </div>
                  <div className="search-cars__select-wrapper">
                    <CheckboxDropdown
                      name="transmisi"
                      label="Transmisi"
                      toggleId="HeroTransmissionSelectToggle"
                      defaultText={teksTombol(transmisi, "Semua Transmisi")}
                      options={opsiTransmisi}
                      selected={transmisi}
                      onToggle={(value) => toggle(transmisi, setTransmisi, value)}
                      isOpen={openDropdown === "Transmisi"}
                      onToggleOpen={() => toggleDropdown("Transmisi")}
                      layout="bar"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {showCategoryList && jenis.length > 0 && (
            <div className="wow fadeInUp" data-wow-delay="0.7s">
              <div className="category-list flex-wrap mt-32">
                {jenis.map((j) => (
                  <Link className="brand-item-small" href={`${KATALOG_SEMUA}?tipe=${j.slug}`} key={j.slug}>
                    {CAR_TYPE_ICONS[IKON_JENIS[j.slug] ?? ""] ?? null}
                    {j.label}
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
