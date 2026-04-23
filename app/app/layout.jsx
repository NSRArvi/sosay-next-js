"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "@/components/shared/AppSidebar";
import BottomBar from "@/components/shared/BottomBar";
import TopBar from "@/components/shared/TopBar";
// import SuggestionList from "@/components/feed/SuggestionList";
import PrivateRoute from "@/components/private/PrivateRoute";
import CreateButtons from "@/components/shared/CreateButtons";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();

  return (
    <PrivateRoute>
      <TopBar />
      <div className="flex min-h-screen bg-white">
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 min-h-screen bg-gray-50 md:ml-64 pb-16 md:pb-0">
          {children}
        </main>
        {/* <div className="hidden xl:block xl:w-72 p-5 mt-14 bg-gray-50">
          <SuggestionList />
        </div> */}
      </div>
      <BottomBar onUserClick={() => setIsSidebarOpen((v) => !v)} />
      {pathname !== "/app/message" && <CreateButtons />}
    </PrivateRoute>
  );
}
