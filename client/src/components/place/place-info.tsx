"use client";

import { Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { uk } from "date-fns/locale";

import { Place } from "@/lib/types/place.types";

interface PlaceInfoProps {
  place: Place;
}

export default function PlaceInfo({ place }: PlaceInfoProps) {
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "d MMMM yyyy", { locale: uk });
  };

  return (
    <div>
      <h3 className="text-sm font-semibold mb-2">Інформація</h3>
      <div className="space-y-2 text-sm text-muted-foreground">
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4" />
          <span>Додано: {formatDate(place.createdAt)}</span>
        </div>
        <div className="flex items-center gap-2">
          <Clock className="h-4 w-4" />
          <span>Останнє оновлення: {formatDate(place.updatedAt)}</span>
        </div>
      </div>
    </div>
  );
}
