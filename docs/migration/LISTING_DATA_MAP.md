# Listing Data Map

> Documents source relationships behind `src/data/listings.ts`. Does not duplicate the dataset — see that
> file for the actual records. Read this before migrating any listing/listing-details/home-carousel page so
> the same canonical data is reused instead of re-derived per page.

## Card → canonical `Listing` → `listing-details-1.html` mapping chain

1. **Card scan**: 30 of 63 Aurexo HTML files contain listing cards (`card-box-style-1/2/8/9`, ~1,100+ card
   instances total across the site). Deduplicating by title+image against the richest single source page
   (`listing-grid4-columns.html`, 27 raw instances) yields **12 distinct listings** — this is the complete
   `allListings` array, no more, no fewer.
2. **Critical routing finding**: every single one of those ~1,100+ card instances — across every page that
   has cards, including the "You might also like" section inside `listing-details-1.html` through
   `listing-details-6.html` — links (image, title, and "View details") to the one static file
   `listing-details-1.html`. `listing-details-2.html` through `-6.html` are reachable **only** via the
   header's "Listing" nav dropdown, never from any card. There is no working per-listing route in the Aurexo
   source at all.
3. **Consequence for architecture**: `listing-details-1.html` … `-6.html` are **layout variants of one
   detail-page template**, not 6 different cars — the same relationship as Luminor's
   `property-details-1..4`, which all render different layouts over the identical `allProperties` dataset
   via `[id]`/`generateStaticParams`. Future `/migrate-page` runs on `listing-details-2..6.html` should
   render a different layout for a listing chosen from `allListings`, not invent a second dataset.
4. **Which canonical listing does `listing-details-1.html` represent?** Its own `<h2>` title, "Audi A6 Avant
   e-tron", near-exactly matches `allListings[0]` ("Audi A6 Avant E-Tron", `card-1.jpg`, badge "Special",
   brand "Audi") — the single most-recurring card in the entire site (~70 occurrences). This is the
   strongest available evidence and is treated as a confident title-match, not a guess. It is the only
   record in `allListings` with `overview`/`gallery`/`description`/`features`/`location`/`ratingSummary`/
   `reviews`/`dealer` populated.

## Identifier strategy

`Listing.id` (numeric) + `Listing.slug` (kebab-case from title, e.g. `audi-a6-avant-e-tron`) are both
present; `slug` is the intended route param. Neither reference project's source dictates a specific
convention to inherit here: Aurexo has no working per-listing route to copy, and Luminor's own convention
(`property-details-N/[id]`, plain numeric id, no slug) is a legitimate but not mandatory pattern to follow
verbatim. A slug is more correct for a real listing marketplace (human-readable URLs, doesn't expose a raw
sequential id) and costs nothing extra since a numeric `id` is still kept internally for `find`/
`relatedListingIds` joins — mirroring Luminor's proven `find(l => ... ) ?? allListings[0]` +
`generateStaticParams` shape exactly, just keyed on `slug` instead of `id`.

**This is scoped to listings only.** It does not retroactively change the `[id]`-based convention already
recorded in `COMPONENT_MAP.md` for dealer-details/blog-details/product-details — extending the slug pattern
site-wide is a separate future decision, not made here.

## Documented, unreconciled source discrepancies

These are preserved exactly as found in the source, in their respective fields — never merged, averaged, or
silently corrected:

1. **`spec` vs `overview` numeric disagreement (listing id 1 only)**: the card (`spec`) says "32500 miles /
   EV / Manual"; the detail page's own Car Overview grid (`overview`) says "51600 km / Benzin + Plin /
   Automatic" — for what title evidence says is the same listing. Year (2022) and price ($44.900) agree;
   mileage unit, fuel type, and transmission do not. `spec` is kept as the card-sourced value (since all 12
   records need it populated consistently for any card grid to render correctly); `overview` keeps the
   detail page's own values untouched. Do not overwrite one with the other.
2. **`overview.location` vs `location.address` (listing id 1 only)**: the Car Overview grid's "Location"
   field says "Tampa, FL"; the separate Location/Map section on the same page says "6205 Peachtree Dunwoody
   Rd, Atlanta, GA 30328". Both kept verbatim in their respective fields.
3. **Map embed coordinates**: `location.mapEmbedUrl`'s encoded coordinates actually resolve to New Jersey,
   not Atlanta. Kept verbatim (it's a real per-listing URL in the source) — not "fixed," per the
   html-fidelity rule against silently correcting source content.
4. **Brand label vs. title mismatches** (listings 6, 9, 10, 12): the card's brand/category label doesn't
   match the make implied by the title (e.g. id 6 "Genesis Electrified G80" is labeled brand "BMW"). Kept
   verbatim as template authoring drift, not corrected.
5. **Feature checklist repetition** (listing id 1): the source's 6 category tabs (Exterior/Interior/Safety/
   Mechanical/Technology/Other) all show the identical 12-item checklist rather than genuinely different
   items per category. Preserved as-is — the tab *structure* is real (`ListingFeatures` requires all 6
   keys), the per-category *content* differentiation simply doesn't exist in the source yet.
6. **Financing calculator values** (listing id 1, detail page only): the calculator's inputs/outputs are
   static HTML values with no JS binding (confirmed no `FinancingCalculator*` handlers in `app.js`/
   `swiper.js`) and don't numerically reconcile with the listing's own price. Treated as `UI_ONLY` — not
   modeled as a `Listing` field at all.
7. **`brandHref`**: the type reserves this optional field, but every brand-label link found in the source
   for the main card grid resolves back to `listing-details-1.html` itself (redundant with the card's own
   link, not a real distinct "brand page"). Left `undefined` on all 12 records rather than encoding a
   non-informative/misleading href.

## Data gaps (explicitly absent, not fabricated)

Only `listing-details-1.html` was analyzed as a detail page this session. Listings 2–12 in `allListings`
therefore have **no** `overview`, `gallery`, `description`, `features`, `location`, `ratingSummary`,
`reviews`, or `dealer` — these fields are simply `undefined` on those records. A future `/migrate-page` or
`/analyze-html` run on `listing-details-2.html` through `-6.html` (rendering a different layout, per the
"layout variants" finding above) should pick one of listings 2–12 to attach real detail data to, sourced
from that HTML file directly — never copy listing 1's detail data onto another record, and never invent
values to fill the gap.

**Update (`/listing-details/[slug]` migrated)**: this gap is now visible to real users, not just a data
note. Initial approach hid every optional section for the 11 records without detail data (thinner page)
— superseded after user feedback plus Luminor's own precedent (its `Description()`/`Overview()`/
`Comment()` also take no per-property props): `withDetailFallback()` (in this file) now gives every
listing the full section layout, falling back to `allListings[0]`'s real analyzed content
(Description/Features/Location/Reviews/Dealer, plus `overview`'s 6 non-`spec` fields) wherever a record
doesn't have its own. Only genuinely real per-listing fields stay as-is: image, title, price, and
`overview`'s 4 fields shared with `spec` (mileage/year/fuel/transmission). The gallery follows the same
idea: slide 1 is the listing's real `image`, slides 2-4 reuse the same generic stills id 1's gallery
uses — full 4-slide layout, only slide 1 is per-listing. See COMPONENT_MAP.md #21 for the full rationale.

## Related listings

`getRelatedListings(listing, count)` in `src/data/listings.ts` is an explicit, documented placeholder:
exclude the current listing, return the next `count` others from `allListings`. This is deliberately
different from Luminor's `Relatest.tsx`, which unconditionally does `properties.slice(0, 3)` regardless of
which property is being viewed (and even includes the current property in its own reference implementation
in some cases) — our version at least excludes self and is a named function ready to be swapped for real
curation (e.g. by `brandLabel`/fuel/price-band) via `relatedListingIds` once such a signal is designed. No
such signal currently exists in the source (no shared category field is reliably present across the card
pool), so this stays a placeholder, not a fabricated "similarity" feature.

## Card component consumption (for future `/migrate-page` / `/migrate-section` work)

Every future card variant component (mirroring Aurexo's `card-box-style-1/2/8/9` visual variants) should
accept `ListingCardData` (a named `Pick<Listing, ...>` exported from `src/data/listings.ts`), not a
hand-rolled local type — this is the specific anti-pattern observed and rejected in Luminor's reference,
where nearly every property-details sub-component redeclares its own ad hoc, differently-narrowed local
`Property` type instead of importing the shared one.
