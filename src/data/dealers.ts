// Canonical dealer entity for dealers-listing.html's 8 `.dealer-box` rows — mirrors `allSaleAgents`'
// pattern (one shared dataset, not a locally hand-rolled per-page array). `slug` is synthetic
// kebab-case of `name`: every one of the 8 rows' "Dealer Details" links point at the same literal
// `dealer-details.html` file in source (no per-dealer route anywhere), same "no working per-item
// route in source" situation as sale-agents/listings before their own synthetic slugs.
export type Dealer = {
  id: number;
  slug: string;
  name: string;
  image: string;
  // Source shows dealer #1 with 5 filled `star-2.svg` icons and every other dealer with 4 filled +
  // 1 `star-5.svg` (a distinct, presumably "unfilled", star icon) — all 8 still show the identical
  // "(1,968 Ratings)" count regardless (preserved verbatim, not reconciled into 8 different numbers).
  filledStars: number;
  address: string;
  phones: string[];
};

export const allDealers: Dealer[] = [
  { id: 1, slug: "dynamic-drive-garage", name: "Dynamic Drive Garage", image: "/assets/images/pages/car-1.png", filledStars: 5, address: "6205 Peachtree Dunwoody Rd, Atlanta, GA 30328", phones: ["1-555-678-77777", "1-555-678-8888"] },
  { id: 2, slug: "bluepropel-autohaus", name: "BluePropel Autohaus", image: "/assets/images/pages/car-2.png", filledStars: 4, address: "1234 Pinehill Drive, Suite 204, Denver, CO 80202", phones: ["1-555-678-5555", "1-555-678-6666"] },
  { id: 3, slug: "bavarian-experts", name: "Bavarian Experts", image: "/assets/images/pages/car-3.png", filledStars: 4, address: "3421 Harbor Avenue, Suite 12B, Long Beach, CA 90802", phones: ["1-555-678-3333", "1-555-678-4444"], },
  { id: 4, slug: "autoline-garage", name: "AutoLine Garage", image: "/assets/images/pages/car-4.png", filledStars: 4, address: "9102 Riverbend Parkway, Apartment 301, Miami, FL 33101", phones: ["1-555-678-2222", "1-555-678-2223"] },
  { id: 5, slug: "metro-carworks", name: "Metro CarWorks", image: "/assets/images/pages/car-5.png", filledStars: 4, address: "1250 Highland Street, Unit 204, Pasadena, CA 91104", phones: ["1-555-678-2222", "1-555-678-2223"] },
  { id: 6, slug: "prime-autolab", name: "Prime AutoLab", image: "/assets/images/pages/car-6.png", filledStars: 4, address: "4512 Grand Avenue, Floor 3, San Francisco, CA 94110", phones: ["1-555-678-2222", "1-555-678-2223"] },
  { id: 7, slug: "urban-motors", name: "Urban Motors", image: "/assets/images/pages/car-7.png", filledStars: 4, address: "2987 Sunset Road, Unit 117, Sacramento, CA 95818", phones: ["1-555-678-2222", "1-555-678-2223"] },
  { id: 8, slug: "titan-garage", name: "Titan Garage", image: "/assets/images/pages/car-8.png", filledStars: 4, address: "8840 Melrose Street, Suite 406, Beverly Hills, CA 90211", phones: ["1-555-678-2222", "1-555-678-2223"] },
];

// Dealer #3 ("Bavarian Experts") carries source's own static `.dealer-box.active` modifier — same
// permanently-"pre-hovered" CSS demo effect (border-color highlight) as `sale-agents.html`'s Bessie
// Cooper card, matching the identical `&.active, &:hover` SCSS rule shape.
export const ACTIVE_DEALER_SLUG = "bavarian-experts";
