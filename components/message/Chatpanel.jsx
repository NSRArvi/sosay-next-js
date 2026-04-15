import { useEffect, useMemo, useState, useRef } from "react";
import NextImage from "next/image";
import Echo from "laravel-echo";
import Pusher from "pusher-js";
import { useAppContext } from "@/context/context";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowLeft, Send, Paperclip, X, Download, Smile } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

import { EMOJI_CATEGORIES, ALL_EMOJIS } from "./Emojidata";

// ─── EmojiPicker Component ─────────────────────────────────────────────────
function EmojiPicker({ onSelect, onClose, pickerRef }) {
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(0);
  const scrollRef = useRef(null);

  // Filtered results — supports category + keyword partial matching (e.g. "people")
  const filtered = search.trim()
    ? (() => {
        const terms = search.trim().toLowerCase().split(/\s+/);
        return ALL_EMOJIS.filter(({ keywords, category }) =>
          terms.every((term) =>
            category.toLowerCase().includes(term) ||
            keywords.includes(term) ||
            keywords.split(/\s+/).some((word) => word.startsWith(term))
          )
        );
      })()
    : null;

  // Scroll category into view
  const scrollToCategory = (idx) => {
    setActiveCategory(idx);
    const el = scrollRef.current?.querySelector(`[data-cat="${idx}"]`);
    el?.scrollIntoView({ block: "nearest", behavior: "smooth" });
  };

  return (
    <div
      ref={pickerRef}
      className="absolute bottom-full left-0 z-50 mb-2 flex w-[min(20rem,calc(100vw-2rem))] max-w-full flex-col rounded-xl border bg-card shadow-lg"
      style={{ maxHeight: "360px" }}
    >
      {/* Search */}
      <div className="p-2 border-b">
        <input
          autoFocus
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search emoji…"
          className="w-full px-3 py-1.5 text-sm rounded-lg border bg-muted focus:outline-none focus:ring-2 focus:ring-secondary"
        />
      </div>

      {/* Category Tabs */}
      {!search.trim() && (
        <div className="grid grid-cols-6 gap-1 px-2 pt-2 pb-1">
          {EMOJI_CATEGORIES.map((cat, i) => (
            <button
              key={cat.name}
              onClick={() => scrollToCategory(i)}
              className={`text-lg w-8 h-8 flex items-center justify-center rounded-md transition-colors
                ${activeCategory === i ? "bg-secondary" : "hover:bg-muted"}`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      )}

      {/* Emoji Grid */}
      <div ref={scrollRef} className="flex-1 overflow-y-auto p-2">
        {filtered ? (
          // Search results
          filtered.length === 0 ? (
            <p className="text-xs text-muted-foreground text-center py-6">No emoji found</p>
          ) : (
          <div className="grid grid-cols-10 gap-0.5">
            {filtered.map(({ emoji }, i) => (
              <button
                key={i}
                onClick={() => onSelect(emoji)}
                className="text-xl w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors"
              >
                {emoji}
              </button>
            ))}
          </div>
          )
        ) : (
          // Categorised view
          EMOJI_CATEGORIES.map((cat, catIdx) => (
            <div key={cat.name} data-cat={catIdx}>
              <p className="text-xs font-semibold text-muted-foreground px-1 py-1 sticky top-0 bg-card">
                {cat.name}
              </p>
              <div className="grid grid-cols-10 gap-0.5">
                {cat.emojis.map((emoji, i) => (
                  <button
                    key={i}
                    onClick={() => onSelect(emoji)}
                    className="text-xl w-7 h-7 flex items-center justify-center rounded hover:bg-muted transition-colors"
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

// ─── Echo Setup ────────────────────────────────────────────────────────────
if (typeof window !== "undefined") {
  window.Pusher = Pusher;
}

const echo = new Echo({
  broadcaster: "reverb",
  key: "k9tfoyoxjqydldgg2w6y",
  wsHost: "api.sosay.org",
  wsPort: 8080,
  wssPort: 443,
  forceTLS: true,
  enabledTransports: ["ws", "wss"],
});

// ─── Chatpanel ─────────────────────────────────────────────────────────────
export default function Chatpanel({ receiver, setShowChatPanel }) {
  const { accessToken, userInfo } = useAppContext();
  const [message, setMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedImagePreview, setSelectedImagePreview] = useState("");
  const [isSelectedPreviewLoading, setIsSelectedPreviewLoading] = useState(false);
  const [loadedMessageImages, setLoadedMessageImages] = useState({});
  const [isSending, setIsSending] = useState(false);
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxIndex, setLightboxIndex] = useState(0);
  const messagesEndRef = useRef(null);
  const fileInputRef = useRef(null);
  const inputRef = useRef(null);
  const emojiPickerRef = useRef(null);
  const emojiButtonRef = useRef(null);
  const queryClient = useQueryClient();
  console.log(receiver);
  

  // ── Close picker on outside click ──────────────────────────────────────
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        showEmojiPicker &&
        emojiPickerRef.current &&
        !emojiPickerRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target)
      ) {
        setShowEmojiPicker(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [showEmojiPicker]);

  // ── Insert emoji at cursor position ────────────────────────────────────
  const handleEmojiSelect = (emoji) => {
    setMessage((prev) => prev + emoji);
    // Keep focus on the input after selecting
    setTimeout(() => inputRef.current?.focus(), 0);
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [chatHistory]);

  useEffect(() => {
    if (!accessToken || !userInfo?.id || !receiver?.user_id) {
      setChatHistory([]);
      setIsLoading(false);
      return;
    }

    const controller = new AbortController();

    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await fetch(
          `https://api.sosay.org/api/v1/chat/history/${receiver?.user_id}`,
          {
            headers: {
              Authorization: `Bearer ${accessToken}`,
              "Content-Type": "application/json",
            },
            signal: controller.signal,
          }
        );

        const data = await response.json();
        const messages = Array.isArray(data) ? data : data.data;

        if (!messages) {
          console.error("Unexpected data format", data);
          return;
        }

        const formattedHistory = messages.map((msg) => ({
          text: typeof msg.message === "string" ? msg.message : (msg.message?.message || "Message"),
          sender: msg.sender_id == userInfo.id ? "Me" : "Them",
          timestamp: msg.created_at,
          isFile: msg.is_file === 1 || msg.is_file === true,
          fileUrl: msg.is_file
            ? (typeof msg.message === "string" ? msg.message : msg.message?.message || null)
            : null,
        }));

        setChatHistory(formattedHistory);
      } catch (error) {
        if (error?.name === "AbortError") return;
        console.error("Could not fetch history", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();

    const channel = echo.channel(`chat.${userInfo.id}`);

    channel.listen(".message.sent", (e) => {
      console.log("Real-time Message received:", e);
      const messageText = typeof e.message === "string" ? e.message : (e.message?.message || "Message");
      setChatHistory((prev) => [
        ...prev,
        {
          text: messageText,
          sender: "Them",
          timestamp: new Date(),
          isFile: e.is_file === 1 || e.is_file === true,
          fileUrl: e.is_file ? messageText : null,
        },
      ]);
    });

    return () => {
      controller.abort();
      channel.stopListening(".message.sent");
      echo.leave(`chat.${userInfo.id}`);
    };
  }, [accessToken, userInfo?.id, receiver?.user_id]);

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
      setSelectedImagePreview("");
    }

    setSelectedFile(file);
    if (file.type?.startsWith("image/")) {
      setIsSelectedPreviewLoading(true);
      setSelectedImagePreview(URL.createObjectURL(file));
    }
  };

  const removeSelectedFile = () => {
    if (selectedImagePreview) {
      URL.revokeObjectURL(selectedImagePreview);
      setSelectedImagePreview("");
    }
    setIsSelectedPreviewLoading(false);
    setSelectedFile(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const markMessageImageLoaded = (fileUrl) => {
    if (!fileUrl) return;
    setLoadedMessageImages((prev) => ({ ...prev, [fileUrl]: true }));
  };

  const isImageFile = (fileUrl) => {
    if (!fileUrl) return false;
    const normalized = String(fileUrl).toLowerCase();
    if (normalized.startsWith("blob:") || normalized.startsWith("data:image/")) return true;
    const cleanUrl = normalized.split("?")[0].split("#")[0];
    return /\.(png|jpe?g|gif|webp|bmp|svg|avif|heic|heif)$/.test(cleanUrl);
  };

  const getFileNameFromUrl = (url) => {
    try {
      const urlParts = url.split("/");
      return urlParts[urlParts.length - 1];
    } catch {
      return "file";
    }
  };

  const getFileExtension = (nameOrUrl) => {
    const fileName = getFileNameFromUrl(nameOrUrl || "");
    const cleanName = fileName.split("?")[0].split("#")[0];
    const parts = cleanName.split(".");
    if (parts.length < 2) return "FILE";
    return parts.pop().toUpperCase();
  };

  const imageSlides = useMemo(() => {
    return chatHistory
      .filter((msg) => {
        const fileUrl = msg.fileUrl || msg.text;
        return msg.isFile && isImageFile(fileUrl);
      })
      .map((msg) => ({ src: msg.fileUrl || msg.text }));
  }, [chatHistory]);

  const openImageLightbox = (fileUrl) => {
    const index = imageSlides.findIndex((slide) => slide.src === fileUrl);
    setLightboxIndex(index >= 0 ? index : 0);
    setIsLightboxOpen(true);
  };

  const sendMessage = async () => {
    if ((!message.trim() && !selectedFile) || !accessToken || isSending) return;
    setIsSending(true);
    setShowEmojiPicker(false);

    try {
      let requestBody;
      let headers = { Authorization: `Bearer ${accessToken}` };

      if (selectedFile) {
        const formData = new FormData();
        formData.append("receiver_id", receiver?.user_id);
        formData.append("file", selectedFile);
        formData.append("is_file", "1");
        if (message.trim()) formData.append("message", message);
        requestBody = formData;
      } else {
        headers["Content-Type"] = "application/json";
        requestBody = JSON.stringify({
          receiver_id: receiver?.user_id,
          message: message,
          is_file: 0,
        });
      }

      const optimisticMessage = {
        text: selectedFile ? selectedFile.name : message,
        sender: "Me",
        timestamp: new Date(),
        isFile: !!selectedFile,
        fileUrl: selectedFile ? URL.createObjectURL(selectedFile) : null,
      };
      setChatHistory((prev) => [...prev, optimisticMessage]);

      const response = await fetch("https://api.sosay.org/api/v1/chat/send", {
        method: "POST",
        headers: headers,
        body: requestBody,
      });

      if (response.ok) {
        queryClient.invalidateQueries({ queryKey: [`/chat/inbox`] });

        if (selectedFile) {
          const responseData = await response.json();
          const fileUrl = responseData?.data?.message;
          if (fileUrl) {
            setChatHistory((prev) =>
              prev.map((msg, idx) =>
                idx === prev.length - 1 ? { ...msg, text: fileUrl, fileUrl } : msg
              )
            );
          }
        }

        setMessage("");
        removeSelectedFile();
      } else {
        throw new Error("Failed to send message");
      }
    } catch (error) {
      console.error("Error sending message:", error);
      setChatHistory((prev) => prev.slice(0, -1));
      alert("Failed to send message");
    } finally {
      setIsSending(false);
    }
  };

  const getInitials = (name) =>
    name.split(" ").map((w) => w[0]).join("").toUpperCase().slice(0, 2);

  return (
    <section className="w-full h-full">
      {receiver ? (
        <div className="flex h-full flex-col bg-card shadow-sm sm:rounded-xl lg:h-[calc(100dvh-90px)]">
          {/* Chat Header */}
          <div className="border-b bg-card px-3 py-3 sm:px-4 flex items-center gap-3 sm:rounded-t-xl">
            <button className="lg:hidden" onClick={() => setShowChatPanel(false)}>
              <ArrowLeft className="text-gray-400" />
            </button>
            <Avatar className="h-10 w-10">
              <AvatarImage src={receiver?.avatar} alt={receiver?.name} />
              <AvatarFallback className="capitalize bg-linear-to-br from-secondary to-purple-600 text-white text-sm font-semibold">
                {getInitials(receiver?.name || "")}
              </AvatarFallback>
            </Avatar>
            <div className="min-w-0 flex-1">
              <h2 className="truncate font-semibold text-base sm:text-lg">{receiver?.name}</h2>
              <p className="text-xs text-muted-foreground">
                {receiver?.is_online ? (
                  "Active now"
                ) : (
                  <span className="text-xs text-muted-foreground mt-1">
                    {receiver?.last_seen}
                  </span>
                )}
              </p>
            </div>
          </div>

          {/* Messages Container */}
          <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-4">
            {isLoading ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">Loading messages...</p>
              </div>
            ) : chatHistory.length === 0 ? (
              <div className="flex items-center justify-center h-full">
                <p className="text-muted-foreground">No messages yet. Start the conversation!</p>
              </div>
            ) : (
              chatHistory.map((msg, index) => (
                (() => {
                  const fileUrl = msg.fileUrl || msg.text;
                  const isImageMessage = msg.isFile && isImageFile(fileUrl);
                  const isSender = msg.sender === "Me";

                  return (
                    <div
                      key={index}
                      className={`flex ${isSender ? "justify-end" : "justify-start"}`}
                    >
                      <div
                        className={`max-w-[85%] sm:max-w-[75%] lg:max-w-[70%] rounded-2xl ${
                          isImageMessage
                            ? "bg-transparent p-0"
                            : isSender
                              ? "bg-secondary text-primary-foreground rounded-br-sm px-4 py-2"
                              : "bg-muted text-foreground rounded-bl-sm px-4 py-2"
                        }`}
                      >
                        {msg.isFile ? (
                          isImageMessage ? (
                            <button
                              type="button"
                              onClick={() => openImageLightbox(fileUrl)}
                              className="block"
                              aria-label="Open image preview"
                            >
                              <div className="relative h-52 sm:h-64 md:h-72 w-full min-w-[180px] sm:min-w-[220px] rounded-lg overflow-hidden bg-transparent border border-border/50">
                                {!loadedMessageImages[fileUrl] && (
                                  <div className="absolute inset-0 animate-pulse bg-muted/60" />
                                )}
                                <NextImage
                                  src={fileUrl}
                                  alt="Shared image"
                                  fill
                                  unoptimized
                                  sizes="(max-width: 768px) 80vw, 320px"
                                  className="object-contain"
                                  onLoad={() => markMessageImageLoaded(fileUrl)}
                                  onError={() => markMessageImageLoaded(fileUrl)}
                                />
                              </div>
                            </button>
                          ) : (
                            <div
                              className={`min-w-[170px] sm:min-w-[220px] rounded-xl border px-3 py-2.5 ${
                                isSender
                                  ? "bg-secondary/90 border-white/35"
                                  : "bg-background border-border/80"
                              }`}
                            >
                              <div className="flex items-center justify-between gap-2">
                                <div className="flex items-center gap-2 min-w-0">
                                  <Paperclip className="h-4 w-4 shrink-0" />
                                  <p className="text-sm font-medium truncate">
                                    {getFileNameFromUrl(fileUrl)}
                                  </p>
                                </div>
                                <span
                                  className={`text-[10px] px-2 py-0.5 rounded-full font-semibold ${
                                    isSender
                                      ? "bg-white/20 text-white"
                                      : "bg-muted text-muted-foreground"
                                  }`}
                                >
                                  {getFileExtension(fileUrl)}
                                </span>
                              </div>
                              <div className="mt-2 flex items-center gap-2">
                                <a
                                  href={fileUrl}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs underline hover:opacity-80"
                                >
                                  Open
                                </a>
                                <a
                                  href={fileUrl}
                                  download
                                  className="inline-flex items-center gap-1 text-xs underline hover:opacity-80"
                                >
                                  <Download className="h-3.5 w-3.5" />
                                  Download
                                </a>
                              </div>
                            </div>
                          )
                        ) : (
                          <p className="text-sm wrap-break-word">{msg.text}</p>
                        )}
                      </div>
                    </div>
                  );
                })()
              ))
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Message Input */}
          <div className="border-t bg-card p-3 sm:p-4 sm:rounded-b-xl">
            {/* File Preview */}
            {selectedFile && (
              <div className="mb-2 p-2 bg-muted rounded-lg">
                {selectedImagePreview ? (
                  <div className="space-y-2">
                    <div className="relative h-52 sm:h-64 md:h-72 w-full bg-transparent rounded-lg overflow-hidden border border-border/50">
                      {isSelectedPreviewLoading && (
                        <div className="absolute inset-0 animate-pulse bg-muted/60" />
                      )}
                      <NextImage
                        src={selectedImagePreview}
                        alt="Selected image preview"
                        fill
                        unoptimized
                        sizes="(max-width: 768px) 100vw, 420px"
                        className="object-contain"
                        onLoad={() => setIsSelectedPreviewLoading(false)}
                        onError={() => setIsSelectedPreviewLoading(false)}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="max-w-[58vw] sm:max-w-[220px] text-sm truncate">{selectedFile.name}</span>
                      <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeSelectedFile}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Paperclip className="h-4 w-4" />
                      <span className="max-w-[48vw] sm:max-w-[200px] text-sm truncate">{selectedFile.name}</span>
                      <span className="text-xs text-muted-foreground">
                        ({(selectedFile.size / 1024).toFixed(2)} KB)
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="h-6 w-6" onClick={removeSelectedFile}>
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                )}
              </div>
            )}

            <div className="relative flex items-center gap-2">
              {/* Emoji Picker Popup */}
              {showEmojiPicker && (
                <EmojiPicker
                  pickerRef={emojiPickerRef}
                  onSelect={handleEmojiSelect}
                  onClose={() => setShowEmojiPicker(false)}
                />
              )}

              {/* File Upload */}
              <input
                type="file"
                ref={fileInputRef}
                onChange={handleFileSelect}
                className="hidden"
                accept="image/*,.pdf,.doc,.docx,.txt"
              />
              <Button
                variant="outline"
                size="icon"
                onClick={() => fileInputRef.current?.click()}
                disabled={isSending}
                className="shrink-0"
              >
                <Paperclip className="h-4 w-4" />
              </Button>

              {/* Emoji Toggle Button */}
              <Button
                ref={emojiButtonRef}
                variant="outline"
                size="icon"
                onClick={() => setShowEmojiPicker((prev) => !prev)}
                disabled={isSending}
                className={`shrink-0 ${showEmojiPicker ? "bg-muted" : ""}`}
              >
                <Smile className="h-4 w-4" />
              </Button>

              {/* Text Input */}
              <Input
                ref={inputRef}
                type="text"
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder={selectedFile ? "Add a caption (optional)..." : "Type a message…"}
                className="flex-1"
                onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && sendMessage()}
                disabled={isSending}
              />

              {/* Send Button */}
              <Button
                onClick={sendMessage}
                size="icon"
                disabled={(!message.trim() && !selectedFile) || isSending}
                className="bg-secondary shrink-0"
              >
                {isSending ? (
                  <div className="h-4 w-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
                ) : (
                  <Send className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>
        </div>
      ) : (
        <div className="flex flex-1 items-center justify-center h-full lg:h-[calc(100dvh-90px)] bg-card rounded-xl shadow-sm">
          <p className="text-muted-foreground">Select a chat to start messaging</p>
        </div>
      )}

      <Lightbox
        open={isLightboxOpen}
        close={() => setIsLightboxOpen(false)}
        slides={imageSlides}
        index={lightboxIndex}
      />
    </section>
  );
}