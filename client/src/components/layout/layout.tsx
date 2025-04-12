/* eslint-disable @typescript-eslint/no-unused-vars */
"use client";

import { useState } from "react";
import Link from "next/link";
import { Search, MapPin } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import Sidebar from "./sidebar/sidebar";
import PlaceDetails from "./place/place-details";
import LoginDialog from "./auth/login-dialog";
import RouteDialog from "./route/route-dialog";

export default function Layout({ children }: { children: React.ReactNode }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isPlaceDetailsOpen, setIsPlaceDetailsOpen] = useState(false);
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);

  const handleSidebarCollapsedChange = (collapsed: boolean) => {
    setIsSidebarCollapsed(collapsed);
  };

  return (
    <div className="fixed inset-0 overflow-hidden">
      <main className="absolute inset-0">{children}</main>

      <Link
        href="/"
        className="fixed top-4 left-4 z-40 px-4 py-2 bg-white/90 backdrop-blur-sm shadow-lg rounded-lg border border-gray-200"
      >
        <span className="font-bold text-xl text-primary">IncluSity</span>
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

        {isLoggedIn ? (
          <Avatar className="h-12 w-12 shadow-lg border border-gray-200">
            <AvatarImage src="/avatar.png" alt="@user" />
            <AvatarFallback className="bg-white/90 backdrop-blur-sm">КО</AvatarFallback>
          </Avatar>
        ) : (
          <LoginDialog />
        )}
      </div>

      <Sidebar onCollapsedChange={handleSidebarCollapsedChange} />

      <Button
        className="fixed bottom-4 right-4 z-40 rounded-full px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white shadow-lg border border-gray-200 text-primary"
        onClick={() => setIsPlaceDetailsOpen(true)}
      >
        <MapPin className="h-5 w-5 mr-2" />
        <span>Деталі місця</span>
      </Button>

      <PlaceDetails isOpen={isPlaceDetailsOpen} onOpenChange={setIsPlaceDetailsOpen} />
    </div>
  );
}
