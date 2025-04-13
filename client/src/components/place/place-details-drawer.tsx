"use client";

import { Place } from "@/lib/types/place.types";
import { Drawer, DrawerContent, DrawerFooter } from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";

import PlaceHeader from "./place-header";
import PlaceCategory from "./place-category";
import PlaceAccessibility from "./place-accessibility";
import PlaceInfo from "./place-info";
import ReviewSection from "./review-section";

interface PlaceDetailsDrawerProps {
  place: Place | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function PlaceDetailsDrawer({ place, isOpen, onClose }: PlaceDetailsDrawerProps) {
  if (!place) return null;

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DrawerContent className="max-w-lg mx-auto rounded-t-lg">
        <div className="max-h-[80vh] overflow-y-auto overscroll-contain">
          <PlaceHeader place={place} onClose={onClose} />

          <div className="p-4 space-y-6 mb-16">
            <PlaceCategory place={place} />

            <PlaceAccessibility place={place} />

            <PlaceInfo place={place} />

            <ReviewSection place={place} />
          </div>
        </div>

        <DrawerFooter className="border-t bg-white z-10">
          <Button variant="outline" className="w-full cursor-pointer" onClick={onClose}>
            Закрити
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
