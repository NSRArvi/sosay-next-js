import { useQuery, useQueryClient, useMutation } from "@tanstack/react-query";
import { useAppContext } from "@/context/context";
import { fetchWithToken, postWithToken } from "@/helpers/api";
import ChatSearch from "./ChatSearch";
import { useState } from "react";
import ChatCardSkeleton from "./ChatCardSkeleton";
import ChatCard from "./ChatCard";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Image from "next/image";

export default function ChatHistory({
  whatsapp,
  whatsAppInfo,
  setReceiver,
  receiver,
  setShowChatPanel,
  chatHistoryData,
  chatHistoryLoading,
  onSelectChat,
}) {
  const { accessToken, userInfo } = useAppContext();
  const queryClient = useQueryClient();
  const [isSearching, setIsSearching] = useState(false);
  const [isWhatsAppModalOpen, setIsWhatsAppModalOpen] = useState(false);
  const [whatsappNumber, setWhatsappNumber] = useState("");

  const saveWhatsappMutation = useMutation({
    mutationFn: (formData) =>
      postWithToken("/chat/save-whatsapp-contact", formData, accessToken),
    onSuccess: () => {
      setIsWhatsAppModalOpen(false);
      queryClient.invalidateQueries([
        `/chat/check-if-whatsapp-contact-exist/${userInfo?.id}`,
      ]);
    },
    onError: (error) => {
      console.error("Failed to save WhatsApp number", error);
    },
  });

  const handleSaveWhatsapp = () => {
    if (!whatsappNumber) return;
    const formData = new FormData();
    formData.append("whatsapp_number", whatsappNumber);
    saveWhatsappMutation.mutate(formData);
  };

  // Fetch chat history
  const { data: fallbackChatHistory, isLoading: fallbackChatHistoryLoading } =
    useQuery({
      queryKey: ["/chat/inbox", accessToken],
      queryFn: fetchWithToken,
      enabled: !!accessToken && !chatHistoryData,
    });

  const chatHistory = chatHistoryData || fallbackChatHistory;
  const isLoading =
    typeof chatHistoryLoading === "boolean"
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
      <div
        className={`mb-4 md:mb-8 flex items-center justify-between ${isSearching ? "hidden" : "block"}`}
      >
        <div>
          <h1 className="text-2xl md:text-3xl font-bold mb-1 md:mb-2">
            Messages
          </h1>
          <p className="text-sm md:text-base text-gray-600">
            Chat with your friends and stay connected
          </p>
        </div>
        <Image
          onClick={() => setIsWhatsAppModalOpen(true)}
          src={whatsapp}
          alt="WhatsApp"
          height={40}
          width={40}
        />
      </div>

      <Dialog open={isWhatsAppModalOpen} onOpenChange={setIsWhatsAppModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Manage WhatsApp</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 mt-4">
            <Input
              placeholder="e.g. 31098765480"
              value={whatsappNumber || whatsAppInfo}
              onChange={(e) => setWhatsappNumber(e.target.value)}
            />
            <Button
              onClick={handleSaveWhatsapp}
              disabled={saveWhatsappMutation.isLoading || !whatsappNumber}
            >
              {saveWhatsappMutation.isLoading ? "Saving..." : "Save"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>

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
                  className="cursor-pointer w-full text-left block min-w-0"
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
