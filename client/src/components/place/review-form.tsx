"use client";

import { useState } from "react";
import { Star, Lock } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { useAuth } from "@/lib/contexts/auth.context";
import { useCreateReview, REVIEWS_QUERY_KEYS } from "@/lib/hooks/use-reviews";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface ReviewFormProps {
  placeId: number;
}

export default function ReviewForm({ placeId }: ReviewFormProps) {
  const { isAuthenticated } = useAuth();
  const [reviewRating, setReviewRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const queryClient = useQueryClient();

  const createReviewMutation = useCreateReview({
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: REVIEWS_QUERY_KEYS.byPlace(placeId),
      });

      setReviewRating(0);
      setReviewComment("");
      setIsSubmitting(false);

      setSuccessMessage("Відгук успішно додано");
      setErrorMessage("");

      setTimeout(() => {
        setSuccessMessage("");
      }, 3000);
    },
    onError: (error) => {
      setIsSubmitting(false);
      setErrorMessage(`Не вдалося додати відгук: ${error.message || "Невідома помилка"}`);
      setSuccessMessage("");
    },
  });

  const handleSubmitReview = async () => {
    if (!reviewRating) {
      setErrorMessage("Будь ласка, виберіть оцінку");

      return;
    }

    setErrorMessage("");
    setSuccessMessage("");
    setIsSubmitting(true);

    await createReviewMutation.mutate({
      placeId,
      rating: reviewRating,
      comment: reviewComment.trim() || "Без коментаря",
    });
  };

  if (!isAuthenticated) {
    return (
      <div className="text-center py-4">
        <div className="flex justify-center mb-3">
          <Lock className="h-8 w-8 text-muted-foreground" />
        </div>
        <h4 className="font-medium mb-2">Увійдіть, щоб залишити відгук</h4>
        <p className="text-sm text-muted-foreground mb-4">
          Щоб залишити відгук, вам потрібно авторизуватися
        </p>
        <div className="flex gap-2 justify-center">
          <Button asChild variant="outline">
            <Link href="/login">Увійти</Link>
          </Button>
          <Button asChild>
            <Link href="/register">Зареєструватися</Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <>
      <h4 className="font-medium mb-3">Залишити відгук</h4>

      {successMessage && (
        <Alert className="mb-3 bg-green-50 text-green-800 border-green-200">
          <AlertDescription>{successMessage}</AlertDescription>
        </Alert>
      )}

      {errorMessage && (
        <Alert variant="destructive" className="mb-3">
          <AlertDescription>{errorMessage}</AlertDescription>
        </Alert>
      )}

      <div className="mb-3">
        <label htmlFor="review-rating" className="block text-sm mb-1">
          Ваша оцінка
        </label>
        <div className="flex">
          {[1, 2, 3, 4, 5].map((rating) => (
            <button
              key={rating}
              type="button"
              id={rating === 1 ? "review-rating" : undefined}
              className="p-1"
              disabled={isSubmitting}
              onClick={() => setReviewRating(rating)}
              onMouseEnter={() => setHoveredRating(rating)}
              onMouseLeave={() => setHoveredRating(0)}
            >
              <Star
                className={cn(
                  "h-6 w-6",
                  (hoveredRating || reviewRating) >= rating
                    ? "fill-primary text-primary"
                    : "text-gray-300",
                )}
              />
            </button>
          ))}
        </div>
      </div>

      <div className="mb-3">
        <label className="block text-sm mb-1" htmlFor="review-comment">
          Ваш коментар
        </label>
        <Textarea
          id="review-comment"
          placeholder="Поділіться вашими враженнями про це місце..."
          value={reviewComment}
          className="min-h-[100px]"
          disabled={isSubmitting}
          onChange={(e) => setReviewComment(e.target.value)}
        />
      </div>

      <Button
        className="w-full cursor-pointer"
        disabled={!reviewRating || isSubmitting}
        onClick={handleSubmitReview}
      >
        {isSubmitting ? "Відправка..." : "Відправити відгук"}
      </Button>
    </>
  );
}
