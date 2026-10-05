import Image from "next/image";
import { allListings, withDetailFallback } from "@/data/listings";
import type { Dealer } from "@/data/dealers";
import HalfMapListingCard from "@/components/listing/HalfMapListingCard";
import ReviewsSection from "@/components/common/ReviewsSection";

// Migrated from ../aurexo/dealer-details.html lines 483-990, applying the exact same per-item
// approach as sale-agents-details.html's `[slug]` route (explicitly requested): `dealer`'s name/photo/
// address come from whichever `Dealer` record linked here (see `src/data/dealers.ts` and the `[slug]`
// route) instead of source's own hardcoded "Euro Workshop"/`volvo.png`/"537 Orchard St, NY" — none of
// which match any of the 8 real dealers from dealers-listing.html anyway (same "single static demo
// page with content that doesn't match its own list" situation `sale-agents-details.html` had before
// its own follow-up).
//
// The rating ("4.8", "751 review") has no per-dealer equivalent anywhere in source — `Dealer` only
// carries a `filledStars` (5 vs. 4-visual) flag, not a distinct decimal average per dealer — so this
// one stays source's literal shared value on every dealer's page, same treatment as the "Dealer
// Inventory"/"Ulasan Pelanggan" sections below (no real per-dealer data to pull instead).
//
// The two bio paragraphs are the SAME literal generic text as sale-agents-details.html (source copy-
// pasted the same "Darrell Steward is a dedicated automotive professional..." bio onto this page
// too) — same name/pronoun substitution treatment as `AgentProfile`: literal name mentions swapped for
// `dealer.name`, "his"/"him" swapped for gender-neutral "their"/"them" (a business name carries no
// gender at all, so keeping source's literal masculine pronouns here would be even less appropriate
// than on the agent page).
//
// "Dealer Inventory (3)" and "Ulasan Pelanggan" are byte-identical to sale-agents-details.html's own
// (same 3 listing titles/images with the same per-page drift, same 4.8/3-reviewer review data) — reused
// via the same `HalfMapListingCard`/`ReviewsSection` components and the same canonical `allListings`
// data, not a second transcription.
const dealerInventory = allListings.slice(0, 3);
const canonicalDetail = withDetailFallback(allListings[0]);

export default function DealerProfile({ dealer }: { dealer: Dealer }) {
  return (
    <div className="innerpage__content md-mb-30">
      <div className="flex gap-28 mb-40">
        <div>
          <Image className="w-100 radius-16" src={dealer.image} alt={dealer.name} width={300} height={200} />
        </div>
        <div>
          <div className="flex mb-14">
            <div className="verify">
              <Image src="/assets/icons/SealCheck.svg" alt="verified" width={16} height={16} />
              <p className="text-highlight text-sm">Showroom Terverifikasi</p>
            </div>
          </div>
          <p className="h3 mb-12">{dealer.name}</p>
          <div className="flex items-center flex-wrap gap-20">
            <div className="flex gap-4">
              <svg width="24" height="24" viewBox="0 0 28 28" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M14 7.21875C13.178 7.21875 12.3744 7.46251 11.6909 7.9192C11.0074 8.3759 10.4747 9.02502 10.1601 9.78447C9.84555 10.5439 9.76324 11.3796 9.92361 12.1858C10.084 12.9921 10.4798 13.7326 11.0611 14.3139C11.6423 14.8952 12.3829 15.291 13.1892 15.4514C13.9954 15.6118 14.8311 15.5295 15.5905 15.2149C16.35 14.9003 16.9991 14.3676 17.4558 13.6841C17.9125 13.0006 18.1562 12.197 18.1562 11.375C18.1562 10.2727 17.7184 9.21554 16.9389 8.43609C16.1595 7.65664 15.1023 7.21875 14 7.21875ZM14 14.2187C13.4376 14.2187 12.8877 14.052 12.4201 13.7395C11.9524 13.427 11.588 12.9829 11.3727 12.4633C11.1575 11.9436 11.1012 11.3718 11.2109 10.8202C11.3206 10.2686 11.5915 9.76187 11.9892 9.36416C12.3869 8.96646 12.8936 8.69562 13.4452 8.58589C13.9968 8.47616 14.5686 8.53248 15.0883 8.74772C15.6079 8.96295 16.052 9.32744 16.3645 9.7951C16.677 10.2627 16.8438 10.8126 16.8438 11.375C16.8438 12.1292 16.5441 12.8525 16.0108 13.3858C15.4775 13.9191 14.7542 14.2187 14 14.2187ZM14 1.96875C11.5062 1.97164 9.11536 2.96359 7.35197 4.72697C5.58859 6.49036 4.59664 8.8812 4.59375 11.375C4.59375 14.7558 6.16219 18.3466 9.12953 21.7591C10.4688 23.3069 11.9762 24.7008 13.6237 25.9153C13.734 25.9925 13.8654 26.0339 14 26.0339C14.1346 26.0339 14.266 25.9925 14.3763 25.9153C16.0238 24.7008 17.5312 23.3069 18.8705 21.7591C21.8378 18.3466 23.4062 14.7591 23.4062 11.375C23.4034 8.8812 22.4114 6.49036 20.648 4.72697C18.8846 2.96359 16.4938 1.97164 14 1.96875ZM14 24.5558C12.3594 23.2892 5.90625 17.8959 5.90625 11.375C5.90625 9.2284 6.75898 7.16973 8.27685 5.65185C9.79473 4.13398 11.8534 3.28125 14 3.28125C16.1466 3.28125 18.2053 4.13398 19.7231 5.65185C21.241 7.16973 22.0938 9.2284 22.0938 11.375C22.0938 17.8959 15.6406 23.2892 14 24.5558Z"
                  fill="#4B4B4B"
                />
              </svg>
              <p className="text-secondary">{dealer.address}</p>
            </div>

            <div className="divider-vertical-style3 h-16 md-hidden" />

            <div className="flex gap-4">
              <Image src="/assets/icons/star-2.svg" alt="star" width={16} height={16} />
              <p className="font-weight-600">4.8</p>
              <p className="text-secondary">(751 review)</p>
            </div>
          </div>
        </div>
      </div>

      <div className="divider mb-40 w-full" />

      <p className="text-secondary mb-4">
        {dealer.name} is a dedicated automotive professional with over 15 years of experience in the
        car dealership industry. Known for their customer-first approach and in-depth knowledge of the
        market, {dealer.name} has helped countless clients find their perfect vehicle while ensuring a
        seamless and enjoyable buying experience.
      </p>

      <p className="text-secondary mb-40">
        Their passion for automobiles began at a young age, driving them to excel in understanding
        every aspect of car sales, from customer service to financing solutions. {dealer.name} is
        committed to building lasting relationships with their clients, always prioritizing trust and
        transparency.
      </p>

      <div className="divider mb-40 w-full" />

      <p className="h4 mb-16">Dealer Inventory ({dealerInventory.length})</p>

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
