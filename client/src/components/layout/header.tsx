"use client";

import Link from "next/link";

import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import LoginDialog from "./auth/login-dialog";
import RouteDialog from "./route/route-dialog";

interface HeaderProps {
  isLoggedIn: boolean;
}

export default function Header({ isLoggedIn }: HeaderProps) {
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

        {isLoggedIn ? (
          <Avatar>
            <AvatarImage src="/avatar.png" alt="@user" />
            <AvatarFallback>КО</AvatarFallback>
          </Avatar>
        ) : (
          <LoginDialog />
        )}
      </div>
    </header>
  );
}
