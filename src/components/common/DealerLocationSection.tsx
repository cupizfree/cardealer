import FilterSelectDropdown from "./FilterSelectDropdown";

const ADDRESS = "6205 Peachtree Dunwoody Rd, Atlanta, GA 30328";

const MAP_OPTIONS = [
  { value: ADDRESS, label: ADDRESS },
  { value: "RWD", label: `${ADDRESS} 2` },
  { value: "AWD", label: `${ADDRESS} 3` },
];

// Shared by add-listings-2.html and my-profile.html — confirmed byte-identical via source diff (same
// "Full Address*"/"Map Location*" fields down to the literal `id="PriceListing"`, same static Google
// Maps iframe). First built as `add-listings-2/LocationSection`, moved here once my-profile.html needed
// the exact same block, same "extract into `common/` once a second page needs it" precedent as
// `Pagination`/`SocialIcons`. "Map Location*"'s own 3 options are source's own literal address repeated
// with " 2"/" 3" appended (confirmed via source read, not a transcription shortcut) — its first option
// starts checked, matching source. Static Google Maps `<iframe>` embed (Package Principle, same pattern
// as `ContactMap`/`AgentSidebar`/`DealerSidebar`) — its coordinates don't actually match the Atlanta
// address shown (a real, disclosed source mismatch already noted elsewhere, not reconciled here either).
export default function DealerLocationSection({
  openDropdown,
  onToggleDropdown,
}: {
  openDropdown: string | null;
  onToggleDropdown: (name: string) => void;
}) {
  return (
    <div className="dashboard-box bg-white style-3 mb-30">
      <p className="h4 mb-20">Lokasi</p>

      <div className="grid grid-cols-2 gap-20 md-grid-cols-1 mb-20">
        <div>
          <p className="mb-8 font-weight-600">Alamat Lengkap*</p>
          <input className="input-large" type="text" id="FullAddress" name="FullAddress" placeholder={ADDRESS} required />
        </div>
        <div>
          <p className="mb-8 font-weight-600">Lokasi Peta*</p>
          <FilterSelectDropdown
            name="SelectLocation"
            options={MAP_OPTIONS}
            isOpen={openDropdown === "SelectLocation"}
            onToggleOpen={() => onToggleDropdown("SelectLocation")}
            defaultSelected={[ADDRESS]}
          />
        </div>
      </div>

      <div className="widget-gg-map flex radius-8 overflow-hidden">
        <iframe
          src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s"
          height={281}
          style={{ border: 0, width: "100%" }}
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
    </div>
  );
}
