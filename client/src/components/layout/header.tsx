"use client";

import Link from "next/link";
import { User, LogOut } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

import RouteDialog from "./route/route-dialog";
import { useAuth } from "@/lib/contexts/auth.context";

export default function Header() {
  const { isAuthenticated, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <header className="h-16 bg-white border-b border-gray-200 px-4 flex items-center justify-between fixed top-0 left-0 right-0 z-50">
      <div className="flex items-center">
        <Link href="/" className="text-2xl font-bold text-black">
          IncluSity
        </Link>
      </div>

      <div className="flex-1 max-w-md mx-4">
        <Input className="bg-white text-black border-gray-200" placeholder="Пошук місць..." />
      </div>

      <div className="flex items-center gap-2">
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
    </header>
  );
}
