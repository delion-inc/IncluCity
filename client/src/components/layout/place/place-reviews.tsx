"use client";

interface Review {
  author: string;
  rating: number;
  text: string;
}

export default function PlaceReviews() {
  const reviews: Review[] = [
    {
      author: "Олена К.",
      rating: 5,
      text: "Дуже зручне місце, чудово адаптоване для людей з обмеженими можливостями. Персонал дуже уважний.",
    },
    {
      author: "Ігор П.",
      rating: 3,
      text: "Пандус є, але розташований незручно. Туалет адаптований, але двері вузькі.",
    },
  ];

  return (
    <div>
      <h3 className="text-sm font-medium mb-2">Відгуки</h3>
      <div className="space-y-4">
        {reviews.map((review, index) => (
          <div key={index} className="p-3 bg-muted rounded-md">
            <div className="flex items-center space-x-1 mb-1">
              <div className="flex">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={`text-sm ${i < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                  >
                    ★
                  </span>
                ))}
              </div>
              <span className="text-xs text-muted-foreground">{review.author}</span>
            </div>
            <p className="text-sm">{review.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
