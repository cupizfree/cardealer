"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Modal from "./Modal";
import { useModal } from "./ModalProvider";

// Modal ini dulu sisa templat: formulirnya tidak tersambung ke API mana pun dan
// menampilkan "Nama Pengguna: demo / Kata Sandi: demo". Siapa pun yang menekan
// tombol "Masuk" di situs publik akan mengisinya dan TIDAK PERNAH bisa masuk —
// padahal pintu panel yang sebenarnya ada di `/masuk`.
//
// Dua belas tempat memanggil `openModal("LoginModal")` (Header, HeaderStyle2,
// HeaderStyle4, DashboardHeader, LoginToReviewButton, FinancingHero). Semuanya
// diperbaiki sekaligus di sini: begitu modal dibuka, pengunjung dialihkan ke
// `/masuk`, jadi hanya ada SATU pintu masuk yang benar.
//
// PENTING: komponen ini ter-mount di layout akar pada SETIAP halaman, terbuka
// atau tidak. Karena itu pengalihan WAJIB dijaga `activeModal === "LoginModal"`.
// Tanpa penjaga itu, setiap halaman akan mengalihkan diri ke `/masuk`.
export default function LoginModal() {
  const router = useRouter();
  const { activeModal, closeModal } = useModal();

  useEffect(() => {
    if (activeModal !== "LoginModal") return;
    closeModal();
    router.push("/masuk");
  }, [activeModal, router, closeModal]);

  return (
    <Modal id="LoginModal" className="modal-login" contentClassName="modal-sm">
      <h2 className="mb-20 text-center">Mengalihkan…</h2>
      <p className="text-secondary mb-20 text-center">
        Mengantar Anda ke halaman masuk panel.
      </p>
      <button
        type="button"
        className="btn btn-primary btn-large w-full font-weight-600"
        onClick={() => router.push("/masuk")}
      >
        Buka halaman masuk
      </button>
    </Modal>
  );
}
