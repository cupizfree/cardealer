"use client";

import Image from "next/image";
import { useModal, type ModalId } from "./ModalProvider";

type ModalProps = {
  id: ModalId;
  className?: string;
  /** RETROACTIVE FIX: source's real size modifier (`modal-sm`/`modal-lg`) lives on `.modal-content`
   *  itself — `modal.scss`'s sizing rule is the compound selector `.modal-content.modal-sm { max-width:
   *  480px }` (base `.modal-content` is `max-width: 1450px`), so the class must sit on that exact
   *  element to match at all. `LoginModal`/`ForgotPasswordModal`/`SignUpModal` previously rendered a
   *  same-named but structurally different nested `<div className="modal-sm">` one level further in
   *  (inside `.modal-inner`), which the compound selector never matches — those 3 modals were silently
   *  stuck at the full 1450px width. `NewsletterModal` omitted its own real `modal-lg` entirely.
   *  `QuickViewModal` had the opposite bug: `modal-lg` was placed on the OUTER `.modal` div instead
   *  (confirmed via source diff, `shop.html`'s own `#QuickViewModal` markup). */
  contentClassName?: string;
  children: React.ReactNode;
};

// Generic shell for the `.modal` variants (Login/ForgotPassword/SignUp/Card/Compare) — matches
// Aurexo's `.modal > .bg-modal + .modal-content > button.close-modal + .modal-container` markup.
export default function Modal({ id, className, contentClassName, children }: ModalProps) {
  const { activeModal, closeModal } = useModal();
  const isOpen = activeModal === id;

  return (
    <div className={`modal${className ? ` ${className}` : ""}${isOpen ? " active" : ""}`}>
      <div className="bg-modal" onClick={closeModal} />
      <div className={`modal-content${contentClassName ? ` ${contentClassName}` : ""}`}>
        <button className="close-modal" onClick={closeModal} aria-label="Close">
          <Image src="/assets/icons/close-modal.svg" alt="close-modal" width={24} height={24} />
        </button>
        <div className="modal-container">
          <div className="modal-inner">{children}</div>
        </div>
      </div>
    </div>
  );
}
