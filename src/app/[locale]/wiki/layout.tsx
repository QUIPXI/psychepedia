"use client";

import * as React from "react";
import { useLocale } from "next-intl";
import { Sidebar } from "@/components/layout/Sidebar";

export default function WikiLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [sidebarOpen, setSidebarOpen] = React.useState(false);
  const locale = useLocale();

  return (
    <div className="flex-1 flex">
      <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      {/* Main content area */}
      <div className={`flex-1 ${locale === "ar" ? "md:me-72" : "md:ms-72"}`}>
        <main className="min-h-[calc(100vh-4rem)]">{children}</main>
      </div>
    </div>
  );
}
