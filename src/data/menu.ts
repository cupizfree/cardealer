// Site navigation. Mirrors the mega-menu actually found in the Aurexo header markup
// (../aurexo/listing-grid4-columns.html and sibling pages). Homepage sub-items only list
// Homepage 01-10 because that's what the source's own <nav> markup contains (home-11.html
// exists as a page but is not linked from this menu in the source either).

export type SimpleLink = {
  label: string;
  href: string;
};

export type HomeMenuItem = SimpleLink & {
  image: string;
};

export type ListingMenuColumn = {
  title: string;
  links: SimpleLink[];
};

export type PagesMenuColumn = {
  title?: string;
  links: SimpleLink[];
};

export const homeMenuItems: HomeMenuItem[] = [
  { label: "Homepage 01", href: "/", image: "/assets/images/home/home-1.jpg" },
  { label: "Homepage 02", href: "/home-02", image: "/assets/images/home/home-2.jpg" },
  { label: "Homepage 03", href: "/home-03", image: "/assets/images/home/home-3.jpg" },
  { label: "Homepage 04", href: "/home-04", image: "/assets/images/home/home-4.jpg" },
  { label: "Homepage 05", href: "/home-05", image: "/assets/images/home/home-5.jpg" },
  { label: "Homepage 06", href: "/home-06", image: "/assets/images/home/home-6.jpg" },
  { label: "Homepage 07", href: "/home-07", image: "/assets/images/home/home-7.jpg" },
  { label: "Homepage 08", href: "/home-08", image: "/assets/images/home/home-8.jpg" },
  { label: "Homepage 09", href: "/home-09", image: "/assets/images/home/home-9.jpg" },
  { label: "Homepage 10", href: "/home-10", image: "/assets/images/home/home-10.jpg" },
];

export const listingMenuColumns: ListingMenuColumn[] = [
  {
    title: "Listing Layout",
    links: [
      { label: "Grid Style 4 Columns", href: "/listing-grid4-columns" },
      { label: "Grid Style 3 Columns", href: "/listing-grid3-columns" },
      { label: "Grid Style 2 Columns", href: "/listing-grid2-columns" },
      { label: "Grid Style Half Map", href: "/listing-gridstyle-halfmap" },
      { label: "List Style Half Map", href: "/listing-liststyle-halfmap" },
      { label: "List Style Sidebar", href: "/listing-liststyle-sidebar" },
    ],
  },
  {
    title: "Features",
    links: [
      { label: "Listing Left Sidebar", href: "/listing-sidebar-left" },
      { label: "Listing Right Sidebar", href: "/listing-sidebar-right" },
      { label: "Listing Top Map", href: "/listing-topmap" },
      { label: "Listing Half Map", href: "/listing-liststyle-halfmap" },
      { label: "Listing Filter Canvas", href: "/listing-liststyle-halfmap?filterToggle=true" },
    ],
  },
  {
    title: "Listing Style",
    links: [
      { label: "Listing Grid", href: "/listing-grid4-columns" },
      { label: "Listing List", href: "/listing-liststyle-sidebar" },
    ],
  },
  {
    title: "Listing Details",
    links: [
      { label: "Listing Details 1", href: "/listing-details/2022-ford-mustang-gtd" },
      { label: "Listing Details 2", href: "/listing-details-2/2022-ford-mustang-gtd" },
      { label: "Listing Details 3", href: "/listing-details-3/2022-ford-mustang-gtd" },
      { label: "Listing Details 4", href: "/listing-details-4/2022-ford-mustang-gtd" },
      { label: "Listing Details 5", href: "/listing-details-5/2022-ford-mustang-gtd" },
      { label: "Listing Details 6", href: "/listing-details-6/2022-ford-mustang-gtd" },
    ],
  },
];

export const listingPromo = {
  image: "/assets/images/card/card-52.jpg",
  title: "Sell Your Car Simply",
  items: [
    "List in minutes with ease.",
    "Reach thousands of buyers instantly.",
    "Secure payment with loan assistance.",
  ],
  ctaLabel: "List Your Car Today!",
  ctaHref: "/sell-your-car",
};

export const newsMenuLinks: SimpleLink[] = [
  { label: "Blog Standard", href: "/blog-standard" },
  { label: "Blog List", href: "/blog-list" },
  { label: "Blog Grid 1", href: "/blog-grid-style-1" },
  { label: "Blog Grid 2", href: "/blog-grid-style-2" },
  { label: "Blog Grid 3", href: "/blog-grid-style-3" },
  { label: "Blog Details 1", href: "/blog-details-1/compact-suv-vs-full-size-suv" },
  { label: "Blog Details 2", href: "/blog-details-2/compact-suv-vs-full-size-suv" },
];

export const pagesMenuColumns: PagesMenuColumn[] = [
  {
    title: "Sale Agents",
    links: [
      { label: "Sale Agents List", href: "/sale-agents" },
      { label: "Sale Agents Detail", href: "/sale-agents-details/robert-fox" },
    ],
  },
  {
    title: "Dealer",
    links: [
      { label: "Dealer Listing", href: "/dealers-listing" },
      { label: "Dealer Detail", href: "/dealer-details/dynamic-drive-garage" },
    ],
  },
  {
    links: [
      { label: "Calculator", href: "/calculator" },
      { label: "Compare", href: "/compare" },
      { label: "Sell Your Car", href: "/sell-your-car" },
      { label: "Clients Reviews", href: "/clients-reviews" },
      { label: "Financing", href: "/financing" },
      { label: "Sevices Center", href: "/services-center" },
    ],
  },
  {
    title: "Shop",
    links: [
      { label: "Products", href: "/shop" },
      { label: "Product Details", href: "/product-details/fog-light-lamp-white-yellow-dual-colors" },
      { label: "Shopping Cart", href: "/shopping-cart" },
      { label: "Check Out", href: "/check-out" },
    ],
  },
  {
    links: [
      { label: "FAQs", href: "/faqs" },
      { label: "404 Error", href: "/404" },
      { label: "Coming Soon", href: "/coming-soon" },
      { label: "Terms of use", href: "/terms" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
];
