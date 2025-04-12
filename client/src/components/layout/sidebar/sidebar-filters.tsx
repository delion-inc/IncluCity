"use client";

import { Checkbox } from "@/components/ui/checkbox";

export default function SidebarFilters() {
  const categories = [
    { id: "cinema", label: "Кінотеатри 🎬" },
    { id: "cafe", label: "Кафе ☕" },
    { id: "library", label: "Бібліотеки 📚" },
    { id: "transport", label: "Транспорт 🚍" },
  ];

  const accessibilityFeatures = [
    { id: "ramp", label: "Пандус" },
    { id: "tactile", label: "Тактильна плитка" },
    { id: "subtitles", label: "Субтитри" },
    { id: "braille", label: "Брайль" },
    { id: "adapted-toilets", label: "Адаптовані туалети" },
  ];

  return (
    <>
      <div className="mb-6">
        <h3 className="font-medium mb-2">Категорії</h3>
        <div className="space-y-2">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-2">
              <Checkbox id={category.id} />
              <label
                htmlFor={category.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {category.label}
              </label>
            </div>
          ))}
        </div>
      </div>

      <div className="mb-6">
        <h3 className="font-medium mb-2">Характеристики доступності</h3>
        <div className="space-y-2">
          {accessibilityFeatures.map((feature) => (
            <div key={feature.id} className="flex items-center space-x-2">
              <Checkbox id={feature.id} />
              <label
                htmlFor={feature.id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {feature.label}
              </label>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}
