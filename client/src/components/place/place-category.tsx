"use client";

import { Place } from "@/lib/types/place.types";
import { categoryConfig } from "../map/map-place-popup";

interface PlaceCategoryProps {
  place: Place;
}

export default function PlaceCategory({ place }: PlaceCategoryProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Категорія</h3>
      <div className="flex items-center gap-2 text-primary">
        {categoryConfig[place.category]?.icon || <div className="h-5 w-5" />}
        <span>{categoryConfig[place.category]?.label || place.category}</span>
      </div>
    </div>
  );
} 