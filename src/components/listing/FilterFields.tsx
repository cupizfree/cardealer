"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RangeSlider from "./RangeSlider";
import CheckboxDropdown from "./CheckboxDropdown";
import ColorDropdown from "./ColorDropdown";
import type { FilterState } from "./FilterSidebar";

// The actual filter form fields (Brand/Model/Price/Body Style/Fuel Type/Transmission/Door
// count/Cylinders/Colors/Features) — extracted out of `FilterSidebar` (the slide-out popup shell)
// so `listing-liststyle-sidebar.html`'s *permanent* inline sidebar can reuse the exact same fields
// and filtering behavior without the popup/overlay markup wrapped around them. See that file's
// header comment for the full filtering-scope rationale (which fields are real vs. decorative) —
// unchanged here, this is a pure structural extraction, not a behavior change.
export default function FilterFields({
  filters,
  onFilterChange,
  priceMin,
  priceMax,
}: {
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  priceMin: number;
  priceMax: number;
}) {
  function toggleValue(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("mousedown", handleOutsideClick);
    return () => document.removeEventListener("mousedown", handleOutsideClick);
  }, []);

  function toggleDropdown(name: string) {
    setOpenDropdown((prev) => (prev === name ? null : name));
  }

  return (
    <div className="filter-sidebar__content">
      <CheckboxDropdown
        name="brand"
        label="Select Brand"
        toggleId="BrandSelectToggle"
        defaultText="All Brand"
        options={["ALL", "BMW", "SUV", "Mercedes", "Audi", "Honda", "Toyota", "Volvo"]}
        selected={filters.brand}
        onToggle={(value) => onFilterChange({ brand: toggleValue(filters.brand, value) })}
        isOpen={openDropdown === "brand"}
        onToggleOpen={() => toggleDropdown("brand")}
      />

      <CheckboxDropdown
        name="model"
        label="Select Model"
        toggleId="modelSelectToggle"
        defaultText="All Model"
        options={["All Model", "A3", "A4", "A6", "A8"]}
        searchable
        selected={filters.model}
        onToggle={(value) => onFilterChange({ model: toggleValue(filters.model, value) })}
        isOpen={openDropdown === "model"}
        onToggleOpen={() => toggleDropdown("model")}
      />

      <div className="filter-group filter-range mb-18">
        <div className="filter-label">Price &amp; Payment</div>
        <div className="filter-radio-group">
          <label className="filter-radio">
            <input type="radio" name="payment2" value="full" defaultChecked />
            <span>Full Price</span>
          </label>
          <label className="filter-radio">
            <input type="radio" name="payment2" value="monthly" />
            <span>Monthly</span>
          </label>
        </div>

        <div className="search-cars__range">
          <div className="search-cars__range-wrapper mb-14" id="yearRangeWrapper">
            <RangeSlider
              min={priceMin}
              max={priceMax}
              step={500}
              value={filters.priceRange}
              onChange={(priceRange) => onFilterChange({ priceRange })}
            />
          </div>
          <div className="filter-price-range-label">
            <p className="text-xs text-secondary">
              Min price <span className="flex">$<span id="yearMin" className="block">{filters.priceRange[0].toLocaleString()}</span></span>
            </p>
            <p className="text-xs text-secondary">
              Max price <span className="flex">$<span id="yearMax" className="block">{filters.priceRange[1].toLocaleString()}</span></span>
            </p>
          </div>
        </div>
      </div>

      <CheckboxDropdown
        name="bodystyle"
        label="Body Style"
        toggleId="BodyStyleSelectToggle"
        defaultText="Sedan"
        options={["Sedan", "SUV", "Hatchback"]}
        selected={filters.bodyStyle}
        onToggle={(value) => onFilterChange({ bodyStyle: toggleValue(filters.bodyStyle, value) })}
        isOpen={openDropdown === "bodystyle"}
        onToggleOpen={() => toggleDropdown("bodystyle")}
      />

      <CheckboxDropdown
        name="FuelType"
        label="Fuel Type"
        toggleId="FuelStyleSelectToggle"
        defaultText="Electrical"
        options={["Electrical", "Petrol", "Diesel"]}
        selected={filters.fuelType}
        onToggle={(value) => onFilterChange({ fuelType: toggleValue(filters.fuelType, value) })}
        isOpen={openDropdown === "FuelType"}
        onToggleOpen={() => toggleDropdown("FuelType")}
      />

      <CheckboxDropdown
        name="Transmission"
        label="Transmission"
        toggleId="TransmissionSelectToggle"
        defaultText="Automatic"
        options={["Automatic", "Manual"]}
        selected={filters.transmission}
        onToggle={(value) => onFilterChange({ transmission: toggleValue(filters.transmission, value) })}
        isOpen={openDropdown === "Transmission"}
        onToggleOpen={() => toggleDropdown("Transmission")}
      />

      <CheckboxDropdown
        name="Doorcount"
        label="Door count"
        toggleId="DriveTypeSelectToggle"
        defaultText="4 doors"
        options={["4 doors", "3 doors"]}
        selected={filters.doorCount}
        onToggle={(value) => onFilterChange({ doorCount: toggleValue(filters.doorCount, value) })}
        isOpen={openDropdown === "Doorcount"}
        onToggleOpen={() => toggleDropdown("Doorcount")}
      />

      <CheckboxDropdown
        name="Cylinders"
        label="Cylinders"
        toggleId="CylindersSelectToggle"
        defaultText="4 cylinders"
        options={["4 cylinders", "6 cylinders", "8 cylinders"]}
        selected={filters.cylinders}
        onToggle={(value) => onFilterChange({ cylinders: toggleValue(filters.cylinders, value) })}
        isOpen={openDropdown === "Cylinders"}
        onToggleOpen={() => toggleDropdown("Cylinders")}
      />

      <ColorDropdown
        name="exteriorColor"
        label="Exterior color"
        toggleId="exteriorColorToggle"
        selected={filters.exteriorColor}
        onSelect={(color) => onFilterChange({ exteriorColor: color })}
        isOpen={openDropdown === "exteriorColor"}
        onToggleOpen={() => toggleDropdown("exteriorColor")}
      />
      <ColorDropdown
        name="interiorColor"
        label="Interior color"
        toggleId="InteriorColorToggle"
        selected={filters.interiorColor}
        onSelect={(color) => onFilterChange({ interiorColor: color })}
        isOpen={openDropdown === "interiorColor"}
        onToggleOpen={() => toggleDropdown("interiorColor")}
      />

      <div className="filter-group">
        <details className="core-collapse" open>
          <summary className="filter-label core-collapse__label flex items-center gap-8 justify-between">
            <span className="h7 font-weight-500">Features</span>
            <Image src="/assets/icons/chevron-down-primary.svg" alt="chevron" className="core-collapse__icon" width={16} height={16} />
          </summary>
          <div className="filter-features scroll-custom">
            {[
              ["Adaptive", "Adaptive Control"],
              ["AppleCarPlay", "Apple CarPlay"],
              ["AlloyWheels", "Alloy Wheels"],
              ["BrakeAssist", "Brake Assist"],
              ["TowHitch", "Tow Hitch"],
              ["Autopilot", "Autopilot"],
              ["AndroidAuto", "Android Auto"],
              ["Moonroof", "Moonroof"],
            ].map(([value, label]) => (
              <label className="filter-checkbox style-2" key={value}>
                <input
                  type="checkbox"
                  name={value}
                  value={value}
                  checked={filters.features.includes(label)}
                  onChange={() => onFilterChange({ features: toggleValue(filters.features, label) })}
                />
                <span>{label}</span>
              </label>
            ))}
          </div>
        </details>
      </div>

      <button type="submit" className="filter-sidebar__submit">
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M15.8047 15.8047L21.0012 21.0012" stroke="white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        Show Matches
      </button>
    </div>
  );
}
