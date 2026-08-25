"use client";

import { useState } from "react";
import Sidebar from "@/app/admin/Components/Sidebar";
import Header from "@/app/admin/Components/Header";

export default function AdminLayout({ children }) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen bg-black text-white">
      
      {/* Sidebar */}
      <Sidebar
        collapsed={collapsed}
        setCollapsed={setCollapsed}
      />

      {/* Main Content */}
      <div
        className={`min-h-screen transition-all duration-300 ${
          collapsed ? "ml-20" : "ml-64"
        }`}
      >
        <Header />

        <main className="p-6">
          {children}
        </main>
      </div>
    </div>
  );
}