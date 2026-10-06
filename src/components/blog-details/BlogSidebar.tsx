"use client";

import Image from "next/image";
import Link from "next/link";
import { FacebookIcon, XIcon, InstagramIcon, SkypeIcon, TelegramIcon } from "@/components/common/SocialIcons";

const CATEGORIES = [
  { label: "Perawatan Mobil", count: "22" },
  { label: "Car Buying Tips", count: "15" },
  { label: "Teknologi Mobil", count: "16" },
  { label: "Mobil Listrik & Hibrida", count: "08" },
  { label: "Mobil Mewah", count: "19" },
  { label: "Road Trips & Travel", count: "21" },
];

const TYPE_CAR = [
  { label: "Mobil Listrik", count: "22" },
  { label: "Mobil Sedan", count: "15" },
  { label: "Mobil SUV", count: "16" },
  { label: "Mobil Mewah", count: "08" },
  { label: "Mobil Hatchback", count: "19" },
  { label: "Mobil Crossover", count: "21" },
];

const RECENT_POSTS = [
  { slug: "top-5-tips-car-resale-value", image: "/assets/images/blog/post-25.jpg", date: "5 Agu 2025", category: "BERITA", title: "5 Tips Menjaga Nilai Jual Mobil Anda" },
  { slug: "rise-of-autonomous-vehicles", image: "/assets/images/blog/post-26.jpg", date: "21 Agu 2025", category: "ULASAN AHLI", title: "Bangkitnya Kendaraan Otonom: Apa yang Bisa Diharapkan" },
  { slug: "how-to-choose-best-tires", image: "/assets/images/blog/post-27.jpg", date: "Aug. 24, 2025", category: "TIPS", title: "Cara Memilih Ban Terbaik untuk Mobil Anda" },
  { slug: "hidden-costs-luxury-car", image: "/assets/images/blog/post-28.jpg", date: "Aug. 25, 2025", category: "TIPS", title: "Biaya Tersembunyi Memiliki Mobil Mewah" },
];

const TAGS = ["Performa", "Mewah", "Keselamatan", "Teknologi", "Perawatan", "Efisiensi Bahan Bakar", "Desain", "Ulasan", "Tren"];

// Migrated from ../aurexo/blog-details-1.html lines 719-1036. Search input, Categories/Type Car/Tags
// links (all dead `blog-standard.html`, not yet migrated), and the newsletter subscribe form are all
// UI_ONLY — no matching handler anywhere in source. "Artikel terbaru" cards (post-25..28) now link to each
// card's own real `/blog-details-1/[slug]` (ids 9-12 in `blogPosts.ts`) — per explicit user request that
// clicking a Recent Posts card show that card's own real content instead of always the same page. This
// deliberately departs from source's own literal `blog-details-2.html` href for this widget (a
// not-yet-migrated file, previously disclosed as a real cross-family reference) — the same class of
// override as the shopping-cart empty-state change. Author box's 5 social icons reuse
// `common/SocialIcons.tsx`'s `TEAM_SOCIAL_LINKS` set verbatim (byte-identical path data AND hrefs,
// confirmed via source diff) rather than re-transcribing a 4th copy of the same 5 icons.
export default function BlogSidebar() {
  return (
    <div className="innerpage__sidebar">
      <form action="#" className="widget-search w-full mb-34" onSubmit={(event) => event.preventDefault()}>
        <input className="input-normal" type="text" name="search-header" required id="search-header" placeholder="Cari produk..." />
        <button type="submit" className="widget-search-btn" aria-label="Cari">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M10.5 18C14.6421 18 18 14.6421 18 10.5C18 6.35786 14.6421 3 10.5 3C6.35786 3 3 6.35786 3 10.5C3 14.6421 6.35786 18 10.5 18Z" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            <path d="M15.8047 15.8047L21.0012 21.0012" stroke="#1C1C1C" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </button>
      </form>

      <div className="mb-32">
        <div className="listing-details--contact-dealer style-3 mb-20">
          <Image src="/assets/images/avatar/contact-avatar.png" alt="dealer" width={64} height={64} />
          <div className="content">
            <a href="#" className="h4 mb-8 font-weight-600" onClick={(event) => event.preventDefault()}>
              Bagas Prasetyo
            </a>
            <p className="text-secondary">200 Follower</p>
          </div>
        </div>

        <p className="mb-16">
          Bagas Prasetyo adalah penulis dan ilustrator. Ia penulis buku terlaris “Number of The Year”.
        </p>

        <ul className="blog-detail-social flex gap-12">
          <li>
            <a href="https://www.facebook.com/">
              <FacebookIcon stroke="#1C1C1C" />
            </a>
          </li>
          <li>
            <a href="https://x.com/">
              <XIcon stroke="#1C1C1C" />
            </a>
          </li>
          <li>
            <a href="https://www.instagram.com/">
              <InstagramIcon stroke="#1C1C1C" />
            </a>
          </li>
          <li>
            <a href="https://secure.skype.com">
              <SkypeIcon stroke="#1C1C1C" />
            </a>
          </li>
          <li>
            <a href="https://desktop.telegram.org">
              <TelegramIcon stroke="#1C1C1C" />
            </a>
          </li>
        </ul>
      </div>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-16">Kategori</p>
      <ul className="widget-categories mb-32">
        {CATEGORIES.map((category, index) => (
          <li key={category.label}>
            <Link href="/blog-standard" className={index === 0 ? "active" : undefined}>
              <span className="label">{category.label}</span>
              <span>({category.count})</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-16 capitalize">Artikel terbaru</p>
      <div className="mb-32">
        {RECENT_POSTS.map((post, index) => (
          <div key={post.title}>
            <Link href={`/blog-details-1/${post.slug}`} className="recent-post overflow-hidden mb-16">
              <div className="image">
                <Image className="post--img flex" src={post.image} alt="news" width={120} height={80} />
              </div>
              <div className="content">
                <div className="flex gap-12 md-gap-6 justify-start mb-6">
                  <span className="text-xs">oleh Admin</span>
                  <span className="text-xs">{post.date}</span>
                  <span className="text-xs text-highlight uppercase text-underline">{post.category}</span>
                </div>
                <p className="title h7">{post.title}</p>
              </div>
            </Link>
            {index < RECENT_POSTS.length - 1 && <div className="divider mb-16 w-full" />}
          </div>
        ))}
      </div>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-16">Tipe Mobil</p>
      <ul className="widget-categories mb-32">
        {TYPE_CAR.map((type, index) => (
          <li key={type.label}>
            <Link href="/blog-standard" className={index === 0 ? "active" : undefined}>
              <span className="label">{type.label}</span>
              <span>({type.count})</span>
            </Link>
          </li>
        ))}
      </ul>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-18">Langganan Buletin</p>
      <form action="#" className="widget-search w-full mb-34" onSubmit={(event) => event.preventDefault()}>
        <input className="input-normal" type="text" name="search-headerSubscribe" required id="search-headerSubscribe" placeholder="Alamat Email" />
        <button type="submit" className="widget-search-btn" aria-label="Berlangganan">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M21.3112 2.689C21.1226 2.5005 20.8871 2.36569 20.629 2.29846C20.371 2.23122 20.0997 2.234 19.843 2.3065H19.829L1.83461 7.7665C1.54248 7.85069 1.28283 8.02166 1.09007 8.25676C0.897302 8.49185 0.780525 8.77997 0.75521 9.08294C0.729895 9.3859 0.797238 9.6894 0.948314 9.95323C1.09939 10.2171 1.32707 10.4287 1.60117 10.5602L9.56242 14.4377L13.4343 22.3943C13.5547 22.6513 13.7462 22.8685 13.9861 23.0201C14.226 23.1718 14.5042 23.2517 14.788 23.2502C14.8312 23.2502 14.8743 23.2484 14.9174 23.2446C15.2201 23.2201 15.5081 23.1036 15.7427 22.9107C15.9773 22.7178 16.1473 22.4578 16.2299 22.1656L21.6862 4.17119C21.6862 4.1665 21.6862 4.16181 21.6862 4.15712C21.7596 3.90115 21.7636 3.63024 21.6977 3.37223C21.6318 3.11421 21.4984 2.8784 21.3112 2.689ZM14.7965 21.7362L14.7918 21.7493V21.7427L11.0362 14.0271L15.5362 9.52712C15.6709 9.38533 15.7449 9.19651 15.7424 9.00094C15.7399 8.80537 15.6611 8.61852 15.5228 8.48022C15.3845 8.34191 15.1976 8.26311 15.002 8.26061C14.8065 8.2581 14.6177 8.3321 14.4759 8.46681L9.97586 12.9668L2.25742 9.21119H2.25086H2.26399L20.2499 3.75025L14.7965 21.7362Z" fill="#1C1C1C" />
          </svg>
        </button>
      </form>

      <div className="divider mb-32 w-full" />

      <p className="h4 mb-16">Tag</p>
      <ul className="widget-tags">
        {TAGS.map((tag, index) => (
          <li key={tag}>
            <Link href="/blog-standard" className={index === 0 ? "active" : undefined}>
              {tag}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
