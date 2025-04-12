"use client";

import { Accessibility, Hand, FileSpreadsheet, SquareAsterisk } from "lucide-react";

import { Place } from "@/lib/types/place.types";
import { cn } from "@/lib/utils";

interface PlaceAccessibilityProps {
  place: Place;
}

export default function PlaceAccessibility({ place }: PlaceAccessibilityProps) {
  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Доступність</h3>
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1 text-sm">
          <span>Рівень доступності:</span>
          <span className="font-medium">{Math.round(place.overallAccessibilityScore * 100)}%</span>
        </div>
        <div className="h-2.5 w-full bg-gray-100 rounded-full overflow-hidden">
          <div
            className="h-full bg-primary rounded-full"
            style={{ width: `${place.overallAccessibilityScore * 100}%` }}
          />
        </div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <div
          className={cn(
            "flex items-center p-3 rounded-md border",
            place.wheelchairAccessible
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 bg-gray-50 text-gray-400",
          )}
        >
          <Accessibility className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Доступно для інвалідних візків</span>
        </div>
        <div
          className={cn(
            "flex items-center p-3 rounded-md border",
            place.tactileElements
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 bg-gray-50 text-gray-400",
          )}
        >
          <Hand className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Тактильні елементи</span>
        </div>
        <div
          className={cn(
            "flex items-center p-3 rounded-md border",
            place.brailleSignage
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 bg-gray-50 text-gray-400",
          )}
        >
          <FileSpreadsheet className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Позначення шрифтом Брайля</span>
        </div>
        <div
          className={cn(
            "flex items-center p-3 rounded-md border",
            place.accessibleToilets
              ? "border-green-200 bg-green-50 text-green-700"
              : "border-gray-200 bg-gray-50 text-gray-400",
          )}
        >
          <SquareAsterisk className="h-5 w-5 mr-2 flex-shrink-0" />
          <span>Адаптовані туалети</span>
        </div>
      </div>
    </div>
  );
}
