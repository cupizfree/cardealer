"use client";

import Modal from "./Modal";
import { useModal } from "./ModalProvider";

// RETROACTIVE FIX (found while checking `LoginModal.tsx`'s own "modal-sm" bug on request): same issue
// here — `modal-sm` was a nested `<div>` inside `.modal-inner` instead of on `.modal-content` itself,
// so `modal.scss`'s `.modal-content.modal-sm { max-width: 480px }` never matched and this modal was
// silently stuck at the full 1450px width. Fixed via `Modal.tsx`'s new `contentClassName` prop.
export default function ForgotPasswordModal() {
  const { openModal } = useModal();

  return (
    <Modal id="ForgotPasswordModal" className="modal-login" contentClassName="modal-sm">
      <h2 className="mt-20 mb-20 text-center">Lupa Kata Sandi</h2>
      <form action="#">
        <label htmlFor="email-forgot-password" className="mb-20 px-2">
          <span className="mb-8 flex">Nama pengguna atau email *</span>
          <input
            className="input-large active"
            type="email"
            id="email-forgot-password"
            name="email-forgot-password"
            placeholder="Username or email address *"
            required
          />
        </label>

        <button type="submit" className="btn btn-primary btn-large w-full mb-12 font-weight-600">
          Minta Kode Reset
        </button>

        <p
          className="text-sm text-secondary flex gap-8 justify-center cursor-pointer"
          onClick={() => openModal("SignUpModal")}
        >
          Belum punya akun? <span className="text-sm font-weight-600 text-underline">Daftar</span>
        </p>
      </form>
    </Modal>
  );
}
