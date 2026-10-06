"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Swiper, SwiperSlide } from "swiper/react";
import { Autoplay, Controller, EffectFade, Navigation, Pagination, Parallax } from "swiper/modules";
import type { Swiper as SwiperClass } from "swiper/types";
import CheckboxDropdown from "@/components/listing/CheckboxDropdown";
import FilterSelectDropdown from "@/components/common/FilterSelectDropdown";
import RangeSlider from "@/components/listing/RangeSlider";

const BANNERS = ["banner-5.jpg", "banner-2.jpg", "banner-3.jpg", "banner-1.jpg"];

// Migrated from ../aurexo/home-05.html lines 574-1123 (`.page-title.page-title-style-4`). A genuine
// hybrid of two hero patterns already built: the real 2-swiper Controller sync + parallax background
// from `home-04/HeroBannerSlider.tsx` (`.sw-single`/`.sw-single-thumb`, same mechanism, but WITH real
// nav arrows this time — `.swiper-btn.navigation-prev/next` wired via the `Navigation` module), plus
// the full search-filter bar UI from `home/HeroSearchSection.tsx` (Brand/Model/Miles/Price via
// `CheckboxDropdown`, Fuel Type/Transmission/DriveType/Color/Cylinders via `FilterSelectDropdown`, year
// range via `RangeSlider`) rendered inside the synced thumb swiper's slides instead of statically.
// Everything under the filter bar is UI_ONLY, same scope decision as `HeroSearchSection`'s own header
// comment (no real listing grid to filter on a homepage) — the ~40-checkbox Features collapse is
// deliberately NOT reproduced for the same reason (COMPONENT_MAP.md #28). Source's own 4 content
// slides are byte-identical text, same real-controller-sync-over-static-duplicate rationale as
// `HeroBannerSlider.tsx`'s own comment.
export default function HeroSearchSliderSection() {
  const [activeTab, setActiveTab] = useState<"all" | "new" | "used">("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2026]);
  const [bgSwiper, setBgSwiper] = useState<SwiperClass | null>(null);
  const [thumbSwiper, setThumbSwiper] = useState<SwiperClass | null>(null);
  const [parallaxValue, setParallaxValue] = useState<number | null>(null);

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <form
      action="#"
      onSubmit={(event) => event.preventDefault()}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
          setOpenDropdown(null);
        }
      }}
    >
      <section className="page-title page-title-style-4 flex effect-content-slide effect-2">
        <p className="swiper-btn navigation-prev-05">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M13.9487 2.71258C14.2097 2.97026 14.2335 3.37348 14.0199 3.65762L13.9487 3.73903L7.60622 10L13.9487 16.261C14.2097 16.5186 14.2335 16.9219 14.0199 17.206L13.9487 17.2874C13.6877 17.5451 13.2792 17.5685 12.9913 17.3577L12.9088 17.2874L6.04609 10.5132C5.78505 10.2555 5.76132 9.85232 5.9749 9.56818L6.04609 9.48678L12.9088 2.71258C13.196 2.42914 13.6615 2.42914 13.9487 2.71258Z"
              fill="white"
            />
          </svg>
        </p>
        <p className="swiper-btn navigation-next-05">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
              d="M6.0513 17.2874C5.79025 17.0297 5.76652 16.6265 5.98011 16.3424L6.0513 16.261L12.3938 10L6.0513 3.73903C5.79025 3.48135 5.76652 3.07813 5.98011 2.79399L6.0513 2.71258C6.31235 2.45491 6.72084 2.43148 7.00869 2.64231L7.09116 2.71258L13.9539 9.48678C14.215 9.74446 14.2387 10.1477 14.0251 10.4318L13.9539 10.5132L7.09116 17.2874C6.80401 17.5709 6.33845 17.5709 6.0513 17.2874Z"
              fill="white"
            />
          </svg>
        </p>

        <div className="swiper-container page-title--slider sw-single">
          <Swiper
            modules={[Autoplay, Controller, Navigation, Pagination, Parallax]}
            loop
            speed={1000}
            autoplay={{ delay: 3000, disableOnInteraction: false }}
            pagination={{ el: ".pagination-page-title--slider-1", clickable: true }}
            navigation={{ prevEl: ".navigation-prev-05", nextEl: ".navigation-next-05" }}
            parallax
            controller={{ control: thumbSwiper ?? undefined }}
            onSwiper={setBgSwiper}
            onInit={(swiper) => setParallaxValue(swiper.width * 0.75)}
            className="h-full"
          >
            {BANNERS.map((file) => (
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

        <div className="search-cars container thumb effect-zoom-item">
          <Swiper
            modules={[Controller, EffectFade]}
            effect="fade"
            fadeEffect={{ crossFade: true }}
            slidesPerView={1}
            allowTouchMove={false}
            speed={2000}
            controller={{ control: bgSwiper ?? undefined }}
            onSwiper={setThumbSwiper}
            className="sw-single-thumb"
          >
            {BANNERS.map((file) => (
              <SwiperSlide key={file}>
                <h1 className="search-cars__title text-center effect-item effect-up delay-3">
                  Cari, Bandingkan, Bawa Pulang <br className="lg-hide" /> Temukan Mobil Anda!
                </h1>
                <p className="h7 text-white mb-36 text-center effect-item effect-up delay-4">
                  Temukan mobil yang tepat untuk Anda dari pilihan luas dengan harga terbaik.
                </p>
                <Link
                  href="/listing-grid4-columns"
                  className="btn btn-white text-primary btn-large-2 font-weight-600 max-w-min capitalize mx-auto effect-item effect-up delay-5"
                >
                  Lihat Unit
                </Link>
              </SwiperSlide>
            ))}
          </Swiper>

          <div className="flat-tabs mb-16">
            <div className="overflow-x-auto">
              <ul className="menu-tab menu-tab-style1 text-white margin-auto">
                <li className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
                  <span className="text-white font-weight-600">Semua Mobil</span>
                </li>
                <li className={activeTab === "new" ? "active" : ""} onClick={() => setActiveTab("new")}>
                  <span className="text-white font-weight-600">Mobil Baru</span>
                </li>
                <li className={activeTab === "used" ? "active" : ""} onClick={() => setActiveTab("used")}>
                  <span className="text-white font-weight-600">Mobil Bekas</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="search-cars__filters">
            <CheckboxDropdown
              name="brand"
              label="Pilih Merek"
              toggleId="Home05BrandSelectToggle"
              defaultText="Semua Merek"
              options={["Audi", "Chevrolet", "Hyundai", "Mustang"]}
              isOpen={openDropdown === "brand"}
              onToggleOpen={() => toggleDropdown("brand")}
              layout="bar"
            />
            <CheckboxDropdown
              name="model"
              label="Pilih Model"
              toggleId="Home05ModelSelectToggle"
              defaultText="Semua Model"
              options={["Model 1", "Honda Brio"]}
              isOpen={openDropdown === "model"}
              onToggleOpen={() => toggleDropdown("model")}
              layout="bar"
            />
            <CheckboxDropdown
              name="miles"
              label="Pilih Jarak Tempuh"
              toggleId="Home05MilesSelectToggle"
              defaultText="Semua jarak"
              options={["Rp 0 - Rp 100 jt", "Rp 100 jt - Rp 200 jt"]}
              isOpen={openDropdown === "miles"}
              onToggleOpen={() => toggleDropdown("miles")}
              layout="bar"
            />
            <CheckboxDropdown
              name="price"
              label="Harga Maksimal"
              toggleId="Home05MaxPriceSelectToggle"
              defaultText="Semua Harga"
              options={["Rp 0 - Rp 100 jt", "Rp 100 jt - Rp 200 jt"]}
              isOpen={openDropdown === "price"}
              onToggleOpen={() => toggleDropdown("price")}
              layout="bar"
            />

            <button
              type="button"
              className="search-cars__filter"
              aria-label="Toggle advanced filters"
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
                        { value: "Red", label: "Red" },
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
        </div>

        <div className="swiper-pagination pagination-white pagination-style pagination-page-title--slider-1 mt-38" />
      </section>
    </form>
  );
}
