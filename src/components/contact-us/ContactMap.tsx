// Migrated from ../aurexo/contact-us.html lines 457-465. A static Google Maps `<iframe>` embed
// (same "no interactive JS map library pulled in" call as AgentSidebar/DealerSidebar's own maps,
// Package Principle) — full-bleed at `max-w-1920`, the only section on this page before the header
// ends and the info+form grid begins.
export default function ContactMap() {
  return (
    <section className="bg-white">
      <div className="max-w-1920 mx-auto w-full">
        <div className="widget-gg-map flex radius-8 overflow-hidden">
          <iframe
            src="https://www.google.com/maps/embed?pb=!1m14!1m12!1m3!1d97101.88872869895!2d-74.22688511715344!3d40.487336736141906!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!5e0!3m2!1svi!2s!4v1689125037376!5m2!1svi!2s"
            height={520}
            style={{ border: 0, width: "100%" }}
            allowFullScreen
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>
      </div>
    </section>
  );
}
