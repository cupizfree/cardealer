"use client";

import PasswordInput from "@/components/common/PasswordInput";
import { KONTAK } from "@/data/kontak";

// Migrated from ../aurexo/change-password.html lines 577-608.
//
// Nilai awal yang dulu ada di sini sudah dibuang: ketiga kolom kata sandi terisi sandi
// literal milik pembuat templat, dan kolom email terisi surel mereka. Repositori ini
// publik — sandi yang tertulis di HTML ikut terkirim ke setiap pengunjung. Confirmed no page-specific script beyond the
// shared dashboard-sidebar toggle (already handled by `(dashboard)/layout.tsx`) — "Ubah Kata Sandi" is
// UI_ONLY (no real validation anywhere, e.g. checking New/Retype match). Each password field's real
// show/hide eye-icon toggle is `PasswordInput` — see that component's own comment for why this was a
// genuine, previously-unwired site-wide gap found while migrating this page.
export default function ChangePasswordForm() {
  return (
    <form action="#" onSubmit={(event) => event.preventDefault()}>
      <div className="dashboard-box bg-white style-5">
        <div className="change-password-wrapper flex flex-col gap-23">
          <label htmlFor="Email">
            <span className="mb-8 flex font-weight-600">Your Email:*</span>
            <input className="input-large active" type="text" id="Email" name="Email" placeholder="Your Email*" required />
          </label>

          <label htmlFor="OldPassword">
            <span className="mb-8 flex font-weight-600">Old Password:*</span>
            <PasswordInput className="input-large" id="OldPassword" name="OldPassword" placeholder="Kata Sandi" required />
          </label>

          <label htmlFor="NewPassword">
            <span className="mb-8 flex font-weight-600">New password:*</span>
            <PasswordInput className="input-large" id="NewPassword" name="NewPassword" placeholder="Kata Sandi" required />
          </label>

          <label htmlFor="RetypeNewPassword">
            <span className="mb-8 flex font-weight-600">Retype new password:*</span>
            <PasswordInput className="input-large" id="RetypeNewPassword" name="RetypeNewPassword" placeholder="Kata Sandi" required />
          </label>

          <div className="flex">
            <button type="submit" className="btn btn-primary btn-large-3 font-weight-600">
              Ubah Kata Sandi
            </button>
          </div>
        </div>
      </div>
    </form>
  );
}
