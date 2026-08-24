import FilterSelectDropdown from "@/components/common/FilterSelectDropdown";

const GENERIC_OPTIONS = (label: string) => [
  { value: "FWD", label: `${label} 1` },
  { value: "RWD", label: `${label} 2` },
  { value: "AWD", label: `${label} 3` },
];

// Migrated from ../aurexo/add-listings-2.html lines 648-926. All dropdown options are source's own
// literal generic placeholders ("Model 1/2/3", "Type 1/2/3", etc. — confirmed via source read, not a
// transcription shortcut) — reproduced verbatim, not replaced with invented real values. Two real,
// disclosed source bugs preserved as-is: the "Doors*" dropdown's own options are mislabeled "FuelType
// 1/2/3" (a literal copy-paste of the FuelType dropdown right above it, confirmed via source diff), and
// "Doors*" is used TWICE as a field label — once for that dropdown, once for the unrelated free-text
// textarea at the very end of this section.
export default function CarDetailsSection({
  openDropdown,
  onToggleDropdown,
}: {
  openDropdown: string | null;
  onToggleDropdown: (name: string) => void;
}) {
  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Car Details</p>

      <div className="grid grid-cols-4 gap-20 sm-grid-cols-1">
        <div className="padding-0 col-span-4">
          <p className="mb-8 font-weight-600">Car Title*</p>
          <input className="input-large" type="text" id="title" name="title" placeholder="Car Title*" defaultValue="Audi A6 Avant E-Tron" required />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Model*</p>
          <FilterSelectDropdown name="Model" options={GENERIC_OPTIONS("Model")} isOpen={openDropdown === "Model"} onToggleOpen={() => onToggleDropdown("Model")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Type*</p>
          <FilterSelectDropdown name="Type" options={GENERIC_OPTIONS("Type")} isOpen={openDropdown === "Type"} onToggleOpen={() => onToggleDropdown("Type")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Years*</p>
          <input className="input-large" type="text" id="Years" name="Years" placeholder="Years" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Condition*</p>
          <input className="input-large" type="text" id="Condition" name="Condition" placeholder="Condition" required />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Stock Number*</p>
          <input className="input-large" type="text" id="Enternumber" name="Enternumber" placeholder="Enter number" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">VIN Number*</p>
          <input className="input-large" type="text" id="EnterVIN" name="EnterVIN" placeholder="Enter VIN" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Mileage*</p>
          <input className="input-large" type="text" id="mileage" name="mileage" placeholder="Enter mileage" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Transmission*</p>
          <FilterSelectDropdown name="Transmission" options={GENERIC_OPTIONS("Transmission")} isOpen={openDropdown === "Transmission"} onToggleOpen={() => onToggleDropdown("Transmission")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Driver Type*</p>
          <FilterSelectDropdown name="DriverType" options={GENERIC_OPTIONS("DriverType")} isOpen={openDropdown === "DriverType"} onToggleOpen={() => onToggleDropdown("DriverType")} />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Engine Size*</p>
          <input className="input-large" type="text" id="Enterengine" name="Enterengine" placeholder="Enter engine" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Cylinders*</p>
          <FilterSelectDropdown name="Cylinders" options={GENERIC_OPTIONS("Cylinders")} isOpen={openDropdown === "Cylinders"} onToggleOpen={() => onToggleDropdown("Cylinders")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Fuel Type*</p>
          <FilterSelectDropdown name="FuelType" options={GENERIC_OPTIONS("FuelType")} isOpen={openDropdown === "FuelType"} onToggleOpen={() => onToggleDropdown("FuelType")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Doors*</p>
          <FilterSelectDropdown name="Doors" options={GENERIC_OPTIONS("FuelType")} isOpen={openDropdown === "Doors"} onToggleOpen={() => onToggleDropdown("Doors")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Color*</p>
          <input className="input-large" type="text" id="Color" name="Color" placeholder="Enter color" required />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Seats*</p>
          <FilterSelectDropdown name="Seats" options={GENERIC_OPTIONS("Seats")} isOpen={openDropdown === "Seats"} onToggleOpen={() => onToggleDropdown("Seats")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">City MPG*</p>
          <FilterSelectDropdown name="CityMPG" options={GENERIC_OPTIONS("CityMPG")} isOpen={openDropdown === "CityMPG"} onToggleOpen={() => onToggleDropdown("CityMPG")} />
        </div>

        <div className="padding-0 col-span-4">
          <p className="mb-8 font-weight-600">Doors*</p>
          <textarea placeholder="Lorem ipsum dolor sit amet, " rows={5} tabIndex={5} name="Doorstextarea" className="Doors" id="Doorstextarea" required />
        </div>
      </div>
    </div>
  );
}
