// Footer content. Structurally identical across Aurexo pages (see docs/migration/AUREXO_SOURCE.md §6);
// this is the copy found in ../aurexo/listing-grid4-columns.html.

export type FooterLink = {
  label: string;
  href: string;
};

export type FooterColumn = {
  title: string;
  links: FooterLink[];
};

export const footerOpeningHours = {
  line1: "Monday–Friday from 8 AM to 8 PM",
  line2: "Saturday from 9 AM to 6 PM EST",
};

export const footerColumns: FooterColumn[] = [
  {
    title: "QUICK LINKS",
    links: [
      { label: "About Us", href: "/about-us" },
      { label: "Buying a car", href: "/listing-grid4-columns" },
      { label: "Selling a car", href: "/sell-your-car" },
      { label: "Investor Relations", href: "/about-us" },
      { label: "Careers", href: "/about-us" },
      { label: "News", href: "/blog-standard" },
      { label: "Contact Us", href: "/contact-us" },
    ],
  },
  {
    title: "BUYING & SELLING",
    links: [
      { label: "Financing", href: "/financing" },
      { label: "Find a Car", href: "/listing-grid4-columns" },
      { label: "Find a Dealer", href: "/sale-agents" },
      { label: "Listings by City", href: "/listing-liststyle-halfmap" },
      { label: "Certified Pre-Owned", href: "/listing-grid4-columns" },
      { label: "Car Payment Calculators", href: "/calculator" },
      { label: "Car Reviews & Ratings", href: "/clients-reviews" },
    ],
  },
];

export const footerContact = {
  phone: "1-866-288-6868",
  phoneHref: "tel:1-866-288-6868",
  address: "6205 Peachtree Dunwoody Rd, Atlanta, GA 30328",
  mapHref: "https://www.google.com/maps?q=123Yarranst,Punchbowl,NSW2196,Australia",
};

export type SocialLink = { name: string; href: string };

export const footerSocialLinks: SocialLink[] = [
  { name: "facebook", href: "https://www.facebook.com/" },
  { name: "x", href: "https://x.com/" },
  { name: "instagram", href: "https://www.instagram.com/" },
  { name: "tiktok", href: "https://www.tiktok.com/" },
  { name: "amazon", href: "https://www.amazon.com/" },
  { name: "pinterest", href: "https://www.pinterest.com" },
];

export const footerBottomLinks: FooterLink[] = [
  { label: "Terms Of Services", href: "/terms" },
  { label: "Privacy Policy", href: "/terms" },
  { label: "Cookie Policy", href: "/terms" },
];
