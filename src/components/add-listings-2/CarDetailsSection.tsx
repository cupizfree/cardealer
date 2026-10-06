import FilterSelectDropdown from "@/components/common/FilterSelectDropdown";

const GENERIC_OPTIONS = (label: string) => [
  { value: "FWD", label: `${label} 1` },
  { value: "RWD", label: `${label} 2` },
  { value: "AWD", label: `${label} 3` },
];

// Migrated from ../aurexo/add-listings-2.html lines 648-926. All dropdown options are source's own
// literal generic placeholders ("Model 1/2/3", "Type 1/2/3", etc.) — reproduced as-is.
//
// Label diterjemahkan ke bahasa Indonesia (situs berbahasa Indonesia). Dua bug sumber yang dulu
// dipertahankan sudah diperbaiki karena terlihat jelas oleh pengguna: opsi dropdown "Jumlah Pintu"
// dulu berlabel "Bahan Bakar 1/2/3" (salin-tempel dari dropdown di atasnya), dan label "Jumlah
// Pintu" dipakai DUA KALI — untuk dropdown dan untuk textarea di bagian bawah.
export default function CarDetailsSection({
  openDropdown,
  onToggleDropdown,
}: {
  openDropdown: string | null;
  onToggleDropdown: (name: string) => void;
}) {
  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Detail Mobil</p>

      <div className="grid grid-cols-4 gap-20 sm-grid-cols-1">
        <div className="padding-0 col-span-4">
          <p className="mb-8 font-weight-600">Judul Iklan*</p>
          <input className="input-large" type="text" id="title" name="title" placeholder="Judul Iklan*" defaultValue="Toyota Avanza 1.5 G" required />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Model*</p>
          <FilterSelectDropdown name="Model" options={GENERIC_OPTIONS("Model")} isOpen={openDropdown === "Model"} onToggleOpen={() => onToggleDropdown("Model")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Tipe*</p>
          <FilterSelectDropdown name="Tipe" options={GENERIC_OPTIONS("Tipe")} isOpen={openDropdown === "Tipe"} onToggleOpen={() => onToggleDropdown("Tipe")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Tahun*</p>
          <input className="input-large" type="text" id="Years" name="Years" placeholder="Tahun" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Kondisi*</p>
          <input className="input-large" type="text" id="Condition" name="Condition" placeholder="Kondisi" required />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Nomor Stok*</p>
          <input className="input-large" type="text" id="Enternumber" name="Enternumber" placeholder="Masukkan angka" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Nomor Rangka*</p>
          <input className="input-large" type="text" id="EnterVIN" name="EnterVIN" placeholder="Masukkan nomor rangka" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Jarak Tempuh*</p>
          <input className="input-large" type="text" id="mileage" name="mileage" placeholder="Masukkan jarak tempuh" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Transmisi*</p>
          <FilterSelectDropdown name="Transmisi" options={GENERIC_OPTIONS("Transmisi")} isOpen={openDropdown === "Transmisi"} onToggleOpen={() => onToggleDropdown("Transmisi")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Jenis Penggerak*</p>
          <FilterSelectDropdown name="Jenis Penggerak" options={GENERIC_OPTIONS("Jenis Penggerak")} isOpen={openDropdown === "Jenis Penggerak"} onToggleOpen={() => onToggleDropdown("Jenis Penggerak")} />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Kapasitas Mesin*</p>
          <input className="input-large" type="text" id="Enterengine" name="Enterengine" placeholder="Masukkan kapasitas mesin" required />
        </div>
        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Silinder*</p>
          <FilterSelectDropdown name="Silinder" options={GENERIC_OPTIONS("Silinder")} isOpen={openDropdown === "Silinder"} onToggleOpen={() => onToggleDropdown("Silinder")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Bahan Bakar*</p>
          <FilterSelectDropdown name="Bahan Bakar" options={GENERIC_OPTIONS("Bahan Bakar")} isOpen={openDropdown === "Bahan Bakar"} onToggleOpen={() => onToggleDropdown("Bahan Bakar")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Jumlah Pintu*</p>
          <FilterSelectDropdown name="Jumlah Pintu" options={GENERIC_OPTIONS("Jumlah Pintu")} isOpen={openDropdown === "Jumlah Pintu"} onToggleOpen={() => onToggleDropdown("Jumlah Pintu")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Warna*</p>
          <input className="input-large" type="text" id="Warna" name="Warna" placeholder="Masukkan warna" required />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Kursi*</p>
          <FilterSelectDropdown name="Kursi" options={GENERIC_OPTIONS("Kursi")} isOpen={openDropdown === "Kursi"} onToggleOpen={() => onToggleDropdown("Kursi")} />
        </div>

        <div className="lg-col-span-2 padding-0 sm-col-span-4">
          <p className="mb-8 font-weight-600">Konsumsi BBM (km/L)*</p>
          <FilterSelectDropdown name="Konsumsi BBM" options={GENERIC_OPTIONS("Konsumsi BBM")} isOpen={openDropdown === "Konsumsi BBM"} onToggleOpen={() => onToggleDropdown("Konsumsi BBM")} />
        </div>

        <div className="padding-0 col-span-4">
          <p className="mb-8 font-weight-600">Catatan Kondisi*</p>
          <textarea placeholder="Tuliskan kondisi bodi, mesin, dan kelengkapan dokumen." rows={5} tabIndex={5} name="Doorstextarea" className="Doors" id="Doorstextarea" required />
        </div>
      </div>
    </div>
  );
}
