"use client";

import { useState } from "react";
import Link from "next/link";
import ListingCard from "@/components/listing/ListingCard";
import Pagination from "@/components/common/Pagination";
import { useWishlist } from "@/components/common/WishlistProvider";

const PER_PAGE = 6;

// Migrated from ../aurexo/my-favorites.html lines 579-1085. Per explicit request ("lấy data từ việc
// product heart active"), this no longer reproduces source's own static 6-card demo grid at all — it
// renders whatever real listings the user has actually favorited via a `ListingCard`/`HalfMapListingCard`
// heart click anywhere in the app (`WishlistProvider`), reusing `ListingCard` directly since it's the
// exact same `.card-box.card-box-style-1` shape source used here. Real, working pagination (standing
// rule) sized to the real wishlist count instead of source's decorative "1 2" markup — hidden entirely
// when everything fits on one page, same `{totalPages > 1 && <Pagination />}` convention used elsewhere.
export default function MyFavoritesGrid() {
  const { wishlistItems } = useWishlist();
  const [page, setPage] = useState(1);

  if (wishlistItems.length === 0) {
    return (
      <div className="dashboard-box bg-white style-4">
        <div className="compare-empty-state text-center">
          <p className="text-muted mb-20">You haven’t favorited any listings yet</p>
          <Link href="/listing-grid4-columns" className="btn btn-primary btn-large font-weight-600">
            Lihat Katalog
          </Link>
        </div>
      </div>
    );
  }

  const totalPages = Math.ceil(wishlistItems.length / PER_PAGE);
  const pageItems = wishlistItems.slice((page - 1) * PER_PAGE, page * PER_PAGE);

  return (
    <div className="dashboard-box bg-white style-4">
      <div className="grid grid-cols-3 lg-grid-cols-2 md-grid-cols-1 gap-x-23 gap-y-30 mb-30">
        {pageItems.map((listing) => (
          <ListingCard listing={listing} key={listing.id} />
        ))}
      </div>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </div>
  );
}
