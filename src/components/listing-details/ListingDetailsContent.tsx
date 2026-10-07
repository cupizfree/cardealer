import Image from "next/image";
import type { FeatureCategory, ListingWithDetail } from "@/data/listings";
import FeatureTabs from "./FeatureTabs";
import KalkulatorKreditDetail from "./KalkulatorKreditDetail";
import { angkaDariTeks } from "@/lib/kredit";
import ReviewsSection from "@/components/common/ReviewsSection";

// `listing` is expected to already be passed through `withDetailFallback` (src/data/listings.ts),
// so every optional field here is guaranteed populated — either this listing's own real detail data
// (only id 1 has it) or the shared generic content reused from that one analyzed page. See that
// function's comment for the full rationale (mirrors Luminor's property-details precedent).
//
// `overviewLayout`/`featureDefaultTab`/`reviewFormVariant` cover the places listing-details-2.html
// and listing-details-3.html actually differ from listing-details-1.html (confirmed via direct
// source diff) — Description, the Financing Calculator, Location/map, and the rating-box/comments
// are byte-identical across all three, so this stays one component with props rather than a
// duplicated ~200-line file per variant (variant classification rule: the gallery's DOM shape is
// genuinely different per page — see `DetailsGalleryGrid`/`DetailsGalleryWithThumbs` — but this
// content tree is the same shape with a handful of modifier points).
//
// `overviewLayout="none"` + `bare` cover listing-details-3.html specifically: its Car Overview moved
// into the SIDEBAR (a `car-overview-list-style2` box — see `ListingDetailsSidebar`'s `overview` prop)
// and is not rendered in the main content column at all, and its `.listing-details--content` wrapper
// div needs to also contain the title-bar + gallery above this component (unlike v1/v2, where those
// live in a separate full-width section outside `.listing-details`) — so the page assembles that
// wrapper itself and `bare` skips this component's own copy of it.
//
// `overviewLayout="cards"` + `sectionIds` + `wrapperId` + `reviewsHeaderButton` cover
// listing-details-4.html: a 4th Car Overview presentation (`car-overview-list-style3`, 5-column
// bordered cards, icon/label/value stacked vertically), plus a real scroll-to-anchor tab bar
// (`ListingDetailsScrollNav`) that needs `id="Overview"` on this component's own wrapper and
// `id="Deskripsi"`/`id="Informasi"`/`id="Lokasi"`/`id="Ulasan"` on each section — added to each
// section's leading heading/wrapper rather than reproducing source's exact divider-inside-vs-outside
// nesting, since the only observable effect of those ids is as a scroll target (confirmed no CSS
// keys off them) — landing on the heading is behaviorally identical to landing on source's div.
// `reviewsHeaderButton=false` matches listing-details-4.html's Customer Reviews heading having no
// small "Tulis ulasan" button next to it (only the rating-box's own button remains) — confirmed
// via direct source diff against v1/v2/v3, which all have both.
//
// `overviewLayout="cardsRow"` covers listing-details-5.html: a 5th Car Overview presentation
// (`car-overview-list-style4`, 4-column bordered cards — icon on the LEFT, label+value stacked to
// its right, vs. `"cards"`'s icon-on-top layout).
export default function ListingDetailsContent({
  listing,
  overviewLayout = "columns",
  featureDefaultTab = "Exterior",
  bare = false,
  sectionIds = false,
  wrapperId,
}: {
  listing: ListingWithDetail;
  overviewLayout?: "columns" | "flat" | "none" | "cards" | "cardsRow";
  featureDefaultTab?: FeatureCategory;
  bare?: boolean;
  sectionIds?: boolean;
  wrapperId?: string;
}) {
  const { overview, location } = listing;

  const body = (
    <>
      {overviewLayout !== "none" && (
        <>
          <p className="h4 mb-16">Ringkasan Mobil</p>

          {overviewLayout === "columns" && (
            <div className="grid grid-cols-2 md-grid-cols-1 gap-24 mb-40">
              <ul className="flex flex-col gap-16">
                <OverviewRow icon="icon-gauge.svg" label="Jarak Tempuh:" value={overview.mileage} />
                <OverviewRow icon="calendar.svg" label="Tahun:" value={overview.year} />
                <OverviewRow icon="gaspump.svg" label="Bahan Bakar:" value={overview.fuel} />
                <OverviewRow icon="palette.svg" label="Warna:" value={overview.color} />
                <OverviewRow icon="MapPin.svg" label="Lokasi:" value={overview.location} />
              </ul>
              <ul className="flex flex-col gap-16">
                <OverviewRow icon="Seatbelt.svg" label="Interior:" value={overview.interior} />
                <OverviewRow icon="Frame.svg" label="Mesin:" value={overview.engine} />
                <OverviewRow icon="transmission-2.svg" label="Transmisi:" value={overview.transmission} />
                <OverviewRow icon="Barcode.svg" label="VIN:" value={overview.vin} />
                <OverviewRow icon="QrCode.svg" label="Nomor Stok:" value={overview.stockNumber} />
              </ul>
            </div>
          )}

          {overviewLayout === "flat" && (
            <ul className="gap-16 car-overview-list mb-40">
              <FlatOverviewRow icon="icon-gauge.svg" value={overview.mileage} />
              <FlatOverviewRow icon="calendar.svg" value={overview.year} />
              <FlatOverviewRow icon="gaspump.svg" value={overview.fuel} />
              <FlatOverviewRow icon="palette.svg" value={overview.color} />
              <FlatOverviewRow icon="MapPin.svg" value={overview.location} />
              <FlatOverviewRow icon="Seatbelt.svg" value={overview.interior} />
              <FlatOverviewRow icon="Frame.svg" value={overview.engine} />
              <FlatOverviewRow icon="transmission-2.svg" value={overview.transmission} />
              <FlatOverviewRow icon="Barcode.svg" value={overview.vin} />
              <FlatOverviewRow icon="QrCode.svg" value={overview.stockNumber} />
            </ul>
          )}

          {overviewLayout === "cards" && (
            <ul className="gap-20 car-overview-list-style3 mb-32">
              <CardOverviewRow icon="icon-gauge.svg" label="Jarak Tempuh" value={overview.mileage} />
              <CardOverviewRow icon="calendar.svg" label="Tahun" value={overview.year} />
              <CardOverviewRow icon="gaspump.svg" label="Bahan Bakar" value={overview.fuel} />
              <CardOverviewRow icon="palette.svg" label="Warna" value={overview.color} />
              <CardOverviewRow icon="MapPin.svg" label="Lokasi" value={overview.location} />
              <CardOverviewRow icon="Seatbelt.svg" label="Interior" value={overview.interior} />
              <CardOverviewRow icon="Frame.svg" label="Mesin" value={overview.engine} />
              <CardOverviewRow icon="transmission-2.svg" label="Transmisi" value={overview.transmission} />
              <CardOverviewRow icon="Barcode.svg" label="VIN" value={overview.vin} />
              <CardOverviewRow icon="QrCode.svg" label="Nomor Stok" value={overview.stockNumber} />
            </ul>
          )}

          {overviewLayout === "cardsRow" && (
            <ul className="gap-20 car-overview-list-style4 mb-30">
              <CardRowOverviewRow icon="icon-gauge.svg" label="Jarak Tempuh" value={overview.mileage} />
              <CardRowOverviewRow icon="calendar.svg" label="Tahun" value={overview.year} />
              <CardRowOverviewRow icon="gaspump.svg" label="Bahan Bakar" value={overview.fuel} />
              <CardRowOverviewRow icon="palette.svg" label="Warna" value={overview.color} />
              <CardRowOverviewRow icon="MapPin.svg" label="Lokasi" value={overview.location} />
              <CardRowOverviewRow icon="Seatbelt.svg" label="Interior" value={overview.interior} />
              <CardRowOverviewRow icon="Frame.svg" label="Mesin" value={overview.engine} />
              <CardRowOverviewRow icon="transmission-2.svg" label="Transmisi" value={overview.transmission} />
              <CardRowOverviewRow icon="Barcode.svg" label="VIN" value={overview.vin} />
              <CardRowOverviewRow icon="QrCode.svg" label="Nomor Stok" value={overview.stockNumber} />
            </ul>
          )}

          <div className="divider w-full mb-40" />
        </>
      )}
      <p className="h4 mb-16" id={sectionIds ? "Deskripsi" : undefined}>
        Deskripsi
      </p>
      <p className="text-secondary mb-40">{listing.description}</p>

      <div className="divider w-full mb-40" />
      <p className="h4 mb-16 capitalize" id={sectionIds ? "Informasi" : undefined}>
        Kenali Mobil Ini
      </p>
      <FeatureTabs features={listing.features} defaultActive={featureDefaultTab} />

      <div className="divider w-full mb-40" />
      {/* Financing calculator is static, unwired UI in the source (no JS handler anywhere for
          `FinancingCalculator*` inputs — see LISTING_DATA_MAP.md #6, treated as UI_ONLY). */}
      <p className="h4 mb-16">Simulasi Kredit</p>
      <KalkulatorKreditDetail hargaAwal={angkaDariTeks(listing.price)} />

      <div className="divider w-full mb-40" />
      <div className="flex items-center gap-16 justify-between mb-16 md-flex-col md-items-start" id={sectionIds ? "Lokasi" : undefined}>
        <div>
          <p className="h4 mb-12">Lokasi</p>
          <p className="flex items-center gap-8">
            <Image className="w-16 h-16" src="/assets/icons/MapPin.svg" alt="location" width={16} height={16} />
            {location.address}
          </p>
        </div>
        <a href="#" className="text-sm text-underline text-highlight">
          Petunjuk Arah
        </a>
      </div>
      <div className="widget-gg-map flex radius-16 overflow-hidden mb-40">
        <iframe
          src={location.mapEmbedUrl}
          height={523}
          style={{ border: 0, width: "100%" }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>

      <div className="divider w-full mb-40" />
      <ReviewsSection sectionId={sectionIds ? "Ulasan" : undefined} />
    </>
  );

  if (bare) return body;
  return (
    <div className="listing-details--content" id={wrapperId}>
      {body}
    </div>
  );
}

function OverviewRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex items-center gap-8 flex-wrap">
      <Image className="w-28 h-28" src={`/assets/icons/${icon}`} alt={label} width={28} height={28} />
      <span className="h7 text-secondary">{label}</span> <span className="h7 font-weight-500">{value}</span>
    </li>
  );
}

// listing-details-2.html's Car Overview is a single flat list — icon + value only, no "Label:" text
// at all (confirmed via direct source read) — unlike listing-details-1.html's 2-column layout above.
function FlatOverviewRow({ icon, value }: { icon: string; value: string }) {
  return (
    <li className="flex items-center flex-wrap">
      <Image className="w-28 h-28" src={`/assets/icons/${icon}`} alt="" width={28} height={28} />
      <span className="h7 font-weight-500">{value}</span>
    </li>
  );
}

// listing-details-4.html's Car Overview is a 5-column grid of bordered cards
// (`car-overview-list-style3`) — icon on top, then a label, then the value, all stacked vertically —
// a 4th distinct Car Overview presentation.
function CardOverviewRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex items-center flex-wrap">
      <Image src={`/assets/icons/${icon}`} alt={label} width={40} height={40} />
      <p className="text-secondary mb-6">{label}</p>
      <span className="h5 font-weight-500 capitalize">{value}</span>
    </li>
  );
}

// listing-details-5.html's Car Overview is a 4-column bordered-card grid
// (`car-overview-list-style4`) — icon on the LEFT, label+value stacked in a `<p>` to its right, a 5th
// distinct Car Overview presentation.
function CardRowOverviewRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <li className="flex items-center">
      <Image src={`/assets/icons/${icon}`} alt={label} width={48} height={48} />
      <p>
        <span className="text-secondary mb-4">{label}</span>
        <span className="h5 font-weight-600 capitalize">{value}</span>
      </p>
    </li>
  );
}
