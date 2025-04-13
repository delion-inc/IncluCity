"use client";

import { MapPin, X } from "lucide-react";

import { Place } from "@/lib/types/place.types";
import { Button } from "@/components/ui/button";
import { DrawerClose, DrawerHeader, DrawerTitle, DrawerDescription } from "@/components/ui/drawer";

interface PlaceHeaderProps {
  place: Place;
  onClose: () => void;
}

export default function PlaceHeader({ place, onClose }: PlaceHeaderProps) {
  return (
    <DrawerHeader className="border-b pb-4 sticky top-0 bg-white z-10">
      <div className="flex items-center justify-between">
        <DrawerTitle className="text-xl">{place.name}</DrawerTitle>
        <DrawerClose asChild>
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-full cursor-pointer"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
        </DrawerClose>
      </div>
      <DrawerDescription className="mt-2">
        <div className="flex items-center gap-1.5 mt-1 text-muted-foreground">
          <MapPin className="h-4 w-4" />
          <span>{place.address}</span>
        </div>
      </DrawerDescription>
    </DrawerHeader>
  );
}
