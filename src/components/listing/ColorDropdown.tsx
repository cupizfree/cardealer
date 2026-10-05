"use client";

// Extracted out of `FilterFields.tsx` so other filter UI shells (e.g. `TopSearchFilterBar.tsx`) can
// reuse the exact same color-swatch dropdown widget instead of redeclaring it.
export const COLOR_SWATCHES: Record<string, string> = {
  Black: "#000",
  White: "#fff",
  Gray: "#808080",
  Red: "#FF0000",
  Blue: "#0000FF",
};

export default function ColorDropdown({
  name,
  label,
  toggleId,
  selected,
  onSelect,
  isOpen,
  onToggleOpen,
}: {
  name: string;
  label: string;
  toggleId: string;
  selected: string | null;
  onSelect: (color: string) => void;
  isOpen: boolean;
  onToggleOpen: () => void;
}) {
  // Source pre-checks "Hitam" with no neutral/"all" option, so a color filter (and its tag) would
  // always be active on page load — since there's no real `Listing` color field to filter by anyway
  // (see the scope note in FilterSidebar.tsx), we start unselected instead of manufacturing a
  // permanent default tag. The swatch button still shows "Hitam" as a label until the user picks one,
  // matching the source's visual default without pretending it's an active filter.
  const displaySwatch = selected ? COLOR_SWATCHES[selected] : "#000";
  const displayText = selected ?? "Hitam";

  return (
    <div className="filter-group mb-18 relative">
      <div
        className={`filter-color-dropdown search-cars__select filter-select-dropdown${isOpen ? " active" : ""}`}
        data-name={name}
      >
        <p className="search-cars__label">{label}</p>
        <input
          type="checkbox"
          id={toggleId}
          className="filter-color-dropdown__toggle"
          checked={isOpen}
          onChange={onToggleOpen}
        />
        <div className="filter-color-dropdown__button">
          <label htmlFor={toggleId} className="filter-color-dropdown__selected">
            <span className="filter-color-dropdown__swatch" style={{ backgroundColor: displaySwatch }} />
            <span className="filter-color-dropdown__text">{displayText}</span>
          </label>
        </div>
        <div className="filter-color-dropdown__menu">
          <ul className="filter-color-dropdown__list">
            {Object.entries(COLOR_SWATCHES).map(([colorName, hex]) => (
              <li className="filter-color-dropdown__item" key={colorName}>
                <label className="filter-color-dropdown__option">
                  <input
                    type="radio"
                    name={name}
                    value={colorName}
                    checked={selected === colorName}
                    onChange={() => {
                      onSelect(colorName);
                      onToggleOpen(); // source's colorDropdown() closes the menu right after a pick
                    }}
                  />
                  <span
                    className="filter-color-dropdown__swatch"
                    style={{ backgroundColor: hex, border: hex === "#fff" ? "1px solid #E7E7E7" : undefined }}
                  />
                  <span>{colorName}</span>
                </label>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}
