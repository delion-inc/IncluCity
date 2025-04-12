/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useEffect, useState } from "react";
import { Search, MapPin, User, LogOut } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Sidebar from "./sidebar/sidebar";
import RouteDialog from "./route/route-dialog";
import { useAuth } from "@/lib/contexts/auth.context";

export default function Layout({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, logout } = useAuth();
  const [isPlaceDetailsOpen, setIsPlaceDetailsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };
  
  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <main className="absolute inset-0">{children}</main>

      <Link
        href="/"
        className="fixed top-4 left-4 z-40 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg border border-gray-200"
      >
        <span className=" text-xl text-primary">IncluSity</span>
      </Link>

      <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 w-full max-w-md px-4">
        <div className="relative">
          <Input
            className="pl-10 pr-4 py-2 h-12 bg-white/90 backdrop-blur-sm shadow-lg border border-gray-200 rounded-full"
            placeholder="Пошук місць..."
          />
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-500" />
        </div>
      </div>

      <div className="fixed top-4 right-4 z-40 flex gap-2">
        <RouteDialog />

        {isAuthenticated ? (
          <Button
            variant="secondary"
            size="lg"
            className="rounded-xl shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-red-500 text-red-500"
            aria-label="Вийти"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5 mr-2" aria-hidden="true" />
            <span>Вийти</span>
          </Button>
        ) : (
          <Link href="/login">
            <Button
              variant="secondary"
              size="lg"
              className="rounded-xl shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-primary text-primary"
              aria-label="Увійти"
            >
              <User className="h-5 w-5 mr-2" aria-hidden="true" />
              <span>Увійти</span>
            </Button>
          </Link>
        )}
      </div>

      <Sidebar onCollapsedChange={handleSidebarCollapsedChange} />

    </div>
  );
}
