"use client";

import Image from "next/image";
import Link from "next/link";
import { useModal } from "@/components/common/ModalProvider";
import { TEAM_SOCIAL_LINKS } from "@/components/common/SocialIcons";

// Migrated from about-us.html lines 738-1034. Every card's name links to the SAME `#TeamModal`
// (source shows fixed "Rina Kusumawati" content regardless of which card was clicked — see
// TeamModal.tsx) — preserved verbatim, matching the identical precedent already established by
// `CardCompareModal` (one static modal, many identical triggers).
//
// The photo/card-top link, in source, goes to `sale-agents-details.html` (same literal file for all
// 4 cards). Since these 4 names/photos are exactly the first 4 records in `src/data/saleAgents.ts`
// (same photos, same names — sale-agents.html reuses this exact 4-person "cast" verbatim), each card
// now links to that real person's own `/sale-agents-details/[slug]` page instead of the no-longer-
// existent static route (see COMPONENT_MAP.md #37's follow-up) — a real destination instead of a dead
// link, not a new invented fact (`slug` here is just each name's already-established canonical slug).
const teamMembers = [
  { name: "Bagas Prasetyo", role: "Pendiri & Pemilik Showroom", photo: "/assets/images/pages/sale-agent-1.jpg", slug: "bagas-prasetyo" },
  { name: "Rina Kusumawati", role: "Kepala Operasional", photo: "/assets/images/pages/sale-agent-2.jpg", slug: "rina-kusumawati" },
  { name: "Dimas Nugroho", role: "Kepala Penjualan", photo: "/assets/images/pages/sale-agent-3.jpg", slug: "dimas-nugroho" },
  { name: "Ayu Lestari", role: "Kepala Keuangan", photo: "/assets/images/pages/sale-agent-4.jpg", slug: "ayu-lestari" },
];

export default function ExecutiveTeam() {
  const { openModal } = useModal();

  return (
    <section>
      <h2 className="mb-40 text-center">Tim Inti</h2>
      <div className="container">
        <div className="grid grid-cols-4 sm-grid-cols-1 lg-grid-cols-2 gap-30 xl-gap-16">
          {teamMembers.map((member) => (
            <div className="sale-agent-box" key={member.name}>
              <div className="card-top mb-20">
                <Link className="w-full flex" href={`/sale-agents-details/${member.slug}`}>
                  <Image className="w-full" src={member.photo} alt="sale-agent-1" width={495} height={495} />
                </Link>

                <ul className="sale-agent-social justify-center flex gap-12">
                  {TEAM_SOCIAL_LINKS.map(({ href, Icon }) => (
                    <li key={href}>
                      <a href={href} target="_blank" rel="noreferrer">
                        <Icon stroke="#fff" />
                      </a>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="card-bottom flex items-center justify-between gap-16">
                <div className="content">
                  <p
                    className="h5 font-weight-600 sale-agent-title open-modal cursor-pointer"
                    onClick={() => openModal("TeamModal")}
                  >
                    {member.name}
                  </p>
                  <p className="text-secondary text-sm">{member.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
