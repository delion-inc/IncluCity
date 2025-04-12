"use client";

import { createContext, useContext, useState, ReactNode } from "react";

import { PlaceCategory, AccessibilityFeature } from "@/lib/types/place.types";

interface FilterContextType {
  selectedCategories: PlaceCategory[];
  selectedAccessibility: AccessibilityFeature[];
  setSelectedCategories: (categories: PlaceCategory[]) => void;
  setSelectedAccessibility: (features: AccessibilityFeature[]) => void;
  clearFilters: () => void;
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

  const clearFilters = () => {
    setSelectedCategories([]);
    setSelectedAccessibility([]);
  };

  return (
    <FilterContext.Provider
      value={{
        selectedCategories,
        selectedAccessibility,
        setSelectedCategories,
        setSelectedAccessibility,
        clearFilters,
      }}
    >
      {children}
    </FilterContext.Provider>
  );
}
