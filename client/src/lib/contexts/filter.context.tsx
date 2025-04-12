"use client";

import { createContext, useContext, useState, ReactNode, useMemo, useCallback } from "react";

import { PlaceCategory, AccessibilityFeature } from "@/lib/types/place.types";

interface FilterContextType {
  selectedCategories: PlaceCategory[];
  selectedAccessibility: AccessibilityFeature[];
  setSelectedCategories: (categories: PlaceCategory[]) => void;
  setSelectedAccessibility: (features: AccessibilityFeature[]) => void;
  clearFilters: () => void;
  isFiltersActive: boolean;
}

const FilterContext = createContext<FilterContextType | undefined>(undefined);

export function useFilters() {
  const context = useContext(FilterContext);

  if (context === undefined) {
    throw new Error("useFilters must be used within a FilterProvider");
  }

  return context;
}

export function FilterProvider({ children }: { children: ReactNode }) {
  const [selectedCategories, setSelectedCategories] = useState<PlaceCategory[]>([]);
  const [selectedAccessibility, setSelectedAccessibility] = useState<AccessibilityFeature[]>([]);

  const clearFilters = useCallback(() => {
    setSelectedCategories([]);
    setSelectedAccessibility([]);
  }, []);

  const isFiltersActive = useMemo(() => {
    return selectedCategories.length > 0 || selectedAccessibility.length > 0;
  }, [selectedCategories.length, selectedAccessibility.length]);

  const contextValue = useMemo(
    () => ({
      selectedCategories,
      selectedAccessibility,
      setSelectedCategories,
      setSelectedAccessibility,
      clearFilters,
      isFiltersActive,
    }),
    [selectedCategories, selectedAccessibility, clearFilters, isFiltersActive],
  );

  return <FilterContext.Provider value={contextValue}>{children}</FilterContext.Provider>;
}
