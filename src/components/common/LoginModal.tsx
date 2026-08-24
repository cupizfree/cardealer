"use client";

import Modal from "./Modal";
import { useModal } from "./ModalProvider";
import PasswordInput from "./PasswordInput";

// RETROACTIVE FIX (found on request, "check style of modal-login"): source's real `modal-sm` lives on
// `.modal-content` itself (`modal.scss`: `.modal-content.modal-sm { max-width: 480px }`, vs. the base
// `.modal-content`'s own `max-width: 1450px`). This previously rendered as a same-named but structurally
// different nested `<div className="modal-sm">` one level further in (inside `.modal-inner`), which
// that compound selector never matches — so this modal was silently stuck at the full 1450px width
// instead of the intended compact 480px login card. Fixed via `Modal.tsx`'s new `contentClassName` prop.
export default function LoginModal() {
  const { openModal } = useModal();

  return (
    <Modal id="LoginModal" className="modal-login" contentClassName="modal-sm">
      <h2 className="mb-20 text-center">Log In</h2>
      <form action="#">
        <div className="resutl mb-20">
          <p className="text-secondary mb-4">
            Username: <span className="font-weight-600 capitalize">demo</span>
          </p>
          <p className="text-secondary">
            Password: <span className="font-weight-600 capitalize">demo</span>
          </p>
        </div>

        <label htmlFor="email-login" className="mb-20 px-2">
          <span className="mb-8 flex">Email*</span>
          <input
            className="input-large active"
            defaultValue="themesflat@gmail.com"
            type="email"
            id="email-login"
            name="email-login"
            placeholder="Enter your email"
            required
          />
        </label>

        <label htmlFor="Password-login" className="mb-24 px-2">
          <span className="flex mb-8">Password*</span>
          {/* Real show/hide toggle — found missing here while migrating change-password.html, see
              `PasswordInput.tsx`'s own comment. */}
          <PasswordInput
            className="input-large active"
            id="Password-login"
            name="Password-login"
            placeholder="Password"
            required
          />
        </label>

        <div className="flex justify-between gap-12 mb-20">
          <label className="filter-checkbox style-5">
            <input type="checkbox" name="features" value="touch-screen" defaultChecked />
            <span className="text-sm">Remember me</span>
          </label>
          <span
            className="text-sm font-bold text-underline cursor-pointer"
            onClick={() => openModal("ForgotPasswordModal")}
          >
            Forgot Your Password?
          </span>
        </div>

        <button type="submit" className="btn btn-primary btn-large w-full mb-12 font-weight-600">
          Login
        </button>

        <p
          className="text-sm text-secondary flex gap-8 justify-center cursor-pointer"
          onClick={() => openModal("SignUpModal")}
        >
          Not registered yet? <span className="text-sm font-weight-600 text-underline">Sign Up</span>
        </p>
      </form>
    </Modal>
  );
}
