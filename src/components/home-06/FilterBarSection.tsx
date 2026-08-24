"use client";

import { useState } from "react";
import Image from "next/image";
import CheckboxDropdown from "@/components/listing/CheckboxDropdown";
import RangeSlider from "@/components/listing/RangeSlider";

// Migrated from ../aurexo/home-06.html lines 650-1023 ("All Car", `.page-title--form`). Genuinely
// different composition from every other home hero filter bar: home-06.html moves its tabs + filters
// into their own separate `bg-primary py-40` section BELOW the hero (not inside the hero section
// itself like `HeroSearchSection.tsx`/`home-05/HeroSearchSliderSection.tsx` do). The primary Brand/
// Model/Miles/Price row still reuses the same real `.filter-select-dropdown` checkbox UI
// (`CheckboxDropdown`, `layout="bar"`) — but the Advanced panel here is genuinely simpler: plain native
// `<select>` elements (`.search-cars__select-advanced`) instead of the custom checkbox-dropdown
// `FilterSelectDropdown` used everywhere else (confirmed via source diff — a real, different DOM, not
// an oversight). Everything here is UI_ONLY, same scope decision as every other homepage filter bar
// (COMPONENT_MAP.md #28) — the ~40-checkbox Features collapse is deliberately not reproduced.
export default function FilterBarSection() {
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
      className="page-title--form"
      onSubmit={(event) => event.preventDefault()}
      onClick={(event) => {
        if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
          setOpenDropdown(null);
        }
      }}
    >
      <section className="bg-primary py-40">
        <div className="container">
          <div className="flat-tabs mb-18">
            <div className="overflow-x-auto">
              <ul className="menu-tab menu-tab-style1 text-white margin-auto">
                <li className={activeTab === "all" ? "active" : ""} onClick={() => setActiveTab("all")}>
                  <span className="text-white font-weight-600">All Car</span>
                </li>
                <li className={activeTab === "new" ? "active" : ""} onClick={() => setActiveTab("new")}>
                  <span className="text-white font-weight-600">New Car</span>
                </li>
                <li className={activeTab === "used" ? "active" : ""} onClick={() => setActiveTab("used")}>
                  <span className="text-white font-weight-600">Used Car</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="search-cars__filters">
            <CheckboxDropdown
              name="brand"
              label="Select Brand"
              toggleId="Home06BrandSelectToggle"
              defaultText="All Brand"
              options={["Audi", "Chevrolet", "Hyundai", "Mustang"]}
              isOpen={openDropdown === "brand"}
              onToggleOpen={() => toggleDropdown("brand")}
              layout="bar"
            />
            <CheckboxDropdown
              name="model"
              label="Select Model"
              toggleId="Home06ModelSelectToggle"
              defaultText="All Model"
              options={["Model 1", "Model 2"]}
              isOpen={openDropdown === "model"}
              onToggleOpen={() => toggleDropdown("model")}
              layout="bar"
            />
            <CheckboxDropdown
              name="miles"
              label="Select Miles"
              toggleId="Home06MilesSelectToggle"
              defaultText="All miles"
              options={["0-10k", "$10k-$20k"]}
              isOpen={openDropdown === "miles"}
              onToggleOpen={() => toggleDropdown("miles")}
              layout="bar"
            />
            <CheckboxDropdown
              name="price"
              label="Max Price"
              toggleId="Home06MaxPriceSelectToggle"
              defaultText="All Price"
              options={["0-10k", "$10k-$20k"]}
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
              Show 1,029 Matches
            </button>
          </div>

          {isAdvancedOpen && (
            <div className="search-cars__advanced" id="advancedFilters" style={{ display: "block" }}>
              <div className="search-cars__advanced-content">
                <div className="search-cars__advanced-row">
                  <select className="search-cars__select-advanced" name="fuel-type" defaultValue="Fuel Type">
                    <option>Fuel Type</option>
                    <option>Petrol</option>
                    <option>Diesel</option>
                    <option>Electric</option>
                  </select>
                  <select className="search-cars__select-advanced" name="transmission" defaultValue="Transmission">
                    <option>Transmission</option>
                    <option>Manual</option>
                    <option>Automatic</option>
                  </select>
                  <select className="search-cars__select-advanced" name="drive-type" defaultValue="Drive Type">
                    <option>Drive Type</option>
                    <option>FWD</option>
                    <option>RWD</option>
                    <option>AWD</option>
                  </select>
                  <select className="search-cars__select-advanced" name="color" defaultValue="Color">
                    <option>Color</option>
                    <option>Red</option>
                    <option>Blue</option>
                    <option>Black</option>
                  </select>
                  <select className="search-cars__select-advanced" name="cylinders" defaultValue="Cylinders">
                    <option>Cylinders</option>
                    <option>4</option>
                    <option>6</option>
                    <option>8</option>
                  </select>
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
      </section>
    </form>
  );
}
