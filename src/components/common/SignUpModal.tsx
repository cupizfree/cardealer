"use client";

import Image from "next/image";
import Modal from "./Modal";
import { useModal } from "./ModalProvider";
import PasswordInput from "./PasswordInput";

// RETROACTIVE FIX (found while checking `LoginModal.tsx`'s own "modal-sm" bug on request): same issue
// here — `modal-sm` was a nested `<div>` inside `.modal-inner` instead of on `.modal-content` itself,
// so `modal.scss`'s `.modal-content.modal-sm { max-width: 480px }` never matched and this modal was
// silently stuck at the full 1450px width. Fixed via `Modal.tsx`'s new `contentClassName` prop.
export default function SignUpModal() {
  const { openModal } = useModal();

  return (
    <Modal id="SignUpModal" className="modal-login" contentClassName="modal-sm">
      <h2 className="mb-20 text-center">Daftar</h2>
      <form action="#">
        <label htmlFor="SignUp-login" className="mb-20 px-2">
          <span className="mb-8 flex">Email*</span>
          <input
            className="input-large active"
            defaultValue="themesflat@gmail.com"
            type="email"
            id="SignUp-login"
            name="SignUp-login"
            placeholder="Masukkan email Anda"
            required
          />
        </label>

        <label htmlFor="Password-SignUp" className="mb-24 px-2">
          <span className="mb-8 flex">Kata Sandi*</span>
          {/* Real show/hide toggle — found missing here while migrating change-password.html, see
              `PasswordInput.tsx`'s own comment. */}
          <PasswordInput
            className="input-large active"
            id="Password-SignUp"
            name="Password-SignUp"
            placeholder="Kata Sandi"
            required
          />
        </label>
        <label htmlFor="ConfirmPassword-SignUp" className="mb-20 px-2">
          <span className="mb-8 flex">Ulangi Kata Sandi*</span>
          <PasswordInput
            className="input-large active"
            id="ConfirmPassword-SignUp"
            name="ConfirmPassword-SignUp"
            placeholder="Kata Sandi"
            required
          />
        </label>

        <div className="flex justify-between gap-12 mb-20">
          <label className="filter-checkbox style-5">
            <input type="checkbox" name="features" value="touch-screen" defaultChecked />
            <span className="text-sm">
              Saya setuju dengan{" "}
              <a href="/terms" className="text-underline font-bold text-sm pl-4">
                {" "}
                Syarat Pengguna
              </a>
            </span>
          </label>
        </div>

        <button type="submit" className="btn btn-primary btn-large w-full mb-12 font-weight-600">
          Buat akun baru
        </button>

        <p className="text-sm text-secondary flex gap-8 justify-center mb-20">
          Sudah punya akun?{" "}
          <span
            className="text-sm font-weight-600 text-underline cursor-pointer"
            onClick={() => openModal("LoginModal")}
          >
            Masuk di sini
          </span>
        </p>

        <div className="flex justify-center items-center gap-20 mb-20">
          <p className="text-sm divider w-full" />
          <p className="text-sm text-secondary text-center min-w-max">atau daftar dengan</p>
          <p className="text-sm divider w-full" />
        </div>

        <div className="flex flex-col gap-12 social-login">
          <a href="/dashboard" className="font-weight-500 flex items-center gap-8">
            <Image src="/assets/icons/facebook.svg" alt="google" width={20} height={20} />
            Facebook
          </a>
          <a href="/dashboard" className="font-weight-500 flex items-center gap-8">
            <Image src="/assets/icons/Google.svg" alt="google" width={20} height={20} />
            Google
          </a>
          <a href="/dashboard" className="font-weight-500 flex items-center gap-8">
            <Image src="/assets/icons/Twitter.svg" alt="google" width={20} height={20} />
            X
          </a>
        </div>
      </form>
    </Modal>
  );
}
