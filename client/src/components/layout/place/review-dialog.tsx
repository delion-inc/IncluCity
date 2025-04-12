"use client";

import { useState } from "react";
import { StarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";

export default function ReviewDialog({ onClose }: { onClose: () => void }) {
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const handleRatingChange = (newRating: number) => {
    setRating(newRating);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onClose();
  };

  return (
    <div className="p-4">
      <h2 className="text-lg font-semibold mb-4">Залишити відгук</h2>
      <Button
        className="w-full mb-4 bg-primary hover:bg-primary/90 text-white rounded-lg"
        variant="default"
      >
        Додати фото
      </Button>

      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="star-rating" className="block text-sm font-medium mb-1">
            Ваша оцінка
          </label>
          <input type="hidden" id="star-rating" name="star-rating" value={rating} />
          <div className="flex items-center">
            {[1, 2, 3, 4, 5].map((star) => (
              <button
                key={star}
                type="button"
                className="p-1"
                onClick={() => handleRatingChange(star)}
                onMouseEnter={() => setHoverRating(star)}
                onMouseLeave={() => setHoverRating(0)}
              >
                <StarIcon
                  className={`h-8 w-8 ${
                    star <= (hoverRating || rating)
                      ? "fill-yellow-400 text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              </button>
            ))}
          </div>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="accessibility">
            Оцініть доступність
          </label>
          <select
            id="accessibility"
            className="w-full rounded-md border-gray-300 py-2 pl-3 pr-10 text-sm focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
          >
            <option value="">Виберіть оцінку доступності</option>
            <option value="excellent">Відмінна доступність</option>
            <option value="good">Добра доступність</option>
            <option value="average">Середня доступність</option>
            <option value="poor">Погана доступність</option>
            <option value="inaccessible">Недоступно</option>
          </select>
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1" htmlFor="comment">
            Ваш коментар
          </label>
          <Textarea
            id="comment"
            placeholder="Опишіть ваші враження та досвід..."
            className="min-h-[100px] border-gray-300"
          />
        </div>

        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" className="border-gray-300" onClick={onClose}>
            Скасувати
          </Button>
          <Button type="submit" className="bg-primary hover:bg-primary/90 text-white">
            Відправити
          </Button>
        </div>
      </form>
    </div>
  );
}
