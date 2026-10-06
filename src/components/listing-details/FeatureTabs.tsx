"use client";

import { useState } from "react";
import Image from "next/image";
import type { FeatureCategory, ListingFeatures } from "@/data/listings";

// Kunci internal (`kunci`) sengaja tetap bahasa Inggris: kunci itu dipakai sebagai
// nama kolom di JSON `fitur` pada basis data dan dibandingkan di
// `active === kunci`. Menerjemahkan kuncinya akan membuat data yang sudah
// tersimpan tidak lagi cocok — persis jebakan `ProductTabs.tsx` dulu (tab yang
// tidak akan pernah aktif). Jadi yang diterjemahkan hanya `label` yang terlihat.
const KATEGORI: Array<{ kunci: FeatureCategory; label: string }> = [
  { kunci: "Exterior", label: "Eksterior" },
  { kunci: "Interior", label: "Interior" },
  { kunci: "Safety", label: "Keselamatan" },
  { kunci: "Mechanical", label: "Mekanis" },
  { kunci: "Technology", label: "Teknologi" },
  { kunci: "Other", label: "Lainnya" },
];

// Source repeats the identical 12-item checklist under all 6 tabs (see LISTING_DATA_MAP.md) — the
// tab *structure* is real, the per-category content differentiation simply doesn't exist yet.
// listing-details-2.html defaults to the "Interior" tab instead of "Exterior" (confirmed via direct
// source read — both the tab's `active` class and the matching `content-inner active` block sit on
// Interior there) — the canonical `features` content itself is unchanged/shared, only which tab
// opens first differs, hence `defaultActive` rather than a second dataset.
export default function FeatureTabs({
  features,
  defaultActive = "Exterior",
}: {
  features: ListingFeatures;
  defaultActive?: FeatureCategory;
}) {
  // Hanya tampilkan kategori yang benar-benar punya isi. Dulu keenam tab selalu
  // tampil meski isinya sama persis (satu daftar 12 item diulang enam kali),
  // jadi tab kosong tidak pernah kelihatan. Sekarang tiap unit punya isinya
  // sendiri per kategori, dan kategori yang belum diisi akan jadi panel kosong
  // kalau tidak disaring di sini.
  const tampil = KATEGORI.filter(({ kunci }) => (features[kunci] ?? []).length > 0);

  const awal = tampil.some((k) => k.kunci === defaultActive)
    ? defaultActive
    : (tampil[0]?.kunci ?? defaultActive);

  const [active, setActive] = useState<FeatureCategory>(awal);

  // Unit yang belum diisi sama sekali tidak menampilkan blok fitur — lebih baik
  // tidak ada bagian daripada bagian yang kosong melompong.
  if (tampil.length === 0) return null;

  return (
    <div className="flat-tabs mb-40">
      <div className="overflow-x-auto mb-16">
        <ul className="menu-tab menu-tab-style4">
          {tampil.map(({ kunci, label }) => (
            <li key={kunci} className={active === kunci ? "active" : undefined}>
              <span className="text-secondary font-weight-600" onClick={() => setActive(kunci)}>
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>

      <div className="content-tab">
        {tampil.map(({ kunci }) => (
          <div
            key={kunci}
            className={`content-inner ${active === kunci ? "active" : ""}`}
          >
            <ul className="grid grid-cols-3 xl-grid-cols-2 md-grid-cols-1 gap-8 gap-x-30">
              {(features[kunci] ?? []).map((item) => (
                <li className="flex items-center gap-8" key={item}>
                  <Image src="/assets/icons/check.svg" alt="check" width={16} height={16} />
                  {item}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
