"use client";

import { Place } from "@/lib/types/place.types";
import { useReviewsByPlace } from "@/lib/hooks/use-reviews";
import ReviewForm from "./review-form";
import ReviewList from "./review-list";

interface ReviewSectionProps {
  place: Place;
}

export default function ReviewSection({ place }: ReviewSectionProps) {
  const { data: reviews, isLoading: isLoadingReviews } = useReviewsByPlace(place.id, {
    enabled: !!place,
    queryKey: ['reviews', 'byPlace', place.id]
  });

  return (
    <div>
      <h3 className="text-sm font-semibold mb-4">Відгуки</h3>
      
      {/* Форма для додавання відгуку */}
      <div className="mb-6 p-4 border rounded-lg bg-gray-50">
        <ReviewForm placeId={place.id} />
      </div>
      
      {/* Список відгуків */}
      <ReviewList reviews={reviews} isLoading={isLoadingReviews} />
    </div>
  );
} 