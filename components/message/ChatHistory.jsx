import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dot, Paperclip } from "lucide-react";
import ChatSearch from "./ChatSearch";
import { useState } from "react";

// Skeleton component for loading state
function ChatCardSkeleton() {
  return (
    <Card className="mb-2">
      <CardContent>
        <div className="flex items-center gap-3">
          <Skeleton className="h-12 w-12 rounded-full" />
          <div className="flex-1 space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-3 w-48" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-3 w-16" />
            <Skeleton className="h-5 w-5 rounded-full ml-auto" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

// Chat card component
function ChatCard({ chat, receiver }) {
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

  return (
    <Card
      className={`mb-2 cursor-pointer hover:bg-accent transition-colors ${chat?.user_id === receiver?.user_id && "border border-secondary"}`}
    >
      <CardContent>
        <div className="flex items-center gap-3">
          {/* Avatar */}
          <div className="relative">
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
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between mb-1">
              <h3 className="font-semibold text-sm truncate">{chat.name}</h3>
              <span className="text-xs text-muted-foreground ml-2 whitespace-nowrap">
                {chat.last_seen}
              </span>
            </div>
            <div
              className={`flex items-center justify-between ${chat.unread_count > 0 ? "text-primary font-semibold" : "text-muted-foreground"}`}
            >
              <p className={`text-sm truncate flex items-center`}>
                {isFileMessage ? (
                  <>
                    <Paperclip className="h-3 w-3 mr-1" />
                    <span>File</span>
                  </>
                ) : (
                  getLastMessageText()
                )}
                <Dot />
                <span className="text-xs">{chat.time}</span>
              </p>
              {chat.unread_count > 0 && (
                <span className="ml-2 flex h-5 w-5 items-center justify-center rounded-full bg-secondary text-xs text-primary-foreground">
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

export default function ChatHistory({
  setReceiver,
  receiver,
  setShowChatPanel,
  chatHistoryData,
  chatHistoryLoading,
  onSelectChat,
}) {
  const { accessToken } = useAppContext();
  const [isSearching, setIsSearching] = useState(false);

  // Fetch chat history
  const { data: fallbackChatHistory, isLoading: fallbackChatHistoryLoading } = useQuery({
    queryKey: ["/chat/inbox", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken && !chatHistoryData,
  });

  const chatHistory = chatHistoryData || fallbackChatHistory;
  const isLoading = typeof chatHistoryLoading === "boolean"
    ? chatHistoryLoading
    : fallbackChatHistoryLoading;

  const handleSelectChat = (chat) => {
    if (onSelectChat) {
      onSelectChat(chat);
      return;
    }

    setReceiver(chat);
    setShowChatPanel(true);
  };

  return (
    <section>
      <div className="mb-8">
        <h1 className="text-3xl font-bold mb-2">Messages</h1>
        <p className="text-gray-600">
          Chat with your friends and stay connected
        </p>
      </div>

      <ChatSearch
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        setReceiver={(chat) => handleSelectChat(chat)}
      />

      {!isSearching && (
        <div className="h-[calc(100dvh-192px)] overflow-y-auto mt-8">
          {isLoading ? (
            // Show skeleton loaders
            <div>
              {[...Array(5)].map((_, index) => (
                <ChatCardSkeleton key={index} />
              ))}
            </div>
          ) : chatHistory?.data?.length > 0 ? (
            // Show chat cards
            <div>
              {chatHistory.data.map((chat) => (
                <button
                  key={chat.user_id}
                  onClick={() => {
                    handleSelectChat(chat);
                  }}
                  className="cursor-pointer w-full"
                >
                  <ChatCard chat={chat} receiver={receiver} />
                </button>
              ))}
            </div>
          ) : (
            // Empty state
            <div className="text-center py-12">
              <p className="text-muted-foreground">No chat history found</p>
            </div>
          )}
        </div>
      )}
    </section>
  );
}
