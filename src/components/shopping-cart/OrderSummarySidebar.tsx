"use client";

import Link from "next/link";
import { useCart } from "@/components/common/CartProvider";

// Migrated from ../aurexo/shopping-cart.html lines 646-704. Traced `updateShoppingCartSubtotal()` in
// full: it only ever updates the row whose first `<span>` text is literally "Subtotal" — Discounts and
// Total are never touched by any script, so they stay the exact static strings source hardcodes
// ("-$8.00", "$186,99") regardless of what's actually in the cart, even once Subtotal itself goes real.
// Reproduced with that same split: Subtotal is always real (a genuinely empty cart shows real $0.00,
// not source's static "$80.00" — that number only ever made sense alongside the 3 static fallback rows
// `ShoppingCartSection` no longer renders, per explicit user request; showing it next to an empty
// product list would just be a second, self-inflicted inconsistency). Discounts and Total stay
// permanently static. Shipping radio group has no matching handler either (never recomputes
// Total/Shipping cost) — a plain native radio group needs no React state to look right.
export default function OrderSummarySidebar() {
  const { subtotal } = useCart();
  const subtotalDisplay = `$${subtotal.toFixed(2)}`;

  return (
    <div className="innerpage__sidebar">
      <div className="listing-details--sidebar-box">
        <p className="h4 mb-20 capitalize">Ringkasan Pesanan</p>

        <form action="#" className="send-inquiry" onSubmit={(event) => event.preventDefault()}>
          <p className="flex justify-between gap-8 mb-18">
            <span className="font-weight-600">Subtotal</span>
            <span className="font-weight-600">{subtotalDisplay}</span>
          </p>

          <div className="divider mb-20" />

          <p className="flex justify-between gap-8 mb-20">
            <span className="font-weight-600">Diskon</span>
            <span className="font-weight-600">-$8.00</span>
          </p>

          <div className="divider mb-20" />

          <div className="flex justify-between gap-8 mb-20">
            <span className="font-weight-600">Pengiriman</span>
            <div className="filter-radio-group flex-col">
              <label className="filter-radio-style-2 flex">
                <input type="radio" name="payment" value="0" defaultChecked />
                <span className="label-focus w-full flex">
                  <span className="flex gap-8 w-full justify-between">
                    <span>Gratis Pengiriman:</span> $0.00
                  </span>
                </span>
              </label>
              <label className="filter-radio-style-2">
                <input type="radio" name="payment" value="35" />
                <span className="label-focus w-full flex">
                  <span className="flex gap-8 w-full justify-between">
                    <span>Lokal:</span> $35.00
                  </span>
                </span>
              </label>
              <label className="filter-radio-style-2 flex">
                <input type="radio" name="payment" value="35" />
                <span className="label-focus w-full flex">
                  <span className="flex gap-8 w-full justify-between">
                    <span>Tarif Tetap:</span> $35.00
                  </span>
                </span>
              </label>
            </div>
          </div>

          <div className="divider mb-20" />

          <div className="flex justify-between gap-8 mb-20">
            <p className="h4 font-weight-600">Total</p>
            <p className="h4 font-weight-600">$186,99</p>
          </div>

          <Link href="/check-out" className="btn btn-primary btn-large font-weight-600 w-full mb-12">
            Lanjut ke Checkout
          </Link>
          <Link href="/check-out" className="text-underline text-center block">
            Atau lanjut belanja
          </Link>
        </form>
      </div>
    </div>
  );
}
