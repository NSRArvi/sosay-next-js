import {
  Home,
  Users,
  Store,
  Video,
  Bell,
  User,
  MessageCircle,
  Search,
  Layers,
} from "lucide-react";
import clsx from "clsx";
import Link from "next/link";
import { useAppContext } from "@/context/context";
import logo from "../../app/assets/logo/logo.png";
import Image from "next/image";

export default function TopBar() {
  const { pathname } = useAppContext();

  const middleItems = [
    { name: "Home", icon: Home, href: "/app" },
    { name: "Reels", icon: Video, href: "/app/reels" },
    { name: "Shop", icon: Store, href: "/app/shop" },
    { name: "Friends", icon: Users, href: "/app/friends" },
    { name: "Pages", icon: Layers, href: "/app/pages" },
  ];

  const endItems = [
    { name: "Search", icon: Search, href: "/app/search" },
    { name: "Message", icon: MessageCircle, href: "/app/message" },
    { name: "Notifications", icon: Bell, href: "/app/notifications" },
  ];

  const isMessageRoute = pathname?.startsWith("/app/message");

  return (
    <section
      className={clsx(
        "flex justify-between items-center text-gray-700 fixed top-0 z-40 w-full bg-white md:hidden",
      )}
    >
      {/* brand logo  */}
      <div className="pl-2">
        <Image src={logo} alt="Sosay Logo" width={100} height={100} />
      </div>

      {/* middle menus  */}
      {/* <div className="hidden md:flex flex-1 ">
        <div className="min-w-full xl:min-w-2xl mx-auto flex justify-around gap-5">
          {middleItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.name}
                href={item.href}
                className={clsx(
                  "flex flex-col items-center text-xs transition-all py-2 px-3 rounded-lg",
                  pathname === item.href
                    ? "text-secondary bg-blue-50"
                    : "text-gray-500 hover:text-secondary hover:bg-gray-50"
                )}
              >
                <Icon size={24} strokeWidth={pathname === item.href ? 2.5 : 2} />
              </Link>
            );
          })}
        </div>
      </div> */}

      {/* right menus  */}
      <div className="px-5 py-2 flex justify-around gap-2">
        {endItems.map((item) => {
          const Icon = item.icon;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={clsx(
                "flex flex-col items-center text-xs transition-all py-2 px-3 rounded-lg",
                pathname === item.href
                  ? "text-secondary bg-blue-50"
                  : "text-gray-500 hover:text-secondary hover:bg-gray-50",
              )}
            >
              <Icon size={24} strokeWidth={pathname === item.href ? 2.5 : 2} />
            </Link>
          );
        })}
      </div>
    </section>
  );
}
