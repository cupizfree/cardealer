"use client";

import Image from "next/image";

// Migrated from ../aurexo/dashboard.html lines 580-624. All 4 cards are source's own literal dead
// `href="#"` (confirmed via source — no script touches any of them); static counts preserved verbatim.
const STATS = [
  { label: "Iklan Saya", value: "12", icon: "/assets/images/dashboard/car.svg" },
  { label: "Pending", value: "03", icon: "/assets/images/dashboard/clockCountdown.svg" },
  { label: "Favorit Saya", value: "08", icon: "/assets/images/dashboard/star.svg" },
  { label: "Ulasan Saya", value: "137", icon: "/assets/images/dashboard/chats.svg" },
];

export default function DashboardStats() {
  return (
    <div className="grid grid-cols-4 xl-grid-cols-2 sm-grid-cols-1 gap-30 mb-30">
      {STATS.map((stat) => (
        <a href="#" className="dashboard-cart" key={stat.label} onClick={(event) => event.preventDefault()}>
          <div>
            <p className="h7 font-weight-500 mb-4">{stat.label}</p>
            <p className="h3">{stat.value}</p>
          </div>
          <div className="icon">
            <Image src={stat.icon} alt="" width={48} height={48} />
          </div>
        </a>
      ))}
    </div>
  );
}
