// Canonical Aurexo shop product entity — "Shop family" per docs/migration/MIGRATION_STATUS.md, a
// separate mini-system from car listings (see src/data/listings.ts for that one). Modeled on the same
// "one fully-analyzed record + card-only stubs falling back to it" shape as `Listing`/`allListings`/
// `withDetailFallback`, built while migrating product-details.html — the only shop page analyzed so
// far. shop.html itself (the product grid) has 9 cards total but hasn't been migrated yet; only the 4
// real "Produk Terkait" cards from product-details.html are captured here as stubs. A future
// shop.html migration should extend `allProducts`, not re-derive its own dataset.
//
// Every product/shop link in source (shop.html's grid AND this page's own "Produk Terkait" carousel)
// points at the literal same static `product-details.html` file, with no per-product identifier at
// all — the exact same "no working per-item route in source" situation `Listing`/`listing-details-1..6`
// had. `id`/`slug` here are therefore synthetic, assigned by us (slug derived from title, kebab-case).

export type ProductPromotion = {
  text: string; // "-32%" | "New" — badge shown on shop/related-product cards
  colorClass: string; // "bg-primary" | "bg-highlight uppercase", mirrors source markup
};

export type ProductSpecItem = {
  label: string;
  value: string;
};

export type ProductGalleryImage = {
  src: string;
  alt: string;
};

export type ProductRatingDistribution = {
  stars: 1 | 2 | 3 | 4 | 5;
  percent: number;
};

export type ProductRatingSummary = {
  average: number;
  count: number;
  distribution: ProductRatingDistribution[];
};

export type ProductReview = {
  id: number;
  authorName: string;
  authorAvatar?: string;
  authorInitials?: string;
  date: string;
  rating: number;
  title: string;
  text: string;
};

// "Deskripsi" tab content — source's own copy here is entirely about a SHIRT (button-up sleeves,
// LENZING™ ECOVERO™ Viscose fabric, Babaton embroidered crest), completely unrelated to this or any
// other car-parts product. Generic leftover e-commerce template copy, never customized — preserved
// verbatim, not rewritten to match the product.
export type ProductDescriptionTab = {
  intro: string;
  features: string[];
  materialsContent: string[];
  careInstructions: string[];
};

// "Shipping & Returns" tab content — source shows a generic Privacy Policy here instead (another
// mismatched-tab-content quirk, same treatment: preserved verbatim).
export type ProductPolicyTab = {
  heading: string;
  paragraphs: string[];
};

// shop.html's product grid is NOT the static 9-card markup in source — that markup is a dead no-JS
// fallback, unconditionally replaced at load by `shop.js`'s `loadProductsFromJson()`, which fetches
// `fake_data/product.json` (the real, authoritative 9-product dataset, with real `category`/`branding`
// fields the static fallback doesn't have at all) and re-renders `#product-list` from it. Confirmed via
// full trace of `shop.js`: the JSON has NO `oldPrice` field whatsoever and only 2 of 9 products carry a
// non-empty `promotion` string — so the real rendered shop.html shows fewer promo badges/no old-price
// strikethroughs at all compared to what the inert fallback markup displays. This `shop` field carries
// that JSON-accurate truth for the shop grid specifically; it's kept SEPARATE from this same Product's
// top-level `promotion`/`oldPrice` fields because those instead reflect product-details.html's own
// "Produk Terkait" carousel — genuinely static markup on THAT page (no `#product-list` id there, so
// `loadProductsFromJson()` never touches it) — meaning the exact same conceptual product legitimately
// renders two different real promo states on its two real host pages. Not reconciled; both are real.
export type ProductShopMeta = {
  category: string;
  branding: string;
  promotion?: ProductPromotion;
};

export type Product = {
  id: number;
  slug: string;

  // Card + detail shared core — populated for all 5 records.
  title: string;
  image: string;
  price: string;
  oldPrice?: string;
  promotion?: ProductPromotion;

  // Detail-only — populated ONLY where a detail page was actually analyzed (id 1 today).
  breadcrumbLabel?: string; // set ONLY for id 1: source's own breadcrumb literally says
  // "Wheel/Rim for Passenger & CUV" while the page's actual h3/gallery/specs are all about a
  // "Fog Light Lamp" — a real, disclosed source content mismatch, not corrected. Notably, product id 5
  // in this same dataset IS actually titled "Wheel/Rim for Passenger & CUV" — strong circumstantial
  // evidence the breadcrumb was meant for that card, not this page's real content. Left as two
  // separate, unreconciled records, exactly as found.
  discountLabel?: string; // "-25%" shown next to the old price on the detail page itself
  addToCartLabel?: string; // the Add-to-Cart button's own literal price text ("$79.99") — a THIRD,
  // different price on the same page vs. the displayed "$90.00"/"$128.99" — confirmed via `shop.js`
  // that the real price actually added to the cart is parsed from the displayed `.price` element, not
  // this button label, so this label is genuinely decorative/wrong text, preserved as-is.
  soldCount?: string;
  shortDescription?: string;
  specs?: ProductSpecItem[];
  sku?: string;
  availability?: string;
  categories?: string[];
  gallery?: ProductGalleryImage[];
  descriptionTab?: ProductDescriptionTab;
  shippingTab?: ProductPolicyTab;
  ratingSummary?: ProductRatingSummary;
  reviews?: ProductReview[];

  // Real, shop.html-specific truth (see `ProductShopMeta`'s own comment) — present on every product
  // that actually appears in `fake_data/product.json` (ids 2-10; id 1, "Fog Light Lamp...", is a
  // detail-page-only demo product with no shop-grid card of its own).
  shop?: ProductShopMeta;
};

export type ProductCardData = Pick<Product, "id" | "slug" | "title" | "image" | "price" | "oldPrice" | "promotion">;

export const allProducts: Product[] = [
  {
    id: 1,
    slug: "fog-light-lamp-white-yellow-dual-colors",
    title: "Fog Light Lamp White/Yellow Dual Colors",
    breadcrumbLabel: "Wheel/Rim for Passenger & CUV",
    image: "/assets/images/shop/product-10.jpg",
    price: "$90.00",
    oldPrice: "$128.99",
    discountLabel: "-25%",
    addToCartLabel: "$79.99",
    soldCount: "18 terjual dalam 32 jam terakhir",
    shortDescription:
      "Hanya untuk Audi Q3 versi Eropa, tidak cocok untuk versi Amerika. Lampu belakang pengganti untuk Audi Q3 2016 2017 2018.",
    specs: [
      { label: "Warna", value: "Sisi kiri (pengemudi)" },
      { label: "Peruntukan", value: "Lampu rem ketiga" },
      { label: "Sumber Cahaya", value: "Halogen" },
    ],
    sku: "4321234",
    availability: "Tersedia",
    categories: ["tools", "wheel"],
    // Source's own gallery is broken: all 4 main-swiper slides show the identical `product-10.jpg`
    // while the 4 thumbnails show product-10/11/12/13.jpg (only thumb 1 actually matches a main
    // slide). Same call as `DetailsGalleryWithThumbs`'s own precedent: render ONE real image set for
    // both sliders so thumb-click-to-main-slide syncing (real, load-bearing behavior) genuinely works,
    // rather than reproducing the decorative broken pairing.
    gallery: [
      { src: "/assets/images/shop/product-10.jpg", alt: "Fog Light Lamp White/Yellow Dual Colors" },
      { src: "/assets/images/shop/product-11.jpg", alt: "Fog Light Lamp White/Yellow Dual Colors" },
      { src: "/assets/images/shop/product-12.jpg", alt: "Fog Light Lamp White/Yellow Dual Colors" },
      { src: "/assets/images/shop/product-13.jpg", alt: "Fog Light Lamp White/Yellow Dual Colors" },
    ],
    descriptionTab: {
      intro:
        "Lampu kabut dengan performa terang dan tahan lama, dirancang untuk meningkatkan visibilitas saat berkendara malam atau cuaca buruk. Rumah lampu tahan air dan tahan panas, dibuat dari bahan berkualitas yang tahan lama.",
      features: [
        "Kabel dan soket konektor lengkap",
        "Braket pemasangan tahan karat",
        "Tahan air dan tahan panas",
      ],
      materialsContent: ["Bahan: plastik ABS dan kaca tempered", "Perawatan: bersihkan dengan kain lembap", "Produksi lokal"],
      careInstructions: [
        "Bersihkan dengan kain lembut dan air sabun.",
        "Jangan gunakan bahan kimia keras.",
        "Jangan direndam dalam waktu lama.",
        "Jangan dibongkar paksa.",
        "Keringkan dengan lap bersih.",
      ],
    },
    shippingTab: {
      heading: "Kebijakan Privasi MARF",
      paragraphs: [
        "MARF beserta seluruh anak perusahaan dan afiliasinya yang mengelola situs ini (“kami”) memahami bahwa Anda peduli bagaimana informasi Anda digunakan dan dibagikan. Kebijakan Privasi ini kami buat untuk menjelaskan informasi apa yang kami kumpulkan di situs ini, bagaimana kami menggunakannya, serta pilihan yang Anda miliki atas cara informasi tersebut dikumpulkan dan digunakan. Mohon baca Kebijakan Privasi ini dengan saksama. Penggunaan Anda atas situs ini menandakan bahwa Anda telah membaca dan menerima praktik privasi kami sebagaimana diuraikan di sini.",
        "Perlu diketahui bahwa praktik dalam Kebijakan Privasi ini berlaku atas informasi yang kami kumpulkan, baik oleh kami maupun anak perusahaan, afiliasi, atau agen kami: (i) melalui situs ini, (ii) bila berlaku, melalui Layanan Pelanggan kami terkait situs ini, (iii) melalui informasi yang Anda berikan di gerai kami, dan (iv) melalui informasi yang diberikan dalam rangka promosi pemasaran dan undian.",
        "Kami tidak bertanggung jawab atas konten atau praktik privasi pada situs lain.",
        "Kami berhak, atas kebijakan kami sendiri, mengubah, memperbarui, menambah, menghentikan, menghapus, atau mengganti sebagian maupun seluruh Kebijakan Privasi ini kapan saja. Bila kami mengubahnya, kami akan memperbarui tanggal “terakhir diperbarui” di bagian atas Kebijakan Privasi ini.",
        "Jika Anda memberikan informasi kepada kami atau mengakses serta menggunakan situs ini setelah Kebijakan Privasi diubah, Anda dianggap telah menyetujui perubahan tersebut tanpa syarat. Versi terbaru Kebijakan Privasi ini tersedia di situs dan menggantikan seluruh versi sebelumnya.",
        "Jika Anda memiliki pertanyaan mengenai Kebijakan Privasi ini, silakan hubungi Layanan Pelanggan kami melalui email di marf.showroom@gmail.com",
      ],
    },
    ratingSummary: {
      average: 4.8,
      count: 1968,
      distribution: [
        { stars: 5, percent: 60 },
        { stars: 4, percent: 20 },
        { stars: 3, percent: 10 },
        { stars: 2, percent: 7 },
        { stars: 1, percent: 3 },
      ],
    },
    reviews: [
      {
        id: 1,
        authorName: "Randynox",
        authorAvatar: "/assets/images/avatar/coment-avatar-1.png",
        date: "August 13, 2025",
        rating: 5,
        title: "Mobil sangat mudah dikendarai dan nyaman",
        text: "Dibeli baru tahun 2005. Masih dipakai sampai 270.000 km. Beberapa kali perbaikan, tapi wajar.",
      },
      {
        id: 2,
        authorName: "Mista Nyroom",
        authorInitials: "MN",
        date: "August 22, 2025",
        rating: 5,
        title: "Love of my life",
        text: "Dimiliki 9 tahun sebagai pemilik kedua. Hanya servis dasar seperti filter oli. Terpaksa dijual setelah kecelakaan.",
      },
      // Source's own 3rd comment is a near-exact duplicate of the 2nd (same name/date/rating/title/
      // text) — the only differences are a real avatar image instead of "MN" initials, and this is the
      // one carrying the `#reviewForm` anchor id. A genuine copy-paste demo artifact, preserved as-is.
      {
        id: 3,
        authorName: "Mista Nyroom",
        authorAvatar: "/assets/images/avatar/coment-avatar-2.png",
        date: "August 22, 2025",
        rating: 5,
        title: "Love of my life",
        text: "Dimiliki 9 tahun sebagai pemilik kedua. Hanya servis dasar seperti filter oli. Terpaksa dijual setelah kecelakaan.",
      },
    ],
  },
  {
    id: 2,
    slug: "shadow-blackout-coating",
    title: "Shadow Blackout Coating",
    image: "/assets/images/shop/product-1.jpg",
    price: "$68.00",
    shop: { category: "car-accessories", branding: "pro-series" },
  },
  {
    id: 3,
    slug: "3500-lb-xl-winch-kit",
    title: "3500-lb. XL Winch Kit",
    image: "/assets/images/shop/product-2.jpg",
    price: "$68.00",
    // Top-level oldPrice/promotion below are product-details.html's own real (static) display —
    // shop.html's real JSON-driven display has no old price for this product at all (see `shop` field).
    oldPrice: "$98.00",
    promotion: { text: "-32%", colorClass: "bg-primary" },
    shop: { category: "tools", branding: "monroe", promotion: { text: "-32%", colorClass: "bg-primary" } },
  },
  {
    id: 4,
    slug: "stanley-roof-top-universal",
    title: "Stanley Roof Top Universal",
    image: "/assets/images/shop/product-3.jpg",
    price: "$68.00",
    // Top-level promotion below is product-details.html's own real (static) display — shop.html's
    // real JSON-driven display shows NO promo badge at all for this product (empty in product.json).
    promotion: { text: "New", colorClass: "bg-highlight uppercase" },
    shop: { category: "car-accessories", branding: "fram" },
  },
  {
    id: 5,
    slug: "wheel-rim-for-passenger-cuv",
    title: "Wheel/Rim for Passenger & CUV",
    image: "/assets/images/shop/product-4.jpg",
    price: "$68.00",
    // Same real cross-page divergence as id 4 above: shop.html shows no promo badge for this one.
    promotion: { text: "New", colorClass: "bg-highlight uppercase" },
    shop: { category: "car-accessories", branding: "pro-series" },
  },
  // ids 6-10: shop.html-exclusive products (from `fake_data/product.json`) with no
  // product-details.html "Produk Terkait" appearance, hence no top-level promotion/oldPrice.
  {
    id: 6,
    slug: "motomaster-power-inverter",
    title: "MotoMaster Power Inverter",
    image: "/assets/images/shop/product-5.jpg",
    price: "$199.99",
    shop: { category: "engine-oil", branding: "penzoil" },
  },
  {
    id: 7,
    slug: "dewalt-dcgg571m2-18v",
    title: "Dewalt DCGG571M2 18v",
    image: "/assets/images/shop/product-6.jpg",
    price: "$249.00",
    shop: { category: "tools", branding: "fram" },
  },
  {
    id: 8,
    slug: "maximum-40v-max-battery",
    title: "Maximum 40V MAX Battery",
    image: "/assets/images/shop/product-7.jpg",
    price: "$159.00",
    shop: { category: "car-battery", branding: "monroe", promotion: { text: "-32%", colorClass: "bg-primary" } },
  },
  {
    id: 9,
    slug: "motomaster-20v-grease-gun",
    title: "MotoMaster 20V Grease Gun",
    image: "/assets/images/shop/product-8.jpg",
    price: "$339.99",
    shop: { category: "care-care", branding: "pro-series" },
  },
  {
    id: 10,
    slug: "paquete-de-2-llantas-205-70-r16",
    title: "Paquete De 2 Llantas 205/70 R16",
    image: "/assets/images/shop/product-9.jpg",
    price: "$5,983",
    shop: { category: "breake-system", branding: "fram" },
  },
];

export function getShopProducts(): Product[] {
  return allProducts.filter((p) => p.shop);
}

export function getRelatedProducts(product: Product, count = 4): Product[] {
  return allProducts.filter((p) => p.id !== product.id).slice(0, count);
}

export type ProductWithDetail = Product &
  Required<
    Pick<
      Product,
      "specs" | "sku" | "availability" | "categories" | "gallery" | "descriptionTab" | "shippingTab" | "ratingSummary" | "reviews"
    >
  >;

// Mirrors `withDetailFallback` in `src/data/listings.ts` exactly: only product id 1 has real
// detail-page fields today, every other product falls back to that same template's real,
// source-derived values for the fields it doesn't have — never fabricated fresh data.
export function withProductDetailFallback(product: Product): ProductWithDetail {
  const template = allProducts[0];
  return {
    ...product,
    specs: product.specs ?? template.specs!,
    sku: product.sku ?? template.sku!,
    availability: product.availability ?? template.availability!,
    categories: product.categories ?? template.categories!,
    // Fallback gallery reuses the template's own thumbnail set (product-11/12/13.jpg) for slides 2-4,
    // swapping only slide 1 for this product's own real card photo — so a shop product's detail page
    // opens on ITS real image, not the unrelated Fog Light Lamp, while still showing a full 4-slide
    // gallery instead of collapsing to a single image.
    gallery: product.gallery ?? [
      { src: product.image, alt: product.title },
      ...template.gallery!.slice(1),
    ],
    descriptionTab: product.descriptionTab ?? template.descriptionTab!,
    shippingTab: product.shippingTab ?? template.shippingTab!,
    ratingSummary: product.ratingSummary ?? template.ratingSummary!,
    reviews: product.reviews ?? template.reviews!,
  };
}

export function parsePrice(price: string): number {
  return Number(price.replace(/[^0-9.]/g, "")) || 0;
}
