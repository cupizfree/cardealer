import Image from "next/image";
import { withDetailFallback } from "@/data/listings";
import { muatKatalog } from "@/lib/katalog";
import type { SaleAgent } from "@/data/saleAgents";
import HalfMapListingCard from "@/components/listing/HalfMapListingCard";
import ReviewsSection from "@/components/common/ReviewsSection";

// Migrated from ../aurexo/sale-agents-details.html lines 489-969.
//
// `agent`'s name/photo now come from whichever `SaleAgent` record linked here (see
// `src/data/saleAgents.ts` and the `[slug]` route) instead of source's own hardcoded "Darrell
// Steward"/`sale-agent-9.jpg` — the explicit follow-up request was to pull each team item's own
// content into this shared template. A side effect: source's own name mismatch on this page
// (breadcrumb said "Bagas Prasetyo", heading+bio said "Darrell Steward") no longer exists, since the
// breadcrumb (in the `[slug]` page) and this heading now both read from the same `agent.name`.
//
// The two bio paragraphs stay source's own literal generic text (source only ever wrote ONE agent
// bio, for whichever card happened to link here) — but with the literal name mentions swapped for
// `agent.name`/first name, and "his"/"him" swapped for gender-neutral "their"/"them": these synthetic
// agent records carry no gender data, so keeping source's literal masculine pronouns would silently
// assert a gender for names that don't warrant the assumption (e.g. Bessie Cooper, Kristin Watson) —
// same reasoning as this project's own pronoun-neutrality convention. This is a name/pronoun
// substitution into an otherwise-unchanged generic narrative, not new biographical facts.
//
// "Dealer Inventory (3)" cards: all 3 titles ("Toyota Avanza 1.5 G", "2024 Hyundai Elantra", "Kia EV9
// 2024") match real `allListings` records (ids 1-3), but this page's own card images/specs/prices have
// drifted from the canonical values (e.g. this page shows all 3 with an identical demo spec block —
// 32500 miles/2022/EV/Manual — and its own `card-44/45/46.jpg` images) — same "per-page filler-content
// drift" already documented for listing-details-2's Description text. Rendered via the real,
// already-shared `HalfMapListingCard` with each listing's actual canonical data instead of
// transcribing this page's drifted values, consistent with the "no data invention" + reuse-canonical
// pattern used throughout `LISTING_DATA_MAP.md`. Same for Customer Reviews (byte-identical to the
// canonical detail dataset already used by every `/listing-details*` route) — neither of these varies
// per agent in source, so both stay the one shared block every agent's page shows.
export default function AgentProfile({ agent }: { agent: SaleAgent }) {
  const firstName = agent.name.split(" ")[0];

  // Inventaris diambil dari katalog hidup (basis data yang ditulis panel). Bagian yang
  // memang tidak punya data per-agen tetap memakai pengisi dari data statis.
  const katalog = muatKatalog();
  const dealerInventory = katalog.slice(0, 3);
  const canonicalDetail = withDetailFallback(katalog[0]);

  return (
    <div className="innerpage__content md-mb-30">
      <Image className="w-full mb-35 radius-16" src={agent.photo} alt={agent.name} width={495} height={495} />

      <h2 className="mb-12">{agent.name}</h2>
      <div className="flex">
        <div className="verify mb-16">
          <Image src="/assets/icons/SealCheck.svg" alt="verified" width={16} height={16} />
          <p className="text-highlight text-sm">Showroom Terverifikasi</p>
        </div>
      </div>

      <p className="text-secondary mb-4">
        {agent.name} sudah lebih dari 15 tahun menekuni industri jual-beli kendaraan. Dikenal
        karena mengutamakan kepentingan pembeli dan pemahaman mendalam soal pasar, {firstName}
        telah membantu banyak pelanggan menemukan mobil yang tepat dengan proses yang mudah dan
        menyenangkan.
      </p>

      <p className="text-secondary mb-40">
        Kecintaan pada dunia otomotif tumbuh sejak muda, mendorong mereka menguasai setiap sisi
        penjualan mobil — dari pelayanan pelanggan sampai solusi pembiayaan. {firstName}
        berkomitmen membangun hubungan jangka panjang dengan pelanggan, selalu mengutamakan
        kepercayaan dan keterbukaan.
      </p>

      <div className="divider mb-40 w-full" />

      <p className="h4 mb-16">Stok Dealer ({dealerInventory.length})</p>

      <div className="grid grid-cols-1 gap-20 mb-40">
        {dealerInventory.map((listing) => (
          <HalfMapListingCard listing={listing} key={listing.id} />
        ))}
      </div>

      <div className="divider mb-40 w-full" />

      <ReviewsSection ratingSummary={canonicalDetail.ratingSummary} reviews={canonicalDetail.reviews} />
    </div>
  );
}
