import Sidebar from "../components/Sidebar";
import { type ReactNode } from "react";

interface SidebarLayoutProps {
  children: ReactNode;
}

export default function SidebarLayout({ children }: SidebarLayoutProps) {
  return (
    <div className="flex min-h-screen bg-gray-100">
      <Sidebar />
      <main className="ml-64 flex-1 p-6">{children}</main>
    </div>
  );
}