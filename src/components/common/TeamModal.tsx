import Image from "next/image";
import Modal from "./Modal";
import { TEAM_SOCIAL_LINKS } from "@/components/common/SocialIcons";

// Quick-view team-member panel (#TeamModal, modal-right). Source shows this SAME fixed content
// ("Bessie Cooper") no matter which of the 4 Executive Team cards' name link was clicked (see
// ExecutiveTeam.tsx) — preserved verbatim, same "one static modal, many identical triggers" pattern
// as `CardCompareModal`. Note a genuine source content inconsistency, also preserved as-is (not
// "fixed"): the heading says "Bessie Cooper" but the bio paragraphs refer to "Oliver" and a Chief
// Financial Officer role, mismatching both the name and the card's own "Chief Operating Officer" title.
export default function TeamModal() {
  return (
    <Modal id="TeamModal" className="modal-right modal-team">
      <div className="grid grid-cols-2 gap-60 md-grid-cols-1">
        <div>
          <Image className="w-full radius-24" src="/assets/images/pages/sale-agent-2.jpg" alt="sale-agent-1" width={495} height={495} />
        </div>
        <div>
          <h2 className="mb-24">Bessie Cooper</h2>

          <ul className="contact-page-info-social flex gap-8 mb-24">
            {TEAM_SOCIAL_LINKS.map(({ href, Icon }) => (
              <li key={href}>
                <a href={href} className="hover-stroke-white">
                  <Icon stroke="#1C1C1C" />
                </a>
              </li>
            ))}
          </ul>

          <p className="text-body-style-2 mb-24">
            Bessie Cooper is the Chief Financial Officer at Aurexo, Inc. responsible for financial
            strategy, accounting operations, tax compliance and investor relations. Oliver has over 10
            years of experience in senior corporate finance & strategy roles across several high-growth
            consumer brands, having joined the company Flexcar.
          </p>

          <p className="text-body-style-2 mb-40">
            Prior to Flexcar, Oliver was VP of Strategy at Leaf Group Ltd., a publicly traded Internet,
            media, and ecommerce company where he was responsible for driving profitable growth
            strategies for its two-sided marketplace business, Society6. Prior to Leaf Group, Oliver
            was Director of Finance at Ogin, Inc., a private equity backed clean technology company. He
            began his career in corporate advisory and M&A at Capstone Advisory Group.
          </p>

          <div className="divider mb-40" />

          <p className="h3 mb-16">Infomation</p>

          <div className="grid grid-cols-2 gap-20 md-grid-cols-1">
            <div>
              <p className="text-sm uppercase text-secondary">AGE:</p>
              <p className="h5 capitalize">48 years old</p>
            </div>

            <div>
              <p className="text-sm uppercase text-secondary">EMAIL:</p>
              <p className="h5">
                <a className="h5 font-weight-600" href="mailto:themesflat@gmail.com">
                  themesflat@gmail.com
                </a>
              </p>
            </div>

            <div>
              <p className="text-sm uppercase text-secondary">WHATSAPP:</p>
              <p className="h5">
                <a className="h5 font-weight-600" href="tel:5551234567">
                  (555) 123-4567
                </a>
              </p>
            </div>

            <div>
              <p className="text-sm uppercase text-secondary">FROM:</p>
              <p className="h5 capitalize">Los Angeles,California</p>
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
}
