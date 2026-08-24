"use client";

import { useState } from "react";
import Image from "next/image";
import CheckboxDropdown from "@/components/listing/CheckboxDropdown";
import FilterSelectDropdown from "@/components/common/FilterSelectDropdown";
import RangeSlider from "@/components/listing/RangeSlider";

// Migrated from ../aurexo/home-08.html lines 467-969 (`.page-title.page-title-style-6`). Genuinely
// different DOM from every other page-title hero on the site (`home/HeroSearchSection.tsx`): no swiper
// background at all (confirmed via grep, same conclusion as home-07.html's own no-slider variant), a
// real 2-column FLEX split layout (`page-title.scss:69-75`: `.page-title-wrapper { display: flex }`,
// `.page-title--image { width: calc(100% - 450px) }`) putting the filter form and a static
// `page-title-8.png` image side by side (not stacked, unlike home-07.html's own no-slider variant), a
// plain `<p class="h4">` title (not `<h1>`/`<h2>` like every other page-title hero), a genuinely
// different filter-icon button (an inline "sliders" SVG with `stroke="white"`, not the shared
// `filter.svg` `<img>` every other hero uses — this variant's own `.search-cars__filter` gets its
// `$color-primary` background from CSS, per `page-title.scss:114-117`) wrapped together with the
// search button in its own `flex gap-12 w-full` div. UI_ONLY, same scope decision as every other hero's
// filter/tab/advanced-panel fields (no real listing grid to filter on the homepage) — the ~40-checkbox
// Features collapse is deliberately not reproduced (COMPONENT_MAP.md #28).
export default function HeroSplitSearchSection() {
  const [activeTab, setActiveTab] = useState<"all" | "new" | "used">("all");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [isAdvancedOpen, setIsAdvancedOpen] = useState(false);
  const [yearRange, setYearRange] = useState<[number, number]>([2015, 2026]);

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <form
      action="#"
      onSubmit={(event) => event.preventDefault()}
      className=""
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
          setOpenDropdown(null);
        }
      }}
    >
      <section className="page-title page-title-style-6 flex">
        <div className="container">
          <div className="page-title-wrapper">
            <div className="search-cars wow fadeInUp">
              <p className="h4 search-cars__title text-primary letter-normal">Search Cars Near You – Buy Today!</p>

              <div className="flat-tabs mb-14">
                <div className="overflow-x-auto">
                  <ul className="menu-tab menu-tab-style1 text-white">
                    <li className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
                      <span className="font-weight-600">All Car</span>
                    </li>
                    <li className={activeTab === "new" ? "active" : ""} onClick={() => setActiveTab("new")}>
                      <span className="font-weight-600">New Car</span>
                    </li>
                    <li className={activeTab === "used" ? "active" : ""} onClick={() => setActiveTab("used")}>
                      <span className="font-weight-600">Used Car</span>
                    </li>
                  </ul>
                </div>
              </div>

              <div className="search-cars__filters">
                <CheckboxDropdown
                  name="brand"
                  label="Select Brand"
                  toggleId="Hero08BrandSelectToggle"
                  defaultText="All Brand"
                  options={["Audi", "Chevrolet", "Hyundai", "Mustang"]}
                  isOpen={openDropdown === "brand"}
                  onToggleOpen={() => toggleDropdown("brand")}
                  layout="bar"
                />
                <CheckboxDropdown
                  name="model"
                  label="Select Model"
                  toggleId="Hero08ModelSelectToggle"
                  defaultText="All Model"
                  options={["Model 1", "Model 2"]}
                  isOpen={openDropdown === "model"}
                  onToggleOpen={() => toggleDropdown("model")}
                  layout="bar"
                />
                <CheckboxDropdown
                  name="miles"
                  label="Select Miles"
                  toggleId="Hero08MilesSelectToggle"
                  defaultText="All miles"
                  options={["0-10k", "$10k-$20k"]}
                  isOpen={openDropdown === "miles"}
                  onToggleOpen={() => toggleDropdown("miles")}
                  layout="bar"
                />
                <CheckboxDropdown
                  name="price"
                  label="Max Price"
                  toggleId="Hero08MaxPriceSelectToggle"
                  defaultText="All Price"
                  options={["0-10k", "$10k-$20k"]}
                  isOpen={openDropdown === "price"}
                  onToggleOpen={() => toggleDropdown("price")}
                  layout="bar"
                />

                <div className="flex gap-12 w-full">
                  <div
                    className="search-cars__filter"
                    id="filterToggle"
                    onClick={() => setIsAdvancedOpen((prev) => !prev)}
                  >
                    <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                      <path d="M8.125 8.125C9.16053 8.125 10 7.28553 10 6.25C10 5.21447 9.16053 4.375 8.125 4.375C7.08947 4.375 6.25 5.21447 6.25 6.25C6.25 7.28553 7.08947 8.125 8.125 8.125Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M13.125 15.625C14.1605 15.625 15 14.7855 15 13.75C15 12.7145 14.1605 11.875 13.125 11.875C12.0895 11.875 11.25 12.7145 11.25 13.75C11.25 14.7855 12.0895 15.625 13.125 15.625Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M10 6.25H16.875" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.125 6.25H6.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M15 13.75H16.875" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M3.125 13.75H11.25" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                  </div>

                  <button type="submit" className="search-cars__search flex items-center gap-8 justify-center md-w-full">
                    <Image src="/assets/icons/search.svg" alt="search" width={16} height={16} />
                    Show 1,029 Matches
                  </button>
                </div>
              </div>

              {isAdvancedOpen && (
                <div className="search-cars__advanced" id="advancedFilters" style={{ display: "block" }}>
                  <div className="search-cars__advanced-content">
                    <div className="search-cars__advanced-row">
                      <div className="search-cars__select-wrapper">
                        <FilterSelectDropdown
                          name="fuel-type"
                          options={[
                            { value: "Petrol", label: "Petrol" },
                            { value: "Diesel", label: "Diesel" },
                            { value: "Electric", label: "Electric" },
                          ]}
                          isOpen={openDropdown === "fuel-type"}
                          onToggleOpen={() => toggleDropdown("fuel-type")}
                        />
                      </div>
                      <div className="search-cars__select-wrapper">
                        <FilterSelectDropdown
                          name="Transmission"
                          options={[
                            { value: "Manual", label: "Manual" },
                            { value: "Automatic", label: "Automatic" },
                          ]}
                          isOpen={openDropdown === "Transmission"}
                          onToggleOpen={() => toggleDropdown("Transmission")}
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
                            { value: "Blue", label: "Blue" },
                            { value: "Black", label: "Black" },
                          ]}
                          isOpen={openDropdown === "colorTyle"}
                          onToggleOpen={() => toggleDropdown("colorTyle")}
                        />
                      </div>
                      <div className="search-cars__select-wrapper">
                        <FilterSelectDropdown
                          name="Cylinders"
                          options={[
                            { value: "4", label: "4" },
                            { value: "3", label: "3" },
                            { value: "2", label: "2" },
                          ]}
                          isOpen={openDropdown === "Cylinders"}
                          onToggleOpen={() => toggleDropdown("Cylinders")}
                        />
                      </div>
                      <div className="search-cars__range">
                        <p className="search-cars__range-label">
                          Year: <span>{yearRange[0]}</span> - <span>{yearRange[1]}</span>
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

            <div className="page-title--image wow fadeInUp">
              <Image className="w-full" src="/assets/images/page-title/page-title-8.png" alt="page-title-bg" width={900} height={700} />
            </div>
          </div>
        </div>
      </section>
    </form>
  );
}
