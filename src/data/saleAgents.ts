// Canonical sale-agent entity — mirrors `src/data/listings.ts`'s pattern (one shared dataset, both
// the list page and the detail page consume the same records instead of each hand-rolling their own).
// All 8 records come straight from ../aurexo/sale-agents.html's 8 cards (name/role/photo) — the only
// per-agent fields source actually varies. `slug` is synthetic (kebab-case of `name`): source has no
// working per-agent route at all (every one of the 8 cards' links point at the same literal
// `sale-agents-details.html` file — see docs/migration/COMPONENT_MAP.md #37), so aurexo-nextjs is free
// to design its own identifier here, same reasoning as `LISTING_DATA_MAP.md`'s `Listing.slug`.
export type SaleAgent = {
  id: number;
  slug: string;
  name: string;
  role: string;
  photo: string;
  // Source's 2nd card (Bessie Cooper) carries a static `.active` modifier class matching its own
  // `:hover` CSS rule (see COMPONENT_MAP.md #35) — a permanent "pre-hovered" demo effect on that one
  // card only, preserved verbatim.
  active?: boolean;
};

export const allSaleAgents: SaleAgent[] = [
  { id: 1, slug: "robert-fox", name: "Robert Fox", role: "Senior Sales Agent", photo: "/assets/images/pages/sale-agent-1.jpg" },
  { id: 2, slug: "bessie-cooper", name: "Bessie Cooper", role: "Sales Team Leader", photo: "/assets/images/pages/sale-agent-2.jpg", active: true },
  { id: 3, slug: "brooklyn-simmons", name: "Brooklyn Simmons", role: "Account Manager", photo: "/assets/images/pages/sale-agent-3.jpg" },
  { id: 4, slug: "kristin-watson", name: "Kristin Watson", role: "Client Relationship Manager", photo: "/assets/images/pages/sale-agent-4.jpg" },
  { id: 5, slug: "guy-hawkins", name: "Guy Hawkins", role: "Sales Coordinator", photo: "/assets/images/pages/sale-agent-5.jpg" },
  { id: 6, slug: "darrell-steward", name: "Darrell Steward", role: "manager seller", photo: "/assets/images/pages/sale-agent-6.jpg" },
  { id: 7, slug: "cody-fisher", name: "Cody Fisher", role: "Leader Seller", photo: "/assets/images/pages/sale-agent-7.jpg" },
  { id: 8, slug: "eleanor-pena", name: "Eleanor Pena", role: "Sales Team Leader", photo: "/assets/images/pages/sale-agent-8.jpg" },
  { id: 9, slug: "robert-fox", name: "Robert Fox", role: "Senior Sales Agent", photo: "/assets/images/pages/sale-agent-1.jpg" },
  { id: 10, slug: "bessie-cooper", name: "Bessie Cooper", role: "Sales Team Leader", photo: "/assets/images/pages/sale-agent-2.jpg", active: true },
  { id: 11, slug: "brooklyn-simmons", name: "Brooklyn Simmons", role: "Account Manager", photo: "/assets/images/pages/sale-agent-3.jpg" },
  { id: 12, slug: "kristin-watson", name: "Kristin Watson", role: "Client Relationship Manager", photo: "/assets/images/pages/sale-agent-4.jpg" },
];
