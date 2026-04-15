import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";
import ChatSearch from "./ChatSearch";
import { useState } from "react";
import ChatCardSkeleton from "./ChatCardSkeleton";
import ChatCard from "./ChatCard";

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
    <section className="flex flex-col h-full">
      {/* Header — hidden on mobile when searching */}
      <div className={`mb-4 md:mb-8 ${isSearching ? "hidden" : "block"}`}>
        <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">Messages</h1>
        <p className="text-sm md:text-base text-gray-600">
          Chat with your friends and stay connected
        </p>
      </div>

      <ChatSearch
        isSearching={isSearching}
        setIsSearching={setIsSearching}
        setReceiver={(chat) => handleSelectChat(chat)}
      />

      {!isSearching && (
        <div className="flex-1 overflow-y-auto mt-4 md:mt-8 min-h-0">
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
                  className="cursor-pointer w-full text-left"
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
