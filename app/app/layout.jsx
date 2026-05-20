"use client";
import { useState } from "react";
import { usePathname } from "next/navigation";
import AppSidebar from "@/components/shared/AppSidebar";
import BottomBar from "@/components/shared/BottomBar";
import TopBar from "@/components/shared/TopBar";
import PrivateRoute from "@/components/private/PrivateRoute";
import CreateButtons from "@/components/shared/CreateButtons";
import { useAppContext } from "@/context/context";

export default function Layout({ children }) {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const pathname = usePathname();
  const { uploadProgress } = useAppContext();

  return (
    <PrivateRoute>
      {/* Upload Progress Bar */}
      {uploadProgress > 0 && uploadProgress < 100 && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-secondary/10 backdrop-blur-sm">
          <div className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 h-1 bg-secondary/20 rounded-full overflow-hidden">
              <div
                className="h-full bg-secondary transition-all duration-300 ease-out"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
            <span className="text-sm font-medium text-secondary">{uploadProgress}%</span>
          </div>
        </div>
      )}
      <TopBar />
      <div className="flex min-h-screen bg-white">
        <AppSidebar
          isOpen={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
        />
        <main className="flex-1 min-h-screen bg-gray-50 md:ml-64 pb-16 md:pb-0">
          {children}
        </main>
      </div>
      <BottomBar onUserClick={() => setIsSidebarOpen((v) => !v)} />
      {pathname !== "/app/message" && <CreateButtons />}
    </PrivateRoute>
  );
}
