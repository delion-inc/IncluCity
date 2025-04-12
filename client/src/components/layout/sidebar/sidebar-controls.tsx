"use client";

import { Sliders, FilterX } from "lucide-react";
import clsx from "clsx";

import { useFilters } from "@/lib/contexts/filter.context";
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
      size="lg"
      className="fixed top-24 left-4 z-40 rounded-xl shadow-lg px-4 py-6 bg-white/90 backdrop-blur-sm hover:bg-white border border-gray-200 hover:border-primary text-primary focus:outline-none focus-visible:bg-white/100 cursor-pointer"
      aria-label="Відкрити панель фільтрів"
      aria-expanded="false"
      aria-controls="sidebar-filters"
      onClick={onClick}
    >
      <Sliders className="h-5 w-5" aria-hidden="true" />
      <span>Фільтри</span>
    </Button>
  );
}

export function FilterControlButton() {
  const { selectedCategories, selectedAccessibility, clearFilters } = useFilters();

  const hasActiveFilters = selectedCategories.length > 0 || selectedAccessibility.length > 0;

  const activeFilterCount = selectedCategories.length + selectedAccessibility.length;
  const buttonAriaLabel = `Скинути всі фільтри${hasActiveFilters ? ` (${activeFilterCount} активних)` : ""}`;

  return (
    <Button
      variant="outline"
      className={clsx(
        "w-full justify-center py-2.5 focus:outline-none focus-visible:bg-primary/5",
        !hasActiveFilters && "opacity-50",
      )}
      disabled={!hasActiveFilters}
      aria-label={buttonAriaLabel}
      onClick={clearFilters}
    >
      <FilterX className="h-4 w-4 mr-2" aria-hidden="true" />
      <span>Скинути фільтри</span>
    </Button>
  );
}
