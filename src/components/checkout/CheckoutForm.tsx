"use client";

// Tiny client boundary around the top-level `<form onSubmit>` so `page.tsx` can stay a server
// component with a real `metadata` export (matching every other migrated page's convention) instead of
// the whole route needing "use client" just for this one preventDefault.
export default function CheckoutForm({ children }: { children: React.ReactNode }) {
  return (
    <form className="w-full" action="#" onSubmit={(event) => event.preventDefault()}>
      {children}
    </form>
  );
}
