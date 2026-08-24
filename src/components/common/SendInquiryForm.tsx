"use client";

// Extracted out of `ListingDetailsSidebar` (the "Send Inquiry about Vehicle" box) once
// sale-agents-details.html needed the exact same form byte-identical to the listing-details pages'
// own (same field names/ids, same 3 subject options, same checkbox/disclaimer text — confirmed via
// direct source diff) — same "extract into shared files once a second feature needs it" precedent as
// `SocialIcons`/`Pagination`/`ReviewsSection`.
export default function SendInquiryForm({ id }: { id?: string }) {
  return (
    <div className="listing-details--sidebar-box" id={id}>
      <p className="h5 mb-16 capitalize">Send Inquiry about Vehicle</p>

      <form action="#" className="send-inquiry" onSubmit={(event) => event.preventDefault()}>
        <div className="grid grid-cols-1 gap-18 mb-8">
          <div>
            <p className="mb-8">Name</p>
            <input className="active input-large" id="SendInquiryname" name="SendInquiryname" type="text" defaultValue="Tony Nguyen" required />
          </div>
          <div>
            <p className="mb-8">Email</p>
            <input className="input-large" name="SendInquiryemail" id="SendInquiryemail" type="text" defaultValue="themesflat@gmail.com" required />
          </div>
          <div>
            <p className="mb-8">Phone</p>
            <input placeholder="Phone (optional)" className="input-large" name="SendInquiryphone" id="SendInquiryphone" type="tel" />
          </div>

          <div>
            <p className="mb-8">Subject</p>
            <select>
              <option>This Vehicle&apos;s Availability</option>
              <option>This Vehicle&apos;s Availability 2</option>
              <option>This Vehicle&apos;s Availability 3</option>
            </select>
          </div>

          <div className="padding-0">
            <p className="mb-6">Message</p>
            <textarea placeholder="Comment" rows={3} tabIndex={5} name="message2" className="message" id="message2" required />
          </div>
        </div>
        <button type="submit" className="btn btn-primary btn-large font-weight-600 w-full mb-18">
          Send Inquiry
        </button>
        <label className="filter-checkbox style-2 mb-6">
          <input type="checkbox" name="features" value="touch-screen" />
          <span className="text-sm">
            Yes, I would like to receive price alerts on this vehicle and helpful shopping information.
          </span>
        </label>

        <p className="text-xs text-secondary">
          By using this service, you accept our{" "}
          <a href="#" className="text-xs text-underline text-highlight">
            Visitor Agreement.
          </a>
        </p>
      </form>
    </div>
  );
}
