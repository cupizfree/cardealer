"use client";

// Katalog unit versi klien.
//
// Halaman publik adalah komponen server, jadi mereka membaca basis data lewat
// `src/lib/katalog.ts` dan menyerahkan hasilnya ke provider ini di layout akar.
// Komponen klien (karusel, tab, tabel banding) tidak boleh menyentuh `node:sqlite`,
// jadi mereka mengambil datanya dari sini.
//
// Nilai bawaan sengaja diisi data statis: kalau ada komponen yang dirender di luar
// provider (mis. di halaman uji), ia tetap tampil, bukan meledak.

import { createContext, useContext } from "react";
import { allListings as CADANGAN, type Listing } from "@/data/listings";

const KatalogContext = createContext<Listing[]>(CADANGAN);

export function KatalogProvider({
  listings,
  children,
}: {
  listings: Listing[];
  children: React.ReactNode;
}) {
  return <KatalogContext.Provider value={listings}>{children}</KatalogContext.Provider>;
}

/** Seluruh unit yang terbit. */
export function useKatalog(): Listing[] {
  return useContext(KatalogContext);
}

/** Satu unit berdasarkan id basis data. */
export function useListing(id: number): Listing | undefined {
  return useKatalog().find((l) => l.id === id);
}

/** Beberapa unit sekaligus, urutan permintaan dipertahankan, yang tidak ada dilewati. */
export function useListings(ids: number[]): Listing[] {
  const katalog = useKatalog();
  return ids
    .map((id) => katalog.find((l) => l.id === id))
    .filter((l): l is Listing => Boolean(l));
}
