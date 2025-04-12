"use client";

import { Sliders } from "lucide-react";

import { Button } from "@/components/ui/button";

interface SidebarToggleProps {
  onClick: () => void;
  isCollapsed: boolean;
}

export function SidebarToggle({ onClick, isCollapsed }: SidebarToggleProps) {
  if (!isCollapsed) return null;

  return (
    <Button
      variant="secondary"
      size="sm"
      className="fixed top-24 left-4 z-40 rounded-full shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 text-primary"
      onClick={onClick}
    >
      <Sliders className="h-5 w-5 mr-2" />
      <span>Фільтри</span>
    </Button>
  );
}

export function FilterApplyButton() {
  return (
    <Button className="w-full bg-primary hover:bg-primary/90 text-white">
      Застосувати фільтри
    </Button>
  );
}
