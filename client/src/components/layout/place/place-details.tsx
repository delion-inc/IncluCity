"use client";

import { X } from "lucide-react";
import { useEffect } from "react";

import { Button } from "@/components/ui/button";

import PlaceAccessibility from "./place-accessibility";
import PlaceRating from "./place-rating";
import PlaceReviews from "./place-reviews";
import ReviewDialog from "./review-dialog";

interface PlaceDetailsProps {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export default function PlaceDetails({ isOpen, onOpenChange }: PlaceDetailsProps) {
  useEffect(() => {
    if (!isOpen) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        onOpenChange(false);
      }
    };

    window.addEventListener("keydown", handleEscape);

    return () => window.removeEventListener("keydown", handleEscape);
  }, [isOpen, onOpenChange]);

  if (!isOpen) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-50 bg-black/50"
        role="presentation"
        onClick={() => onOpenChange(false)}
      />
      <div className="fixed z-50 inset-0 flex items-center justify-center p-4">
        <div
          className="w-full max-w-md max-h-[80vh] overflow-auto rounded-xl bg-white/95 backdrop-blur-sm shadow-xl border border-gray-200 transition-all animate-in fade-in-0 zoom-in-90"
          role="dialog"
          aria-modal="true"
          aria-labelledby="place-title"
        >
          <div className="sticky top-0 z-10 flex items-center justify-between p-4 border-b border-gray-200 bg-white/95 backdrop-blur-sm">
            <div>
              <h2 id="place-title" className="text-lg font-semibold">
                Кінотеатр &quot;Київ&quot;
              </h2>
              <p className="text-sm text-gray-500">вул. Велика Васильківська, 19</p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full hover:bg-gray-100"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
              <span className="sr-only">Закрити</span>
            </Button>
          </div>

          <div className="px-4 py-3">
            <PlaceAccessibility />
            <PlaceRating rating={4} />

            <ReviewDialog onClose={() => onOpenChange(false)} />

            <PlaceReviews />
          </div>
        </div>
      </div>
    </>
  );
}
