"use client";
import React, { useMemo, useState } from "react";
import ChatHistory from "@/components/message/ChatHistory";
import Chatpanel from "@/components/message/Chatpanel";
import { useQuery } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { fetchWithToken } from "@/helpers/api";

export default function Page() {
  const { accessToken } = useAppContext();
  const [receiver, setReceiver] = useState(null);
  const [showChatPanel, setShowChatPanel] = useState(false);

  const { data: chatHistory, isLoading: chatHistoryLoading } = useQuery({
    queryKey: ["/chat/inbox", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
  });

  const defaultReceiver = useMemo(() => {
    const chats = chatHistory?.data || [];
    if (!Array.isArray(chats) || chats.length === 0) return null;
    return chats[0];
  }, [chatHistory]);

  const desktopReceiver = receiver || defaultReceiver;
  const mobileReceiver = receiver;
  const isMobileChatPanelOpen = showChatPanel && Boolean(mobileReceiver);

  const handleSelectChat = (chat) => {
    setReceiver(chat);
    setShowChatPanel(true);
  };

  return (
    <section className="relative h-[calc(100dvh-56px)] md:h-[calc(100dvh-32px)] mt-14 md:mt-8 p-4 overflow-hidden">
      <div className="hidden lg:flex gap-8 h-full">
        <div className="lg:w-2/5 h-full overflow-hidden">
          <ChatHistory
            setReceiver={setReceiver}
            receiver={desktopReceiver}
            setShowChatPanel={setShowChatPanel}
            chatHistoryData={chatHistory}
            chatHistoryLoading={chatHistoryLoading}
            onSelectChat={handleSelectChat}
          />
        </div>

        <div className="lg:w-3/5 h-full overflow-hidden">
          <Chatpanel receiver={desktopReceiver} />
        </div>
      </div>

      <div className="lg:hidden h-full overflow-hidden">
        <ChatHistory
          setReceiver={setReceiver}
          receiver={mobileReceiver}
          setShowChatPanel={setShowChatPanel}
          chatHistoryData={chatHistory}
          chatHistoryLoading={chatHistoryLoading}
          onSelectChat={handleSelectChat}
        />

        {isMobileChatPanelOpen && mobileReceiver && (
          <div className="fixed inset-0 z-50 bg-background lg:hidden">
            <Chatpanel receiver={mobileReceiver} setShowChatPanel={setShowChatPanel} />
          </div>
        )}
      </div>

      {!desktopReceiver && !chatHistoryLoading && (
        <div className="hidden lg:flex absolute inset-0 items-center justify-center pointer-events-none">
          <p className="text-muted-foreground">No chats available yet</p>
        </div>
      )}
    </section>
  );
}