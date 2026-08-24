import MessageItemMenu from "./MessageItemMenu";

export type ChatMessage = {
  id: number;
  type: "received" | "sent";
  text: string;
  time: string;
  dateSeparatorBefore?: string;
};

// Migrated from ../aurexo/message.html's message bubbles. Source's own DOM child order genuinely
// differs by type — received bubbles render text then the "..." menu, sent bubbles render the menu
// then text (a real CSS-driven alignment trick, confirmed via source diff) — reproduced exactly rather
// than using one fixed order for both.
export default function MessageItem({ message, onDelete }: { message: ChatMessage; onDelete: () => void }) {
  return (
    <>
      {message.dateSeparatorBefore && (
        <div className="message-date-separator">
          <span>{message.dateSeparatorBefore}</span>
        </div>
      )}
      <div className={`message-item message-item--${message.type}`}>
        <div className="message-item__bubble">
          {message.type === "sent" ? (
            <>
              <MessageItemMenu onDelete={onDelete} />
              <div className="message-item__text">{message.text}</div>
            </>
          ) : (
            <>
              <div className="message-item__text">{message.text}</div>
              <MessageItemMenu onDelete={onDelete} />
            </>
          )}
        </div>
        <div className="message-item__time">{message.time}</div>
      </div>
    </>
  );
}
