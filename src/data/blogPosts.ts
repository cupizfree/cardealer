// Canonical Aurexo blog post entity — "Blog family" per docs/migration/MIGRATION_STATUS.md. Built
// while migrating blog-details-1.html, the first blog page analyzed (blog-list.html/blog-standard.html/
// blog-grid-style-*.html haven't been migrated yet). Mirrors the same "one fully-analyzed record + real
// card-only stubs falling back to it" shape as `Listing`/`Product` (see `src/data/listings.ts` and
// `src/data/products.ts`): every blog card site-wide points at the literal same static
// `blog-details-1.html` file (confirmed via site-wide grep for `blog-details-1.html`) with no
// per-post identifier — the same "no working per-item route in source" situation those two families
// had — so `id`/`slug` here are synthetic, same convention as `Listing`/`Product`.
//
// Only id 1 (this page's own subject, "SUV Kompak vs. SUV Besar") has real detail-page content.
// Ids 2-4 are real card titles/images/dates/excerpts already captured from financing.html's
// `NewsTipsSection` (all 3 of its cards linked generically to `/blog-details-1` before this dataset
// existed) — not invented for this task. Notably, 2 of those 3 titles ("Truck vs. Minivan..."/
// "Tires: All-Season vs. Summer vs. Winter...") are the exact same titles blog-details-1.html's own
// Previous/Next navigation names — but that navigation's own `href` points at `blog-details-2.html`
// (not this dataset), a real source cross-reference disclosed in `BlogPostBody.tsx`'s own comment
// rather than silently rewired to point here instead.

export type BlogComment = {
  id: number;
  authorName: string;
  avatar?: string;
  timeAgo: string;
  text: string;
};

export type BlogPostSection = {
  heading: string;
  body: string;
};

export type BlogPost = {
  id: number;
  slug: string;
  title: string;
  category: string;
  date: string;
  author: string;
  cardImage: string;
  excerpt?: string;

  // Detail-only — populated ONLY where a detail page was actually analyzed (id 1 today).
  bannerImage?: string;
  bodyImage?: string;
  intro?: string;
  quote?: { text: string; author: string };
  introContinued?: string;
  sideImages?: [string, string];
  sections?: BlogPostSection[];
  conclusion?: BlogPostSection;
  tags?: string[];
  comments?: BlogComment[];
};

export type BlogPostCardData = Pick<BlogPost, "id" | "slug" | "title" | "category" | "date" | "author" | "cardImage" | "excerpt">;

export const allBlogPosts: BlogPost[] = [
  {
    id: 1,
    slug: "compact-suv-vs-full-size-suv",
    title: "Compact SUV vs. Full-Size SUV: What’s the Difference?",
    category: "PERFORMA",
    date: "Aug. 8, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/blog-details.jpg",
    bannerImage: "/assets/images/blog/blog-details.jpg",
    bodyImage: "/assets/images/blog/post-40.jpg",
    intro:
      "When choosing between a compact SUV and a full-size SUV, there are several key factors to consider. Understanding the differences between these two vehicle types can significantly impact your decision-making process, helping you find the one that best aligns with your lifestyle, driving habits, and needs.",
    quote: {
      text: "“Memilih SUV yang tepat bukan sekadar soal ukuran—tapi soal menemukan yang paling sesuai dengan gaya hidup, kebutuhan, dan petualangan Anda.”",
      author: "Nelson Mandela",
    },
    introContinued:
      "From the size and space they offer to their fuel efficiency, performance capabilities, and overall cost of ownership, each type of SUV caters to different priorities and preferences. By carefully weighing these aspects, you can make a more informed choice that not only meets your immediate requirements but also supports your long-term goals and lifestyle.",
    sideImages: ["/assets/images/blog/post-41.jpg", "/assets/images/blog/post-42.jpg"],
    sections: [
      {
        heading: "1. Size and Space",
        body: "Full-size SUVs offer more interior space, making them ideal for larger families or those who need more cargo capacity. On the other hand, compact SUVs are more maneuverable and easier to park, making them a great choice for urban driving.",
      },
      {
        heading: "2. Efisiensi Bahan Bakar",
        body: "Generally, compact SUVs tend to be more fuel-efficient compared to their full-size counterparts. If fuel economy is a priority for you, a compact SUV could save you money on gas over time.",
      },
      {
        heading: "3. Performance and Capability",
        body: "Full-size SUVs often come with more powerful engines and greater towing capacity, making them suitable for off-road adventures and heavy-duty hauling. Compact SUVs, while still capable, might not offer the same level of performance and capability as full-size models.",
      },
      {
        heading: "4. Cost",
        body: "Cost is another key differentiator. Full-size SUVs typically come with a higher price tag, both in terms of the purchase price and ongoing maintenance costs. Compact SUVs are generally more affordable, making them a budget-friendly option for many buyers.",
      },
    ],
    conclusion: {
      heading: "Conclusion",
      body: "Choosing between a compact SUV and a full-size SUV depends on your specific needs, whether that’s maximizing fuel efficiency, interior space, or performance. Understanding these differences can help you make a more informed decision that aligns with your lifestyle and budget.",
    },
    tags: ["Performance", "Mewah"],
    comments: [
      {
        id: 1,
        authorName: "Guy Hawkins",
        avatar: "/assets/images/blog/comments-post-1.jpg",
        timeAgo: "1 days ago",
        text: "Artikel bagus! Penjelasan perbedaan SUV kompak dan SUV besar sangat membantu keputusan saya.",
      },
      {
        id: 2,
        authorName: "Tony Nguyen",
        avatar: "/assets/images/blog/comments-post-2.jpg",
        timeAgo: "2 days ago",
        text: "Menarik! Saya sedang mencari saran memilih SUV yang tepat. Ada rekomendasi?",
      },
      {
        id: 3,
        authorName: "Andi Wijaya",
        avatar: "/assets/images/blog/comments-post-3.jpg",
        timeAgo: "3 days ago",
        text: "Senang artikelnya membantu! Memilih antara SUV kompak dan SUV besar berpengaruh pada kenyamanan.",
      },
    ],
  },
  {
    id: 2,
    slug: "luxury-suvs-vs-crossovers",
    title: "SUV Mewah vs. Crossover: Mana yang Tepat untuk Anda?",
    category: "PERAWATAN",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-32.jpg",
    excerpt:
      "Ketahui perbedaan SUV mewah dan crossover untuk menentukan jenis kendaraan yang paling sesuai dengan...",
  },
  {
    id: 3,
    slug: "truck-vs-minivan",
    title: "Pikap vs. Minibus: Mana yang Lebih Baik untuk Keluarga?",
    category: "BERITA",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-31.jpg",
    excerpt:
      "Bandingkan pikap dan minibus untuk membantu Anda menentukan kendaraan yang lebih cocok untuk transportasi keluarga...",
  },
  {
    id: 4,
    slug: "tires-all-season-vs-summer-vs-winter",
    title: "Ban: Segala Musim vs. Musim Panas vs. Musim Dingin – Yang Perlu Anda Tahu",
    category: "TIPS",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-23.jpg",
    excerpt:
      "Pelajari perbedaan ban segala musim, musim panas, dan musim dingin untuk memilih jenis ban terbaik untuk...",
  },
  // ids 5-8: real card titles/images/dates captured from blog-standard.html's own featured card + grid
  // (the page being migrated when these were added) — not invented. That page repeats 2 of its own
  // titles across 2 differently-imaged/categorized card instances each (a real, disclosed source
  // inconsistency preserved as literal per-occurrence data in `BlogStandardList.tsx` rather than
  // reconciled here); the single `cardImage`/`category`/`excerpt` below is each post's most complete or
  // most prominent real occurrence on that page.
  {
    id: 5,
    slug: "sports-cars-vs-luxury-cars",
    title: "Mobil Sport vs. Mobil Mewah: Menemukan yang Tepat untuk Anda",
    category: "MEWAH",
    date: "Aug. 11, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-18.jpg",
    excerpt:
      "Bandingkan kelebihan dan kekurangan mobil hibrida dan listrik untuk membantu Anda menentukan pilihan yang tepat...",
  },
  {
    id: 6,
    slug: "hybrid-vs-electric-cars",
    title: "Mobil Hibrida vs. Listrik: Mana yang Harus Anda Pilih?",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-44.jpg",
    excerpt:
      "Bandingkan kelebihan dan kekurangan mobil hibrida dan listrik untuk membantu Anda menentukan pilihan yang tepat...",
  },
  {
    id: 7,
    slug: "diesel-vs-gasoline-engines",
    title: "Diesel vs. Bensin: Kelebihan dan Kekurangannya",
    category: "PERFORMA",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-22.jpg",
    excerpt:
      "Ketahui perbedaan SUV kompak dan SUV besar, termasuk ruang, efisiensi bahan bakar, dan fitur...",
  },
  {
    id: 8,
    slug: "manual-vs-automatic-transmission",
    title: "Manual vs. Matic: Mana yang Lebih Baik untuk Anda?",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-23.jpg",
    excerpt:
      "Bandingkan kelebihan dan kekurangan mobil hibrida dan listrik untuk membantu Anda menentukan pilihan yang tepat...",
  },
  // ids 9-12: real card titles/images/dates for the "Artikel terbaru" sidebar widget (post-25..28), shared
  // verbatim by `blog-details/BlogSidebar.tsx` and `blog-standard/BlogStandardSidebar.tsx`. Originally
  // left un-sluggified as decorative filler (both sidebars just pointed every card at one existing real
  // slug), but the user explicitly asked for clicking a Recent Posts card to show that card's own real
  // content — added here so each of the 4 gets its own resolvable page (falling back to id 1's real
  // body/quote/sections/comments, same pattern as every other stub). No `excerpt` — this widget's own
  // card markup never shows one in source, only title/date/category.
  {
    id: 9,
    slug: "top-5-tips-car-resale-value",
    title: "5 Tips Menjaga Nilai Jual Mobil Anda",
    category: "BERITA",
    date: "5 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-25.jpg",
  },
  {
    id: 10,
    slug: "rise-of-autonomous-vehicles",
    title: "Bangkitnya Kendaraan Otonom: Apa yang Bisa Diharapkan",
    category: "ULASAN AHLI",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-26.jpg",
  },
  {
    id: 11,
    slug: "how-to-choose-best-tires",
    title: "Cara Memilih Ban Terbaik untuk Mobil Anda",
    category: "TIPS",
    date: "Aug. 24, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-27.jpg",
  },
  {
    id: 12,
    slug: "hidden-costs-luxury-car",
    title: "Hidden Costs of Owning a Luxury Car",
    category: "TIPS",
    date: "Aug. 25, 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-28.jpg",
  },
  // id 13: `RelatedArticles`' (blog-details-1.html) 3 swiper slides all share this exact literal title in
  // source (confirmed via direct read) — a single repeated placeholder, not 3 distinct articles — so
  // unlike ids 9-12 this gets only ONE new entry, using the first slide's real image/category as the
  // canonical values; all 3 slides link to this same slug rather than 3 needlessly-identical ones.
  {
    id: 13,
    slug: "2025-bmw-5-series-priced",
    title: "BMW Seri 5 2025 Dibanderol Mulai Rp 950 Juta; i5 EV Mulai Rp 1,1 Miliar",
    category: "Ulasan Ahli",
    date: "5 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-4.jpg",
  },
  // id 14: blog-grid-style-1.html's own 9-card grid — 8 of its 9 titles already exactly match existing
  // entries (ids 1/2/3/4/5/6/7/8, confirmed via source read), further validating those as this site's
  // recurring set of "template" articles. Only this one title is genuinely new.
  {
    id: 14,
    slug: "electric-vs-ice-cars",
    title: "Mobil Listrik vs. Mesin Bensin (ICE)",
    category: "TREN",
    date: "21 Agu 2025",
    author: "Admin",
    cardImage: "/assets/images/blog/post-24.jpg",
    excerpt:
      "Bandingkan mobil listrik (EV) dengan mobil mesin pembakaran biasa (ICE) untuk memahami...",
  },
];

export type BlogPostWithDetail = BlogPost &
  Required<Pick<BlogPost, "bannerImage" | "bodyImage" | "intro" | "quote" | "introContinued" | "sideImages" | "sections" | "conclusion" | "tags" | "comments">>;

// Mirrors `withDetailFallback`/`withProductDetailFallback` exactly: only id 1 has real detail-page
// fields today; every other post falls back to that same template's real, source-derived values for
// the fields it doesn't have — never fabricated fresh data.
export function withBlogPostDetailFallback(post: BlogPost): BlogPostWithDetail {
  const template = allBlogPosts[0];
  return {
    ...post,
    bannerImage: post.bannerImage ?? post.cardImage,
    bodyImage: post.bodyImage ?? template.bodyImage!,
    intro: post.intro ?? template.intro!,
    quote: post.quote ?? template.quote!,
    introContinued: post.introContinued ?? template.introContinued!,
    sideImages: post.sideImages ?? template.sideImages!,
    sections: post.sections ?? template.sections!,
    conclusion: post.conclusion ?? template.conclusion!,
    tags: post.tags ?? template.tags!,
    comments: post.comments ?? template.comments!,
  };
}
