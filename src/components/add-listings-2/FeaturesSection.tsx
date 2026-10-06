const FEATURE_GROUPS = [
  {
    label: "Label Harga Permintaan",
    items: [
      { id: "Front", label: "AC: Depan", checked: true },
      { id: "BackupCamera", label: "Kamera Mundur", checked: true },
      { id: "CruiseControl", label: "Kontrol Kecepatan", checked: true },
      { id: "Navigation", label: "Navigasi", checked: false },
      { id: "PowerLocks", label: "Kunci Elektrik", checked: false },
    ],
  },
  {
    label: "Hiburan",
    items: [
      { id: "Audiosystem", label: "Sistem audio", checked: false },
      { id: "Touchscreendisplay", label: "Layar sentuh", checked: false },
      { id: "GPSnavigation", label: "Navigasi GPS", checked: false },
      { id: "Phoneconnectivity", label: "Konektivitas ponsel", checked: false },
      { id: "IncarWiFi", label: "Wi-Fi dalam mobil", checked: false },
    ],
  },
  {
    label: "Keselamatan",
    items: [
      { id: "Antilockbrakesystem", label: "Sistem rem anti-lock", checked: false },
      { id: "Electronicstability", label: "Kontrol stabilitas elektronik", checked: false },
      { id: "Brakeassist", label: "Bantuan rem", checked: false },
      { id: "Airbags", label: "Airbag", checked: false },
      { id: "monitoringBlind", label: "Pemantau titik buta", checked: false },
    ],
  },
  {
    label: "Interior",
    items: [
      { id: "Premiumleather", label: "Kursi kulit premium", checked: false },
      { id: "Woodtrim", label: "Aksen kayu", checked: false },
      { id: "Minibar", label: "Mini bar", checked: false },
      { id: "ventilation", label: "Ventilasi kursi belakang", checked: false },
      { id: "Infotainment", label: "Layar infotainment", checked: false },
    ],
  },
  {
    label: "Eksterior",
    items: [
      { id: "Chromeplatedgrill", label: "Grill berlapis krom", checked: false },
      { id: "Smartheadlight", label: "Lampu utama pintar", checked: false },
      { id: "Premiumwheels", label: "Velg premium", checked: false },
      { id: "characterBody", label: "Garis karakter bodi", checked: false },
      { id: "Highqualitypaint", label: "Cat berkualitas tinggi", checked: false },
    ],
  },
];

// Migrated from ../aurexo/add-listings-2.html lines 928-1063. Plain checkboxes, no dropdown/toggle
// behavior — 3 of the 5 "Request Price Label" items start pre-checked, matching source exactly.
// Label fitur diterjemahkan ke bahasa Indonesia.
export default function FeaturesSection() {
  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Fitur</p>
      <div className="search-cars__features-grid grid grid-cols-5 gap-30 xl-grid-cols-3 md-grid-cols-2 sm-grid-cols-1">
        {FEATURE_GROUPS.map((group) => (
          <div className="flex flex-col gap-12" key={group.label}>
            <div>
              <p className="h7 font-weight-500">{group.label}</p>
            </div>
            {group.items.map((item) => (
              <div className="form-group" key={item.id}>
                <input type="checkbox" id={item.id} defaultChecked={item.checked} />
                <label htmlFor={item.id}>{item.label}</label>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
}
