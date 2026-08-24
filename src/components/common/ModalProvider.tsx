"use client";

// Aurexo's static markup drives every modal (#LoginModal, #SearchModal, ...) through a single
// jQuery `data-modal-id` opener in app.js (openModal(), see docs/migration/AUREXO_SOURCE.md §5).
// Trigger buttons live in genuinely separate component subtrees (Header, listing cards, forms),
// so a small shared Context is the minimal honest equivalent in React — neither reference project's
// "avoid Context" finding rules this out; Luminor simply never had a cross-tree UI need like this one.
import { createContext, useCallback, useContext, useState } from "react";

export type ModalId =
  | "LoginModal"
  | "ForgotPasswordModal"
  | "SignUpModal"
  | "SearchModal"
  | "CompareModal"
  | "CardModal"
  | "TeamModal"
  | "NewsletterModal"
  | "ShoppingCartModal"
  | "QuickViewModal"
  | "VideoModal";

type ModalContextValue = {
  activeModal: ModalId | null;
  // `payload` carries whichever product/item triggered the open — needed by `QuickViewModal`, whose
  // own displayed content is static in source (always "Fog Light Lamp...") but whose real "Add to
  // Cart" action must still resolve the actually-clicked product's real name/image/price (traced in
  // full via `shop.js`'s `getProductDataFromCard`/modal `.data()` stash — see that component's own
  // header comment). `unknown` rather than a specific type since Modal/ModalProvider stay generic.
  modalPayload: unknown;
  openModal: (id: ModalId, payload?: unknown) => void;
  closeModal: () => void;
};

const ModalContext = createContext<ModalContextValue | null>(null);

export function ModalProvider({ children }: { children: React.ReactNode }) {
  const [activeModal, setActiveModal] = useState<ModalId | null>(null);
  const [modalPayload, setModalPayload] = useState<unknown>(null);

  const openModal = useCallback((id: ModalId, payload?: unknown) => {
    setActiveModal(id);
    setModalPayload(payload ?? null);
  }, []);
  const closeModal = useCallback(() => setActiveModal(null), []);

  return (
    <ModalContext.Provider value={{ activeModal, modalPayload, openModal, closeModal }}>
      {children}
    </ModalContext.Provider>
  );
}

export function useModal() {
  const ctx = useContext(ModalContext);
  if (!ctx) throw new Error("useModal must be used within a ModalProvider");
  return ctx;
}
