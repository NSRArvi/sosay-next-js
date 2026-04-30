import {
  Home,
  Users,
  Store,
  Video,
  Settings,
  Layers,
  MessageCircle,
  Bell,
  Bookmark,
  PlusCircle,
  LogOut,
  BriefcaseBusiness,
  Search,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useAppContext } from "@/context/context";
import Image from "next/image";
import { fetchWithToken } from "@/helpers/api";
import { useQuery } from "@tanstack/react-query";
import defaultProfile from "../../app/assets/designs/girl.png";

export default function AppSidebar({ isOpen, onClose }) {
  const { userInfo, logout, pathname, accessToken } = useAppContext();

  // Fetch Inbox Data to calculate total unread
  const { data: inboxData } = useQuery({
    queryKey: ["/chat/inbox", accessToken],
    queryFn: fetchWithToken,
    enabled: !!accessToken,
    staleTime: Infinity,
  });

  // Calculate Total Unread Count
  const totalUnread =
    inboxData?.data?.reduce((sum, chat) => sum + (chat.unread_count || 0), 0) ||
    0;
  const menuItems = [
    { name: "Home", icon: Home, href: "/app" },
    { name: "Create", icon: PlusCircle, href: "/app/create" },
    {
      name: "Message",
      icon: MessageCircle,
      href: "/app/message",
      count: totalUnread,
    },
    { name: "Friends", icon: Users, href: "/app/friends" },
    { name: "Reels", icon: Video, href: "/app/reels" },
    { name: "Search", icon: Search, href: "/app/search" },
    { name: "SPUMP Market", icon: Store, href: "/app/shop" },
    { name: "Add Manager", icon: BriefcaseBusiness, href: "/app/add-manager" },
    // { name: "Pages", icon: Layers, href: "/app/pages" },
    // { name: "Bookmark", icon: Bookmark, href: "/app/bookmark" },
    // { name: "Notifications", icon: Bell, href: "/app/notifications" },
    // { name: "Settings", icon: Settings, href: "/app/settings" },
  ];
  return (
    <>
      {/* Overlay for mobile */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-99 md:z-50 md:hidden"
          onClick={onClose}
        />
      )}
      {/* isMessageRoute ? "top-0 lg:top-14" : "top-14", */}
      <aside
        className={clsx(
          "fixed h-screen w-64 bg-white text-gray-800 z-99 md:z-50 flex flex-col transition-transform duration-300",
          isOpen ? "translate-x-0 top-0" : "-translate-x-full top-14",
          "md:translate-x-0 md:top-14 md:h-[calc(100vh-3.5rem)]",
        )}
      >
        {/* User Profile Section */}
        {userInfo && (
          <Link
            href="/app/profile"
            className="flex items-center gap-3 px-5 py-4 border-y border-gray-200 hover:bg-gray-50 transition-colors shrink-0"
          >
            <Image
              src={userInfo?.user_image || defaultProfile}
              alt="Profile"
              className="size-16 md:size-20 rounded-full object-cover border-4"
              height={500}
              width={500}
            />
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-gray-900 truncate">
                {userInfo.name}
              </p>
              <p className="text-sm text-gray-500 truncate">{userInfo.email}</p>
            </div>
          </Link>
        )}

        {/* Navigation Menu */}
        <nav className="flex-1 overflow-y-auto min-h-0">
          <div className="flex flex-col py-2">
            {menuItems.map((item) => {
              const Icon = item.icon;

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    onClose();
                  }}
                  className={clsx(
                    "flex items-center gap-4 px-5 py-3 rounded-xl mx-2 my-1 transition-all hover:bg-gray-100",
                    pathname === item.href &&
                      "text-secondary font-medium bg-gray-100",
                  )}
                >
                  <Icon size={22} />
                  <span className="font-medium">{item.name}</span>
                  {totalUnread > 0 && item.name === "Message" && (
                    <span className="ml-auto inline-flex items-center justify-center size-6 text-sm font-bold leading-none text-white bg-secondary rounded-full">
                      {totalUnread}
                    </span>
                  )}
                </Link>
              );
            })}

            <button
              onClick={() => {
                logout();
                onClose();
              }}
              className="mx-2 my-1 flex w-[calc(100%-1rem)] items-center gap-4 rounded-xl border border-red-200 bg-red-50 px-5 py-3 font-medium text-red-600 transition-all hover:bg-red-100"
            >
              <LogOut size={22} />
              <span className="font-medium">Log Out</span>
            </button>
          </div>
        </nav>
      </aside>
    </>
  );
}
