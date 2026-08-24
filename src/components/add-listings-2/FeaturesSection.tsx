const FEATURE_GROUPS = [
  {
    label: "Request Price Label",
    items: [
      { id: "Front", label: "A/C: Front", checked: true },
      { id: "BackupCamera", label: "Backup Camera", checked: true },
      { id: "CruiseControl", label: "Cruise Control", checked: true },
      { id: "Navigation", label: "Navigation", checked: false },
      { id: "PowerLocks", label: "Power Locks", checked: false },
    ],
  },
  {
    label: "Entertainment",
    items: [
      { id: "Audiosystem", label: "Audio system", checked: false },
      { id: "Touchscreendisplay", label: "Touchscreen display", checked: false },
      { id: "GPSnavigation", label: "GPS navigation", checked: false },
      { id: "Phoneconnectivity", label: "Phone connectivity", checked: false },
      { id: "IncarWiFi", label: "In-car Wi-Fi", checked: false },
    ],
  },
  {
    label: "Safety",
    items: [
      { id: "Antilockbrakesystem", label: "Anti-lock brake system", checked: false },
      { id: "Electronicstability", label: "Electronic stability control", checked: false },
      { id: "Brakeassist", label: "Brake assist", checked: false },
      { id: "Airbags", label: "Airbags", checked: false },
      { id: "monitoringBlind", label: "Blind spot monitoring", checked: false },
    ],
  },
  {
    label: "Interior",
    items: [
      { id: "Premiumleather", label: "Premium leather seats", checked: false },
      { id: "Woodtrim", label: "Wood trim", checked: false },
      { id: "Minibar", label: "Mini bar", checked: false },
      { id: "ventilation", label: "Rear seat ventilation", checked: false },
      { id: "Infotainment", label: "Infotainment screen", checked: false },
    ],
  },
  {
    label: "Exterior",
    items: [
      { id: "Chromeplatedgrill", label: "Chrome-plated grill", checked: false },
      { id: "Smartheadlight", label: "Smart headlight cluster", checked: false },
      { id: "Premiumwheels", label: "Premium wheels", checked: false },
      { id: "characterBody", label: "Body character lines", checked: false },
      { id: "Highqualitypaint", label: "High-quality paint", checked: false },
    ],
  },
];

// Migrated from ../aurexo/add-listings-2.html lines 928-1063. Plain checkboxes, no dropdown/toggle
// behavior — 3 of the 5 "Request Price Label" items start pre-checked, matching source exactly.
export default function FeaturesSection() {
  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Features</p>
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
