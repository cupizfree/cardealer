"use client";

import { useState } from "react";
import Link from "next/link";
import FotoOrang from "@/components/common/FotoOrang";
import Pagination from "@/components/common/Pagination";
import { allSaleAgents } from "@/data/saleAgents";

// Migrated from ../aurexo/sale-agents.html lines 483-1241. Same `sale-agent-box` card shape as
// about-us.html's Executive Team, but: (1) the name + photo link to this agent's own
// `/sale-agents-details/[slug]` page (see #37 follow-up) — not an `open-modal` trigger, no TeamModal
// involved on this page; (2) each card additionally has a phone/email icon pair (`.contact`).
// In source both were literal `href="#"`. They now point at `/contact-us` and carry aria-labels:
// there is no per-agent phone or email anywhere in the data, and a `#` that does nothing is worse
// than a link that lands on the page where the showroom's real contact details live. (3) no `wow`
// classes anywhere on this page (confirmed via direct source search) — nothing to animate here.
//
// Consumes the shared `allSaleAgents` dataset (`src/data/saleAgents.ts`) instead of a locally
// hand-rolled list, so this list page and `/sale-agents-details/[slug]` stay a single source of truth
// — same "one shared dataset, not per-page copies" pattern as `allListings`.
//
// Pagination stays wired even though the roster is now one person: `totalPages > 1` is false, so the
// control simply doesn't render. Keeping the code means adding a second agent needs no change here.
const AGENTS_PER_PAGE = 8;

function PhoneIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M14.4563 3.60396C14.4753 3.53253 14.5082 3.46556 14.5532 3.40687C14.5981 3.34818 14.6542 3.29892 14.7182 3.26191C14.7822 3.22491 14.8529 3.20088 14.9261 3.19121C14.9994 3.18153 15.0739 3.1864 15.1453 3.20552C16.5039 3.55992 17.7435 4.27011 18.7363 5.26294C19.7292 6.25578 20.4394 7.49535 20.7938 8.85396C20.8129 8.92537 20.8178 8.99985 20.8081 9.07313C20.7984 9.14642 20.7744 9.21709 20.7374 9.28108C20.7004 9.34508 20.6511 9.40115 20.5924 9.4461C20.5337 9.49104 20.4668 9.52398 20.3953 9.54303C20.3479 9.55565 20.2991 9.56195 20.25 9.56177C20.1261 9.56185 20.0056 9.52099 19.9073 9.44555C19.8089 9.37011 19.7383 9.26431 19.7063 9.14459C19.402 7.97758 18.792 6.91281 17.9393 6.06002C17.0865 5.20724 16.0217 4.59728 14.8547 4.29302C14.7833 4.27398 14.7163 4.24104 14.6576 4.1961C14.5989 4.15115 14.5497 4.09508 14.5126 4.03108C14.4756 3.96709 14.4516 3.89642 14.4419 3.82313C14.4323 3.74985 14.4371 3.67537 14.4563 3.60396ZM14.1047 7.29303C15.4688 7.65677 16.3425 8.53053 16.7063 9.89459C16.7383 10.0143 16.8089 10.1201 16.9073 10.1956C17.0056 10.271 17.1261 10.3119 17.25 10.3118C17.2991 10.312 17.3479 10.3056 17.3953 10.293C17.4668 10.274 17.5337 10.241 17.5924 10.1961C17.6511 10.1512 17.7004 10.0951 17.7374 10.0311C17.7744 9.96709 17.7984 9.89642 17.8081 9.82313C17.8178 9.74985 17.8129 9.67537 17.7938 9.60396C17.325 7.8499 16.1494 6.67427 14.3953 6.20552C14.3239 6.18644 14.2494 6.18161 14.1762 6.19131C14.1029 6.201 14.0323 6.22504 13.9683 6.26203C13.839 6.33676 13.7448 6.45975 13.7063 6.60396C13.6677 6.74817 13.688 6.90179 13.7628 7.03101C13.8375 7.16024 13.9605 7.25449 14.1047 7.29303ZM21.5522 16.3868C21.3916 17.6123 20.7902 18.7374 19.8604 19.5518C18.9306 20.3661 17.736 20.8141 16.5 20.8118C9.15938 20.8118 3.18751 14.8399 3.18751 7.49927C3.18514 6.26369 3.63265 5.0695 4.44645 4.13976C5.26025 3.21003 6.38468 2.60834 7.6097 2.44709C7.89169 2.41282 8.1772 2.47096 8.42333 2.6128C8.66947 2.75463 8.86294 2.97248 8.9747 3.23365L10.9528 7.64927C11.0402 7.84917 11.0763 8.06769 11.058 8.28507C11.0396 8.50245 10.9674 8.71183 10.8478 8.89427C10.8358 8.91285 10.8226 8.93069 10.8084 8.94771L8.83313 11.2971C8.82114 11.3214 8.8149 11.3482 8.8149 11.3754C8.8149 11.4025 8.82114 11.4293 8.83313 11.4536C9.55126 12.9236 11.0925 14.4536 12.5831 15.1708C12.608 15.1822 12.6352 15.1876 12.6625 15.1866C12.6899 15.1856 12.7166 15.1783 12.7406 15.1652L15.0553 13.1965C15.0718 13.1821 15.0894 13.1689 15.1078 13.1571C15.2895 13.036 15.4984 12.9621 15.7158 12.9421C15.9332 12.9222 16.1522 12.9567 16.3528 13.0427L20.7816 15.0274C21.0393 15.1416 21.2533 15.3357 21.3921 15.5811C21.5309 15.8264 21.587 16.1099 21.5522 16.3896V16.3868ZM20.4375 16.248C20.4407 16.2088 20.4314 16.1696 20.411 16.136C20.3907 16.1023 20.3603 16.0759 20.3241 16.0605L15.8944 14.0758C15.8702 14.0665 15.8442 14.0625 15.8184 14.0641C15.7925 14.0657 15.7672 14.0729 15.7444 14.0852L13.4306 16.054C13.4138 16.068 13.3959 16.0811 13.3781 16.0933C13.1894 16.2192 12.9713 16.294 12.745 16.3104C12.5188 16.3268 12.2921 16.2844 12.0872 16.1871C10.3659 15.3555 8.65032 13.6558 7.81876 11.9505C7.72095 11.7468 7.67742 11.5212 7.69236 11.2957C7.70731 11.0702 7.78023 10.8524 7.90407 10.6633C7.91614 10.6445 7.92962 10.6267 7.94438 10.6099L9.91876 8.26052C9.93004 8.23597 9.93588 8.20927 9.93588 8.18224C9.93588 8.15522 9.93004 8.12852 9.91876 8.10396L7.94438 3.68459C7.93135 3.64912 7.90791 3.61841 7.87713 3.5965C7.84635 3.57458 7.80966 3.56248 7.77188 3.56177H7.75032C6.79683 3.68861 5.9221 4.15816 5.28947 4.88274C4.65685 5.60732 4.30958 6.53739 4.31251 7.49927C4.31251 14.2193 9.78001 19.6868 16.5 19.6868C17.462 19.6897 18.3922 19.3423 19.1168 18.7095C19.8414 18.0766 20.3109 17.2017 20.4375 16.248Z" fill="#1C1C1C" />
    </svg>
  );
}

function EmailIcon() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M21 4.6875H3C2.85082 4.6875 2.70774 4.74676 2.60225 4.85225C2.49676 4.95774 2.4375 5.10082 2.4375 5.25V18C2.4375 18.3481 2.57578 18.6819 2.82192 18.9281C3.06806 19.1742 3.4019 19.3125 3.75 19.3125H20.25C20.5981 19.3125 20.9319 19.1742 21.1781 18.9281C21.4242 18.6819 21.5625 18.3481 21.5625 18V5.25C21.5625 5.10082 21.5032 4.95774 21.3977 4.85225C21.2923 4.74676 21.1492 4.6875 21 4.6875ZM12 12.7369L4.44562 5.8125H19.5544L12 12.7369ZM9.53156 12L3.5625 17.4713V6.52875L9.53156 12ZM10.3641 12.7631L11.625 13.9144C11.7287 14.0092 11.8641 14.0619 12.0047 14.0619C12.1452 14.0619 12.2807 14.0092 12.3844 13.9144L13.6406 12.7631L19.5544 18.1875H4.44656L10.3641 12.7631ZM14.4684 12L20.4375 6.52875V17.4713L14.4684 12Z" fill="#1C1C1C" />
    </svg>
  );
}

export default function SaleAgentsSection() {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(allSaleAgents.length / AGENTS_PER_PAGE);
  const pageAgents = allSaleAgents.slice((page - 1) * AGENTS_PER_PAGE, page * AGENTS_PER_PAGE);

  return (
    <section className="pb-100">
      <div className="container">
        <h2>Tim Sales</h2>
      </div>
      <div className="tf-spacing-style3" />

      <div className="container mb-40">
        <div className="grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16">
          {pageAgents.map((agent) => (
            <div className={`sale-agent-box${agent.active ? " active" : ""}`} key={agent.id}>
              <div className="card-top mb-20">
                <Link className="w-full flex" href={`/sale-agents-details/${agent.slug}`}>
                  <FotoOrang nama={agent.name} foto={agent.photo} width={495} height={495} className="w-full" />
                </Link>
              </div>

              <div className="card-bottom flex items-center justify-between gap-16">
                <div className="content">
                  <Link className="h5 font-weight-600 sale-agent-title" href={`/sale-agents-details/${agent.slug}`}>
                    {agent.name}
                  </Link>
                  <p className="text-secondary text-sm">{agent.role}</p>
                </div>

                <ul className="contact">
                  <li>
                    <a href="/contact-us" aria-label={`Hubungi showroom tentang ${agent.name}`}>
                      <PhoneIcon />
                    </a>
                  </li>
                  <li>
                    <a href="/contact-us" aria-label={`Kirim pesan tentang ${agent.name}`}>
                      <EmailIcon />
                    </a>
                  </li>
                </ul>
              </div>
            </div>
          ))}
        </div>
      </div>

      {totalPages > 1 && <Pagination page={page} totalPages={totalPages} onPageChange={setPage} />}
    </section>
  );
}
