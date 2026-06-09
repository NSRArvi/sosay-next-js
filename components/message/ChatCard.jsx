import { useEffect, useState } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Dot, Paperclip } from "lucide-react";

export default function ChatCard({ chat, receiver }) {
  const [messageLimit, setMessageLimit] = useState(20);

  useEffect(() => {
    const getLimitByWidth = (width) => {
      if (width < 380) return 18;
      if (width < 640) return 24;
      if (width < 1024) return 32;
      return 42;
    };

    const updateLimit = () => {
      setMessageLimit(getLimitByWidth(window.innerWidth));
    };

    updateLimit();
    window.addEventListener("resize", updateLimit);
    return () => window.removeEventListener("resize", updateLimit);
  }, []);

  const getInitials = (name) => {
    return name
      .split(" ")
      .map((word) => word[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Check if the message is a file (is_file is either 1 or true)
  const isFileMessage = chat.is_file === 1 || chat.is_file === true;

  // Safely get the last message text
  const getLastMessageText = () => {
    if (typeof chat.last_message === "string") {
      return chat.last_message;
    } else if (
      typeof chat.last_message === "object" &&
      chat.last_message !== null
    ) {
      // If last_message is an object, try to get the message property
      return chat.last_message.message || "Message";
    }
    return "Message";
  };

  const fullLastMessage = getLastMessageText();
  const shouldShowReadMore =
    !isFileMessage && fullLastMessage.length > messageLimit;
  const previewMessage = shouldShowReadMore
    ? `${fullLastMessage.slice(0, messageLimit).trimEnd()}... Read more`
    : fullLastMessage;

  return (
    <Card
      className={`mb-2 w-full max-w-full cursor-pointer hover:bg-accent transition-colors overflow-hidden ${chat?.user_id === receiver?.user_id ? "border border-secondary" : ""}`}
    >
      <CardContent className="p-3">
        <div className="grid grid-cols-[auto_1fr] items-center gap-3 w-full min-w-0">
          {/* Avatar */}
          <div className="relative shrink-0">
            <Avatar className="h-12 w-12">
              <AvatarImage src={chat.avatar} alt={chat.name} />
              <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                {getInitials(chat.name)}
              </AvatarFallback>
            </Avatar>
            {/* Online indicator */}
            {chat.is_online ? (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-background"></span>
            ) : (
              <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-gray-500 border-2 border-background"></span>
            )}
          </div>

          {/* Chat info */}
          <div className="min-w-0 flex flex-col justify-center">
            <div className="grid grid-cols-[1fr_auto] items-center gap-2 mb-1">
              <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
              <span className="text-xs text-muted-foreground whitespace-nowrap">
                {chat.last_seen}
              </span>
            </div>
            
            <div
              className={`grid grid-cols-[1fr_auto] items-center gap-2 min-w-0 ${chat.unread_count > 0 ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              <div className="flex items-center min-w-0">
                {isFileMessage ? (
                  <div className="flex items-center min-w-0 shrink-0">
                    <Paperclip className="h-3 w-3 mr-1 shrink-0" />
                    <span className="text-sm truncate block">File</span>
                  </div>
                ) : (
                  <span className="text-sm truncate block min-w-0">
                    {fullLastMessage}
                  </span>
                )}
                <Dot className="shrink-0 mx-0" />
                <span className="text-xs shrink-0 whitespace-nowrap">
                  {chat.time}
                </span>
              </div>

              {chat.unread_count > 0 && (
                <span className="shrink-0 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-primary-foreground">
                  {chat.unread_count}
                </span>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
