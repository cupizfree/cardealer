"use client";

import { useEffect, useState } from "react";
import AvatarPosterUpload from "./AvatarPosterUpload";
import ClearableInput from "./ClearableInput";
import DealerLocationSection from "@/components/common/DealerLocationSection";

// Migrated from ../aurexo/my-profile.html lines 578-807 (the `<form>`). Real, disclosed source content
// bugs preserved verbatim: "Sales Phone*" and "Company*" both carry the literal value
// "themesflat@gmail.com" (an email, not a phone number or company name — confirmed via source read, a
// copy-paste from "Alamat Email*" right next to them), and "Phone*"'s own value has literal extra
// internal spaces ("123  456  7890 "). "Jadi Showroom Rekanan" is source's own literal dead `href="#"`
// (confirmed via grep — no script touches it).
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
            <ClearableInput name="first_name" defaultValue="John" placeholder="Fist Name*" />
          </div>

          <div className="md-col-span-2 padding-0">
            <p className="mb-8 font-weight-600">Nama Belakang*</p>
            <ClearableInput name="last_name" defaultValue="Smith" placeholder="Nama Belakang*" />
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
              defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec rutrum arcu sit amet dolor aliquet, non fermentum quam ullamcorper. Nunc iaculis arcu sed interdum suscipit. Donec quis diam a sem sagittis consequat. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Curabitur a ligula magna. Maecenas nec est dignissim, molestie sem vel, tristique lacus. "
            />
          </div>
        </div>

        <div className="grid grid-cols-4 gap-20 mb-22 lg-grid-cols-2 md-grid-cols-1">
          <div>
            <p className="mb-8 font-weight-600">Phone*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="Telepon" id="Telepon" defaultValue="123  456  7890 " placeholder="Telepon" />
            </div>
          </div>

          <div>
            <p className="mb-8 font-weight-600">Sales Phone*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="SalesPhone" id="SalesPhone" defaultValue="themesflat@gmail.com" placeholder="Sales Phone*" />
            </div>
          </div>
          <div>
            <p className="mb-8 font-weight-600">Alamat Email*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="EmailAddress" id="EmailAddress" defaultValue="themesflat@gmail.com" placeholder="Alamat Email*" />
            </div>
          </div>
          <div>
            <p className="mb-8 font-weight-600">Company*</p>
            <div className="input-clear-wrapper">
              <input className="input-large" type="text" name="Company" id="Company" defaultValue="themesflat@gmail.com" placeholder="Company*" />
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
            <input type="date" name="DayofBirth" id="DayofBirth" defaultValue="1994-03-22" />
          </div>
        </div>
      </div>

      <div className="dashboard-box bg-white style-5 mb-40">
        <p className="h4 mb-20">Media Sosial</p>

        <div className="grid grid-cols-3 gap-32 mb-20 md-grid-cols-1">
          <ClearableInput
            name="Facebook"
            defaultValue="http://www.facebook.com/avitex"
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
