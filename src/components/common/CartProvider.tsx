"use client";

// Migrated from `assets/js/shop.js`'s localStorage-backed cart (`getCartItems`/`saveCartItems`/
// `addCartItem`/`updateSubtotal`) — traced in full and confirmed genuinely real (unlike compare.html's
// entirely decorative demo): the "Add to cart" button on product-details.html actually resolves the
// clicked product's real name/image/price and pushes/merges it into a real item list, and the modal's
// subtotal is a real computed sum, not a static string. Reproduced as a React Context (same
// "small shared Context for a cross-tree UI need" precedent as `ModalProvider`/`CompareProvider`),
// scoped to what product-details.html's own page actually needs — the full `shop.js` file (1200+
// lines: shop.html's own grid-from-JSON rendering, a wishlist/favorites system, the dedicated
// shopping-cart.html page's own quantity editing) is out of scope for this page and belongs to those
// pages' own future migrations.
//
// DOES persist to `localStorage` (same key source uses, `shopping_cart_items`) — found missing while
// building shopping-cart.html: Playwright caught that a hard navigation to `/shopping-cart` (not a
// same-session client-side `<Link>` transition) lost an item added moments earlier on `/shop`, since
// pure in-memory Context state doesn't survive a real page reload the way source's actual localStorage
// does. Hydrates once on mount (client-only, so SSR/first-paint still renders the empty/fallback state
// with no hydration mismatch) and writes back on every change thereafter.
import { createContext, useCallback, useContext, useEffect, useState } from "react";

const CART_STORAGE_KEY = "shopping_cart_items";

export type CartItem = {
  id: string;
  name: string;
  image: string;
  price: number;
  quantity: number;
};

type CartContextValue = {
  items: CartItem[];
  subtotal: number;
  addToCart: (item: { name: string; image: string; price: number }, quantity?: number) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  // A ref flipped inside the hydration effect wouldn't work here: refs are a single mutable box shared
  // across renders, so the persistence effect below (running in the SAME commit, right after the
  // hydration effect) would already see it as `true` while still closing over the STALE pre-hydration
  // `items` — briefly overwriting real stored data with `[]` before a following render corrects it.
  // State avoids that: this effect's `isHydrated` and `items` are always read from the same render.
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    try {
      const raw = window.localStorage.getItem(CART_STORAGE_KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {
      // Malformed or unavailable storage (private browsing, etc.) — start from an empty cart.
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    try {
      window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch {
      // Storage unavailable — cart still works for the current tab, just won't persist.
    }
  }, [items, isHydrated]);

  // Mirrors `addCartItem`'s exact merge rule: same name+price+image increments quantity instead of
  // adding a second line item; anything else is a new line.
  const addToCart = useCallback((item: { name: string; image: string; price: number }, quantity = 1) => {
    setItems((current) => {
      const existing = current.find((i) => i.name === item.name && i.price === item.price && i.image === item.image);
      if (existing) {
        return current.map((i) => (i.id === existing.id ? { ...i, quantity: i.quantity + quantity } : i));
      }
      return [...current, { id: `item-${Date.now()}-${Math.round(Math.random() * 1e6)}`, ...item, quantity }];
    });
  }, []);

  const removeFromCart = useCallback((id: string) => {
    setItems((current) => current.filter((i) => i.id !== id));
  }, []);

  // Mirrors `updateCartItemQuantity`: dropping to 0 (or below) removes the line entirely, matching
  // shopping-cart.html's own quantity-selector behavior (its `min="0"` input, not `min="1"` like
  // product-details.html/shop.html's own selectors).
  const updateQuantity = useCallback((id: string, quantity: number) => {
    setItems((current) =>
      quantity <= 0 ? current.filter((i) => i.id !== id) : current.map((i) => (i.id === id ? { ...i, quantity } : i))
    );
  }, []);

  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider value={{ items, subtotal, addToCart, removeFromCart, updateQuantity }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
