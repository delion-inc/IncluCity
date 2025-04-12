"use client";

import { useState, useEffect } from "react";
import { ChevronLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

import SidebarFilters from "./sidebar-filters";
import { SidebarToggle, FilterApplyButton } from "./sidebar-controls";

interface SidebarProps {
  onCollapsedChange?: (collapsed: boolean) => void;
}

export default function Sidebar({ onCollapsedChange }: SidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);

  const toggleSidebar = () => {
    const newState = !isCollapsed;

    setIsCollapsed(newState);
    onCollapsedChange?.(newState);
  };

  useEffect(() => {
    onCollapsedChange?.(isCollapsed);
  }, [isCollapsed, onCollapsedChange]);

  return (
    <>
      <SidebarToggle isCollapsed={isCollapsed} onClick={toggleSidebar} />

      <aside
        className={cn(
          "fixed left-4 top-24 rounded-xl bg-white/90 backdrop-blur-sm shadow-lg transition-all duration-300 border border-gray-200 z-40",
          isCollapsed ? "w-0 opacity-0 invisible" : "w-72 opacity-100",
        )}
      >
        <div className="flex flex-col h-[calc(100vh-8rem)] max-h-[600px]">
          <div className="flex items-center justify-between p-4 border-b border-gray-200">
            <h2 className="font-semibold text-lg">Фільтри</h2>
            <Button
              variant="ghost"
              size="icon"
              className="hover:bg-gray-100"
              onClick={toggleSidebar}
            >
              <ChevronLeft className="h-5 w-5 text-primary" />
            </Button>
          </div>

          <div className="flex-1 overflow-y-auto px-4 py-3">
            <SidebarFilters />
          </div>

          <div className="p-4 border-t border-gray-200">
            <FilterApplyButton />
          </div>
        </div>
      </aside>
    </>
  );
}
