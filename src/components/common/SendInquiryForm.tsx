"use client";

// Extracted out of `ListingDetailsSidebar` (the "Kirim Pertanyaan tentang Unit" box) once
// sale-agents-details.html needed the exact same form byte-identical to the listing-details pages'
// own (same field names/ids, same 3 subject options, same checkbox/disclaimer text — confirmed via
// direct source diff) — same "extract into shared files once a second feature needs it" precedent as
// `SocialIcons`/`Pagination`/`ReviewsSection`.
export default function SendInquiryForm({ id }: { id?: string }) {
  return (
    <div className="listing-details--sidebar-box" id={id}>
      <p className="h5 mb-16 capitalize">Kirim Pertanyaan tentang Unit</p>

      <form action="#" className="send-inquiry" onSubmit={(event) => event.preventDefault()}>
        <div className="grid grid-cols-1 gap-18 mb-8">
          <div>
            <p className="mb-8">Nama</p>
            <input className="active input-large" id="SendInquiryname" name="SendInquiryname" type="text" defaultValue="Tony Nguyen" required />
          </div>
          <div>
            <p className="mb-8">Email</p>
            <input className="input-large" name="SendInquiryemail" id="SendInquiryemail" type="text" defaultValue="themesflat@gmail.com" required />
          </div>
          <div>
            <p className="mb-8">Telepon</p>
            <input placeholder="Telepon (opsional)" className="input-large" name="SendInquiryphone" id="SendInquiryphone" type="tel" />
          </div>

          <div>
            <p className="mb-8">Subjek</p>
            <select>
              <option>Ketersediaan Mobil Ini</option>
              <option>Ketersediaan Mobil Ini 2</option>
              <option>Ketersediaan Mobil Ini 3</option>
            </select>
          </div>

          <div className="padding-0">
            <p className="mb-6">Pesan</p>
            <textarea placeholder="Komentar" rows={3} tabIndex={5} name="message2" className="message" id="message2" required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-large font-weight-600 w-full mb-18">
          Kirim Pertanyaan
        </button>
        <label className="filter-checkbox style-2 mb-6">
          <input type="checkbox" name="features" value="touch-screen" />
          <span className="text-sm">
            Ya, saya ingin menerima notifikasi harga untuk mobil ini dan informasi belanja yang berguna.
          </span>
        </label>

        <p className="text-xs text-secondary">
          Dengan menggunakan layanan ini, Anda menyetujui{" "}
          <a href="#" className="text-xs text-underline text-highlight">
            Perjanjian Pengguna.
          </a>
        </p>
      </form>
    </div>
  );
}
