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
  | "VideoModal";

type ModalContextValue = {
  activeModal: ModalId | null;
  // `payload` carries whichever item triggered the open, for a modal whose chrome is static
  // but whose action must still resolve the actually-clicked record. `unknown` rather than a
  // specific type since Modal/ModalProvider stay generic.
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
