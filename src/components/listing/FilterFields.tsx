"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import RangeSlider from "./RangeSlider";
import CheckboxDropdown from "./CheckboxDropdown";
import ColorDropdown from "./ColorDropdown";
import type { FilterState } from "./FilterSidebar";
import { useKatalog } from "@/components/common/KatalogProvider";
import { labelBodi } from "@/lib/bodi";
import {
  bahanBakarDiStok,
  jenisDiStok,
  merekDiStok,
  modelDiStok,
  transmisiDiStok,
} from "@/lib/faset";

// The actual filter form fields (Brand/Model/Price/Body Style/Fuel Type/Transmission/Door
// count/Cylinders/Colors/Features) — extracted out of `FilterSidebar` (the slide-out popup shell)
// so `listing-liststyle-sidebar.html`'s *permanent* inline sidebar can reuse the exact same fields
// and filtering behavior without the popup/overlay markup wrapped around them. See that file's
// header comment for the full filtering-scope rationale (which fields are real vs. decorative).
//
// Daftar isian Merek/Model/Jenis Bodi/Bahan Bakar/Transmisi sekarang dihitung dari stok
// (`useKatalog()`), bukan ditulis tangan di sini. Versi lama menawarkan BMW, Mercedes, Audi, dan
// Volvo — showroom ini tidak punya satu pun unitnya — plus "SEMUA" dan "SUV" di dalam daftar
// merek. Pilihan yang tidak ada isinya bukan sekadar tidak berguna: pengunjung mengira katalognya
// rusak. Menghitungnya dari stok berarti pilihan baru muncul sendiri begitu ada unitnya.
//
// Sisa yang masih hiasan dan sengaja dibiarkan apa adanya: Jumlah Pintu, Silinder, Warna, dan
// Fitur. Tidak ada satu pun kolom di `Listing` yang menyokongnya, jadi menampilkannya sebagai
// penyaring sungguhan berarti mengarang data. Sudah tercatat begitu sejak migrasi awal.
export default function FilterFields({
  filters,
  onFilterChange,
  priceMin,
  priceMax,
  jarakMin,
  jarakMaks,
}: {
  filters: FilterState;
  onFilterChange: (patch: Partial<FilterState>) => void;
  priceMin: number;
  priceMax: number;
  jarakMin: number;
  jarakMaks: number;
}) {
  function toggleValue(list: string[], value: string): string[] {
    return list.includes(value) ? list.filter((v) => v !== value) : [...list, value];
  }

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const katalog = useKatalog();

  const merek = merekDiStok(katalog).map((m) => m.label);
  const model = modelDiStok(katalog).map((m) => m.label);
  const jenis = jenisDiStok(katalog).map((j) => ({
    value: j.slug,
    label: `${j.label} (${j.jumlah})`,
  }));
  const bahanBakar = bahanBakarDiStok(katalog).map((b) => b.label);
  const transmisi = transmisiDiStok(katalog).map((t) => t.label);

  /** Teks pada tombol dropdown: jangan tampilkan satu nama seolah itu pilihan aktif. */
  function teksTombol(dipilih: string[], kosong: string, label?: (v: string) => string): string {
    if (dipilih.length === 0) return kosong;
    const tampil = dipilih.map((v) => label?.(v) ?? v);
    return tampil.length === 1 ? tampil[0] : `${tampil.length} dipilih`;
  }

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
        label="Pilih Merek"
        toggleId="BrandSelectToggle"
        defaultText={teksTombol(filters.brand, "Semua Merek")}
        options={merek}
        selected={filters.brand}
        onToggle={(value) => onFilterChange({ brand: toggleValue(filters.brand, value) })}
        isOpen={openDropdown === "brand"}
        onToggleOpen={() => toggleDropdown("brand")}
      />

      <CheckboxDropdown
        name="model"
        label="Pilih Model"
        toggleId="modelSelectToggle"
        defaultText={teksTombol(filters.model, "Semua Model")}
        options={model}
        searchable
        selected={filters.model}
        onToggle={(value) => onFilterChange({ model: toggleValue(filters.model, value) })}
        isOpen={openDropdown === "model"}
        onToggleOpen={() => toggleDropdown("model")}
      />

      <div className="filter-group filter-range mb-18">
        <div className="filter-label">Harga &amp; Pembayaran</div>
        <div className="filter-radio-group">
          <label className="filter-radio">
            <input type="radio" name="payment2" value="full" defaultChecked />
            <span>Harga Penuh</span>
          </label>
          <label className="filter-radio">
            <input type="radio" name="payment2" value="monthly" />
            <span>Bulanan</span>
          </label>
        </div>

        <div className="search-cars__range">
          <div className="search-cars__range-wrapper mb-14">
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
              Harga minimal <span className="flex">Rp&nbsp;<span className="block">{filters.priceRange[0].toLocaleString("id-ID")}</span></span>
            </p>
            <p className="text-xs text-secondary">
              Harga maksimal <span className="flex">Rp&nbsp;<span className="block">{filters.priceRange[1].toLocaleString("id-ID")}</span></span>
            </p>
          </div>
        </div>

        <div className="search-cars__range">
          <div className="filter-label">Jarak Tempuh</div>
          <div className="search-cars__range-wrapper mb-14">
            <RangeSlider
              min={jarakMin}
              max={jarakMaks}
              step={1000}
              value={filters.mileageRange}
              onChange={(mileageRange) => onFilterChange({ mileageRange })}
            />
          </div>
          <div className="filter-price-range-label">
            <p className="text-xs text-secondary">
              Minimal <span className="block">{filters.mileageRange[0].toLocaleString("id-ID")} km</span>
            </p>
            <p className="text-xs text-secondary">
              Maksimal <span className="block">{filters.mileageRange[1].toLocaleString("id-ID")} km</span>
            </p>
          </div>
        </div>
      </div>

      <CheckboxDropdown
        name="bodystyle"
        label="Jenis Bodi"
        toggleId="BodyStyleSelectToggle"
        defaultText={teksTombol(filters.bodyStyle, "Semua Jenis", labelBodi)}
        options={jenis}
        selected={filters.bodyStyle}
        onToggle={(value) => onFilterChange({ bodyStyle: toggleValue(filters.bodyStyle, value) })}
        isOpen={openDropdown === "bodystyle"}
        onToggleOpen={() => toggleDropdown("bodystyle")}
      />

      <CheckboxDropdown
        name="Bahan Bakar"
        label="Bahan Bakar"
        toggleId="FuelStyleSelectToggle"
        defaultText={teksTombol(filters.fuelType, "Semua Bahan Bakar")}
        options={bahanBakar}
        selected={filters.fuelType}
        onToggle={(value) => onFilterChange({ fuelType: toggleValue(filters.fuelType, value) })}
        isOpen={openDropdown === "Bahan Bakar"}
        onToggleOpen={() => toggleDropdown("Bahan Bakar")}
      />

      <CheckboxDropdown
        name="Transmisi"
        label="Transmisi"
        toggleId="TransmissionSelectToggle"
        defaultText={teksTombol(filters.transmission, "Semua Transmisi")}
        options={transmisi}
        selected={filters.transmission}
        onToggle={(value) => onFilterChange({ transmission: toggleValue(filters.transmission, value) })}
        isOpen={openDropdown === "Transmisi"}
        onToggleOpen={() => toggleDropdown("Transmisi")}
      />

      <CheckboxDropdown
        name="Doorcount"
        label="Jumlah Pintu"
        toggleId="DriveTypeSelectToggle"
        defaultText="4 pintu"
        options={["4 pintu", "3 pintu"]}
        selected={filters.doorCount}
        onToggle={(value) => onFilterChange({ doorCount: toggleValue(filters.doorCount, value) })}
        isOpen={openDropdown === "Doorcount"}
        onToggleOpen={() => toggleDropdown("Doorcount")}
      />

      <CheckboxDropdown
        name="Silinder"
        label="Silinder"
        toggleId="CylindersSelectToggle"
        defaultText="4 silinder"
        options={["4 silinder", "6 silinder", "8 silinder"]}
        selected={filters.cylinders}
        onToggle={(value) => onFilterChange({ cylinders: toggleValue(filters.cylinders, value) })}
        isOpen={openDropdown === "Silinder"}
        onToggleOpen={() => toggleDropdown("Silinder")}
      />

      <ColorDropdown
        name="exteriorColor"
        label="Warna Eksterior"
        toggleId="exteriorColorToggle"
        selected={filters.exteriorColor}
        onSelect={(color) => onFilterChange({ exteriorColor: color })}
        isOpen={openDropdown === "exteriorColor"}
        onToggleOpen={() => toggleDropdown("exteriorColor")}
      />
      <ColorDropdown
        name="interiorColor"
        label="Warna Interior"
        toggleId="InteriorColorToggle"
        selected={filters.interiorColor}
        onSelect={(color) => onFilterChange({ interiorColor: color })}
        isOpen={openDropdown === "interiorColor"}
        onToggleOpen={() => toggleDropdown("interiorColor")}
      />

      <div className="filter-group">
        <details className="core-collapse" open>
          <summary className="filter-label core-collapse__label flex items-center gap-8 justify-between">
            <span className="h7 font-weight-500">Fitur</span>
            <Image src="/assets/icons/chevron-down-primary.svg" alt="chevron" className="core-collapse__icon" width={16} height={16} />
          </summary>
          <div className="filter-features scroll-custom">
            {[
              ["Adaptive", "Kontrol Adaptif"],
              ["AppleCarPlay", "Apple CarPlay"],
              ["AlloyWheels", "Velg Alloy"],
              ["BrakeAssist", "Bantuan Rem"],
              ["TowHitch", "Kait Derek"],
              ["Autopilot", "Autopilot"],
              ["AndroidAuto", "Android Auto"],
              ["Moonroof", "Atap Kaca"],
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
        Tampilkan Hasil
      </button>
    </div>
  );
}
