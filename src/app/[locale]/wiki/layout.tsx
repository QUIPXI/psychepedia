"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Sidebar } from "@/components/layout/Sidebar";
import { useLocalStorage } from "@/lib/hooks";

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const [isCollapsed, setIsCollapsed] = useLocalStorage("psychepedia-sidebar-collapsed", false);
  const locale = useLocale();

  return (
    <div className="flex-1 flex">
      <Sidebar
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
      />

      {/* Main content area */}
      <div className={`flex-1 transition-all duration-300 ease-in-out ${locale === "ar"
          ? (isCollapsed ? "md:me-16" : "md:me-72")
          : (isCollapsed ? "md:ms-16" : "md:ms-72")
        }`}>
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
