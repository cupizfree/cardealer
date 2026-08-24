import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Header from "@/components/header/Header";
import Footer from "@/components/footer/Footer";
import AgentProfile from "@/components/sale-agents-details/AgentProfile";
import AgentSidebar from "@/components/sale-agents-details/AgentSidebar";
import { allSaleAgents } from "@/data/saleAgents";

export function generateStaticParams() {
  return allSaleAgents.map((agent) => ({ slug: agent.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const agent = allSaleAgents.find((a) => a.slug === slug);
  return {
    title: agent ? `${agent.name} | Aurexo` : "Sale Agent Details | Aurexo",
    description: "Aurexo - Car Dealer, Rental & Listing",
  };
}

// Migrated from ../aurexo/sale-agents-details.html. Was originally built as a single static route
// (every one of sale-agents.html's 8 cards links to the exact same literal `sale-agents-details.html`
// file in source, no per-agent id anywhere — see COMPONENT_MAP.md #37) that always showed one fixed
// agent's content regardless of which card was clicked.
//
// This route now pulls each agent's OWN name/role/photo (the fields sale-agents.html's own 8 cards
// already vary — see `src/data/saleAgents.ts`) into this shared template per the explicit follow-up
// request ("cần lấy content theo item team để đổ vào single"). A useful side effect: source's own
// name mismatch on this page (breadcrumb said "Mike Hanley", the heading+bio said "Darrell Steward")
// is naturally resolved, since both now come from the same `agent.name` field instead of two
// hand-transcribed literal strings.
//
// The bio paragraphs, "Dealer Inventory" cards, and Customer Reviews stay the ONE generic shared
// block every agent shows (source only ever wrote this content once, for whichever agent's card
// happened to link here) — not rewritten per agent, since there is no real per-agent bio/inventory/
// review data anywhere in source to pull instead. Rewriting the bio's own sentences to insert each
// agent's name would mean guessing pronouns/gender for names the source never assigned a gender to —
// treated as fabrication, so left as shared/generic content instead, consistent with `AgentProfile`'s
// own header comment.
export default async function SaleAgentsDetailsPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = allSaleAgents.find((a) => a.slug === slug);
  if (!agent) notFound();

  return (
    <>
      <Header />

      <section className="background-light">
        <div className="container">
          <ul className="breadcrumb">
            <li>
              <Link href="/">Home</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/">Pages</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <Link href="/sale-agents">Sale Agents</Link>
            </li>
            <li>
              <Image src="/assets/icons/right.svg" alt="chevron-right" width={16} height={16} />
            </li>
            <li>
              <span>{agent.name}</span>
            </li>
          </ul>
        </div>
      </section>

      <section className="pb-100 agnet-details">
        <div className="tf-spacing-style3" />

        <div className="container innerpage-container">
          <AgentProfile agent={agent} />
          <AgentSidebar />
        </div>
      </section>

      <Footer />
    </>
  );
}
