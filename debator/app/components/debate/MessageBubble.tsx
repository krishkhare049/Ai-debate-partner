interface Props {
  sender: "user" | "ai";
  content: string;
}

export default function MessageBubble({
  sender,
  content
}: Props) {
  const isUser = sender === "user";

  return (
    <div
      className={`flex ${
        isUser ? "justify-end" : "justify-start"
      }`}
    >
      <div
        className={`max-w-md p-3 rounded-lg ${
          isUser
            ? "bg-black text-white"
            : "bg-gray-200"
        }`}
      >
        {content}
      </div>
    </div>
  );
}