"use client";

export default function PlaceAccessibility() {
  const features = [
    { name: "Пандус", available: true },
    { name: "Тактильна плитка", available: true },
    { name: "Субтитри", available: true },
    { name: "Брайль", available: false },
    { name: "Адаптовані туалети", available: true },
  ];

  return (
    <div className="mb-4">
      <h3 className="text-sm font-medium mb-2">Характеристики доступності</h3>
      <div className="grid grid-cols-2 gap-2">
        {features.map((feature, index) => (
          <div key={index} className="flex items-center space-x-2">
            <span className={feature.available ? "text-green-500" : "text-red-500"}>
              {feature.available ? "✓" : "✗"}
            </span>
            <span className="text-sm">{feature.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
