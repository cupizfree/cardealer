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
  { id: "marvin", name: "Marvin McKinney", avatarSrc: "/assets/images/avatar/avatar-5.png", avatarAlt: "Marvin McKinney", preview: "Hey! there I'm available", time: "16:24 PM", badge: "2" },
  { id: "john", name: "John Smith", avatarSrc: "/assets/images/avatar/avatar-6.png", avatarAlt: "John Smith", preview: "Hey! there I'm available", time: "15:56 PM", status: "online", active: true },
  { id: "brooklyn", name: "Brooklyn Simmons", avatarSrc: "/assets/images/avatar/avatar-7.png", avatarAlt: "Brooklyn Simmons", preview: "Hey! there I'm available", time: "14:10 PM", badge: "2", status: "offline" },
  { id: "arlene", name: "Arlene McCoy", avatarSrc: "/assets/images/avatar/avatar-8.png", avatarAlt: "Arlene McCoy", preview: "Hey! there I'm available", time: "11:23 AM" },
  { id: "darrell", name: "Darrell Steward", avatarSrc: "/assets/images/avatar/avatar-9.png", avatarAlt: "Darrell Steward", preview: "Hey! there I'm available", time: "Yesterday" },
  { id: "arlene-2", name: "Arlene McCoy", avatarSrc: "/assets/images/avatar/avatar-5.png", avatarAlt: "Theresa Webb", preview: "Hey! there I'm available", time: "Tuesday" },
  { id: "brooklyn-2", name: "Brooklyn Simmons", avatarSrc: "/assets/images/avatar/avatar-6.png", avatarAlt: "Theresa Webb", preview: "Hey! there I'm available", time: "01/06/2024" },
  { id: "theresa", name: "Theresa Webb", avatarSrc: "/assets/images/avatar/avatar-7.png", avatarAlt: "Theresa Webb", preview: "Hey! there I'm available", time: "06/06/2024" },
];
