"use client";

import { format } from "date-fns";
import { uk } from "date-fns/locale";
import { Star } from "lucide-react";

import { Review } from "@/lib/types/review.types";
import { cn } from "@/lib/utils";

interface ReviewListProps {
  reviews: Review[] | undefined;
  isLoading: boolean;
}

export default function ReviewList({ reviews, isLoading }: ReviewListProps) {
  const formatDate = (timestamp: number) => {
    return format(new Date(timestamp), "d MMMM yyyy", { locale: uk });
  };

  if (isLoading) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        <div className="animate-pulse">Завантаження відгуків...</div>
      </div>
    );
  }

  if (!reviews || reviews.length === 0) {
    return (
      <div className="text-center py-8 border rounded-lg text-muted-foreground bg-gray-50">
        <p className="mb-2 font-medium text-gray-700">Немає відгуків</p>
        <p className="text-sm">Будьте першим, хто залишить відгук про це місце</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {reviews.map((review) => (
        <div key={review.id} className="border rounded-lg p-4">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-2">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <Star
                    key={i}
                    className={cn(
                      "h-4 w-4",
                      i < review.rating ? "fill-primary text-primary" : "text-gray-300",
                    )}
                  />
                ))}
              </div>
              <span className="font-medium">
                {review.user.firstName} {review.user.lastName.charAt(0)}.
              </span>
            </div>
            <span className="text-xs text-muted-foreground">{formatDate(review.createdAt)}</span>
          </div>
          <p className="text-sm">{review.comment}</p>
        </div>
      ))}
    </div>
  );
}
