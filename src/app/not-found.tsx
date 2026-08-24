import Image from "next/image";
import Link from "next/link";

// Migrated from ../aurexo/404.html, using Next.js's built-in `not-found.tsx` convention (per
// docs/migration/MIGRATION_STATUS.md's own note) rather than a manual `/404` route — Next.js renders
// this automatically for any unmatched path and for explicit `notFound()` calls (already used by
// every dynamic `[slug]` route this project has built, e.g. sale-agents-details, dealer-details).
//
// Source's own 404.html has NO header/footer at all — it's a genuinely bare standalone document
// (`.error-page` is a `height: 100vh` centered flex layout, confirmed in
// assets/scss/inner-page.scss, consistent with there being no site chrome around it) — so this page
// intentionally omits `<Header>`/`<Footer>` too, matching that exactly. The root layout's own global
// mounts (Preloader, WowInit, modals, BackToTop) still wrap every page including this one, per
// Next.js's App Router architecture — there's no equivalent way to opt a single page out of the root
// layout without restructuring the whole route tree, which isn't warranted for a 404 page.
export default function NotFound() {
  return (
    <section className="error-page">
      <div className="container">
        <div className="error-page-inner">
          <div className="image">
            <Image src="/assets/images/pages/404.jpg" alt="404" width={1395} height={452} />
          </div>

          <div>
            <div className="content">
              <p className="title mb-55">oops!</p>

              <h2 className="mb-12">Something is Missing....</h2>
              <p className="mb-24">
                The page you are looking for cannot be found. take a break before trying again
              </p>

              <div className="flex">
                <Link href="/" className="btn btn-primary btn-large font-weight-600">
                  Back To Homepage
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
