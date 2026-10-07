"use client";

import { useEffect, useState } from "react";
import { KONTAK } from "@/data/kontak";
import AvatarPosterUpload from "./AvatarPosterUpload";
import ClearableInput from "./ClearableInput";
import DealerLocationSection from "@/components/common/DealerLocationSection";

// Migrated from ../aurexo/my-profile.html lines 578-807 (the `<form>`).
//
// Nilai awal contoh dari templat sudah dibuang — nama, telepon, surel, deskripsi, dan
// tanggal lahir karangan yang dulu terisi di kolom-kolom ini. Kolom kosong lebih jujur
// daripada kolom yang terisi data orang lain. "Jadi Showroom Rekanan" masih `href="#"`.
export default function ProfileForm() {
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    function handleOutsideClick(event: MouseEvent) {
      if (!(event.target as HTMLElement).closest(".filter-select-dropdown")) {
        setOpenDropdown(null);
      }
    }
    document.addEventListener("click", handleOutsideClick);
    return () => document.removeEventListener("click", handleOutsideClick);
  }, []);

  function toggleDropdown(name: string) {
    setOpenDropdown((current) => (current === name ? null : name));
  }

  return (
    <form action="#" onSubmit={(event) => event.preventDefault()}>
      <div className="dashboard-box bg-white style-5 mb-38">
        <p className="h4 mb-20">Jadi Rekanan</p>

        <p className="hightlight-text text-sm mb-20 text-primary">
          Tipe akun Anda saat ini masih biasa. Jika ingin menjadi showroom rekanan, klik tombol Jadi Rekanan
        </p>

        <div className="flex mb-40">
          <a href="#" className="btn btn-primary btn-large-3 font-weight-600" onClick={(event) => event.preventDefault()}>
            Jadi Showroom Rekanan
          </a>
        </div>

        <p className="h4 mb-20">Informasi</p>

        <AvatarPosterUpload />

        <div className="grid grid-cols-2 gap-20 mb-14">
          <div className="md-col-span-2 padding-0">
            <p className="mb-8 font-weight-600">Fist Name*</p>
            <ClearableInput name="first_name" placeholder="Fist Name*" />
          </div>

          <div className="md-col-span-2 padding-0">
            <p className="mb-8 font-weight-600">Nama Belakang*</p>
            <ClearableInput name="last_name" placeholder="Nama Belakang*" />
          </div>

          <div className="col-span-2 padding-0">
            <p className="mb-8 font-weight-600">Description*</p>
            <textarea
              placeholder="Pesan Anda*"
              rows={4}
              tabIndex={5}
              name="message"
              className="message textarea-primary text-secondary"
              id="message"
              required
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-20 mb-22 lg-grid-cols-2 md-grid-cols-1">
          <div>
            <p className="mb-8 font-weight-600">Phone*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="Telepon" id="Telepon" placeholder="Telepon" />
            </div>
          </div>

          <div>
            <p className="mb-8 font-weight-600">Sales Phone*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="SalesPhone" id="SalesPhone" placeholder="Sales Phone*" />
            </div>
          </div>
          <div>
            <p className="mb-8 font-weight-600">Alamat Email*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="EmailAddress" id="EmailAddress" placeholder="Alamat Email*" />
            </div>
          </div>
          <div>
            <p className="mb-8 font-weight-600">Company*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="Company" id="Company" placeholder="Company*" />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-20 md-grid-cols-1">
          <div>
            <p className="mb-8 font-weight-600">Gender*</p>
            <select name="Gender" id="Gender" defaultValue="Laki-laki">
              <option value="Laki-laki">Laki-laki</option>
              <option value="Perempuan">Perempuan</option>
            </select>
          </div>

          <div>
            <p className="mb-8 font-weight-600">Day of Birth*</p>
            <input type="date" name="DayofBirth" id="DayofBirth" />
          </div>
        </div>
      </div>

      <div className="dashboard-box bg-white style-5 mb-40">
        <p className="h4 mb-20">Media Sosial</p>

        <div className="grid grid-cols-3 gap-32 mb-20 md-grid-cols-1">
          <ClearableInput
            name="Facebook"
           
            placeholder="URL"
            prefixIconSrc="/assets/icons/input-facebook.svg"
            wrapperClassName="input-clear-wrapper input-social-wrapper"
          />
          <ClearableInput name="skype" placeholder="URL" prefixIconSrc="/assets/icons/input-skype.svg" wrapperClassName="input-clear-wrapper input-social-wrapper" />
          <ClearableInput name="xUrl" placeholder="URL" prefixIconSrc="/assets/icons/input-x.svg" wrapperClassName="input-clear-wrapper input-social-wrapper" />
        </div>

        <div className="grid grid-cols-3 gap-32 md-grid-cols-1">
          <ClearableInput name="telegram" placeholder="URL" prefixIconSrc="/assets/icons/input-telegram.svg" wrapperClassName="input-clear-wrapper input-social-wrapper" />
          <ClearableInput name="instagram" placeholder="URL" prefixIconSrc="/assets/icons/input-instagram.svg" wrapperClassName="input-clear-wrapper input-social-wrapper" />
          <ClearableInput name="youtube" placeholder="URL" prefixIconSrc="/assets/icons/input-youtube.svg" wrapperClassName="input-clear-wrapper input-social-wrapper" />
        </div>
      </div>

      <DealerLocationSection openDropdown={openDropdown} onToggleDropdown={toggleDropdown} />
    </form>
  );
}
