import type { Metadata } from "next";
import MessageContactList from "@/components/message/MessageContactList";
import MessageChat from "@/components/message/MessageChat";

export const metadata: Metadata = {
  title: "Pesan",
  description: "MARF Showroom Mobil Purwokerto — jual beli mobil bekas berkualitas di Banyumas. Unit terawat, harga jujur, dokumen lengkap. Hubungi WhatsApp 0822-4109-8298.",
};

// Migrated from ../aurexo/message.html. Uses the same `(dashboard)` shell as dashboard.html/
// my-listings.html/add-listings-2.html/my-favorites.html/reviews.html.
export default function MessagePage() {
  return (
    <>
      <p className="h3 mb-40">Pesan</p>
      <div className="message-container">
        <MessageContactList />
        <MessageChat />
      </div>
    </>
  );
}
