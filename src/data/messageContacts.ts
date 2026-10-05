// Migrated from ../aurexo/message.html lines 592-698. Every contact carries a real `data-contact`
// attribute (e.g. `data-contact="marvin"`) but nothing anywhere in source (`app.js` or this page's own
// trailing inline script) ever reads it — confirmed via grep. Clicking a different contact does nothing;
// the conversation shown is permanently the one with John Smith (the only contact statically marked
// `active`). Reproduced faithfully: contacts render as inert rows, not clickable tabs. Two real, disclosed
// source content bugs preserved verbatim: the "Arlene McCoy" row's `<img alt>` reads "Theresa Webb", and
// the "Brooklyn Simmons" row's `<img alt>` also reads "Theresa Webb" — both mismatching their own visible
// name text.
export type MessageContact = {
  id: string;
  name: string;
  avatarSrc: string;
  avatarAlt: string;
  preview: string;
  time: string;
  badge?: string;
  status?: "online" | "offline";
  active?: boolean;
};

export const messageContacts: MessageContact[] = [
  { id: "marvin", name: "Bagas Prasetyo", avatarSrc: "/assets/images/avatar/avatar-5.png", avatarAlt: "Bagas Prasetyo", preview: "Halo, ada yang bisa dibantu?", time: "16:24 PM", badge: "2" },
  { id: "john", name: "Andi Wijaya", avatarSrc: "/assets/images/avatar/avatar-6.png", avatarAlt: "Andi Wijaya", preview: "Halo, ada yang bisa dibantu?", time: "15:56 PM", status: "online", active: true },
  { id: "brooklyn", name: "Rina Kusumawati", avatarSrc: "/assets/images/avatar/avatar-7.png", avatarAlt: "Rina Kusumawati", preview: "Halo, ada yang bisa dibantu?", time: "14:10 PM", badge: "2", status: "offline" },
  { id: "arlene", name: "Dewi Anggraini", avatarSrc: "/assets/images/avatar/avatar-8.png", avatarAlt: "Dewi Anggraini", preview: "Halo, ada yang bisa dibantu?", time: "11:23 AM" },
  { id: "darrell", name: "Fajar Ramadhan", avatarSrc: "/assets/images/avatar/avatar-9.png", avatarAlt: "Fajar Ramadhan", preview: "Halo, ada yang bisa dibantu?", time: "Kemarin" },
  { id: "arlene-2", name: "Dewi Anggraini", avatarSrc: "/assets/images/avatar/avatar-5.png", avatarAlt: "Dewi Anggraini", preview: "Halo, ada yang bisa dibantu?", time: "Selasa" },
  { id: "brooklyn-2", name: "Rina Kusumawati", avatarSrc: "/assets/images/avatar/avatar-6.png", avatarAlt: "Rina Kusumawati", preview: "Halo, ada yang bisa dibantu?", time: "01/06/2024" },
  { id: "theresa", name: "Maya Sari", avatarSrc: "/assets/images/avatar/avatar-7.png", avatarAlt: "Maya Sari", preview: "Halo, ada yang bisa dibantu?", time: "06/06/2024" },
];
