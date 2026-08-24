import DashboardShell from "@/components/dashboard/DashboardShell";

// Shared shell for the whole Dashboard/account family (dashboard.html, my-listings.html,
// my-favorites.html, my-profile.html, message.html, reviews.html, change-password.html) — first
// established while migrating dashboard.html, the first page of this family. No `<Footer>` here: source
// has none on this page (a self-contained app-like shell, confirmed via source read).
export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return <DashboardShell>{children}</DashboardShell>;
}
