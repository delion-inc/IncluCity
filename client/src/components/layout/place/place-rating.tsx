"use client";

interface PlaceRatingProps {
  rating: number;
}

export default function PlaceRating({ rating }: PlaceRatingProps) {
  const normalizedRating = Math.min(Math.max(rating, 0), 5);

  return (
    <div className="mb-4">
      <div className="flex items-center space-x-1 mb-2">
        <h3 className="text-sm font-medium">Середній рейтинг:</h3>
        <div className="flex">
          {Array.from({ length: 5 }, (_, i) => (
            <span key={i} className={i < normalizedRating ? "text-yellow-400" : "text-gray-300"}>
              ★
            </span>
          ))}
        </div>
        <span className="text-sm">({normalizedRating.toFixed(1)})</span>
      </div>
    </div>
  );
}
