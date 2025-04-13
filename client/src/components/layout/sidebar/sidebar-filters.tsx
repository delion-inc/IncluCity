"use client";

import { useState, KeyboardEvent } from "react";
import {
  ChevronRight,
  Coffee,
  Utensils,
  Film,
  Library,
  Bus,
  ShoppingCart,
  Stethoscope,
  GraduationCap,
  Trophy,
  Ticket,
  Landmark,
  Users,
  PaintBucket,
  Trees,
  HelpCircle,
  Accessibility,
  Hand,
  FileSpreadsheet,
  SquareAsterisk,
} from "lucide-react";

import { Checkbox } from "@/components/ui/checkbox";
import { PlaceCategory, AccessibilityFeature } from "@/lib/types/place.types";
import { useFilters } from "@/lib/contexts/filter.context";

export default function SidebarFilters() {
  const {
    selectedCategories,
    selectedAccessibility,
    setSelectedCategories,
    setSelectedAccessibility,
  } = useFilters();

  const [categoriesExpanded, setCategoriesExpanded] = useState(true);
  const [accessibilityExpanded, setAccessibilityExpanded] = useState(true);

  const categories = [
    {
      id: PlaceCategory.CAFE,
      label: "Кафе",
      icon: <Coffee className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.RESTAURANT,
      label: "Ресторани",
      icon: <Utensils className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.CINEMA,
      label: "Кінотеатри",
      icon: <Film className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.LIBRARY,
      label: "Бібліотеки",
      icon: <Library className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.TRANSPORT,
      label: "Транспорт",
      icon: <Bus className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.SHOP,
      label: "Магазини",
      icon: <ShoppingCart className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.MEDICAL,
      label: "Медичні заклади",
      icon: <Stethoscope className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.EDUCATION,
      label: "Освітні заклади",
      icon: <GraduationCap className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.SPORT,
      label: "Спортивні об'єкти",
      icon: <Trophy className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.ENTERTAINMENT,
      label: "Розваги",
      icon: <Ticket className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.GOVERNMENT,
      label: "Державні установи",
      icon: <Landmark className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.COMMUNITY_CENTER,
      label: "Громадські центри",
      icon: <Users className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.CULTURAL_CENTER,
      label: "Культурні центри",
      icon: <PaintBucket className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.PARK,
      label: "Парки",
      icon: <Trees className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: PlaceCategory.OTHER,
      label: "Інше",
      icon: <HelpCircle className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  const accessibilityFeatures = [
    {
      id: AccessibilityFeature.WHEELCHAIR_ACCESSIBLE,
      label: "Інвалідні візки",
      icon: <Accessibility className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: AccessibilityFeature.TACTILE_ELEMENTS,
      label: "Тактильні елементи",
      icon: <Hand className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: AccessibilityFeature.BRAILLE_SIGNAGE,
      label: "Позначення шрифтом Брайля",
      icon: <FileSpreadsheet className="h-4 w-4" aria-hidden="true" />,
    },
    {
      id: AccessibilityFeature.ACCESSIBLE_TOILETS,
      label: "Адаптовані туалети",
      icon: <SquareAsterisk className="h-4 w-4" aria-hidden="true" />,
    },
  ];

  const handleCategoryChange = (category: PlaceCategory, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter((c) => c !== category));
    }
  };

  const handleAccessibilityChange = (feature: AccessibilityFeature, checked: boolean) => {
    if (checked) {
      setSelectedAccessibility([...selectedAccessibility, feature]);
    } else {
      setSelectedAccessibility(selectedAccessibility.filter((f) => f !== feature));
    }
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLButtonElement>, toggleFn: () => void) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggleFn();
    }
  };

  return (
    <div className="space-y-5 px-2 flex flex-col h-full" role="region" aria-label="Фільтри">
      <div className="flex-1 space-y-5 overflow-y-auto custom-scrollbar pb-3 pr-1">
        <div className="mb-5">
          <h2 id="accessibility-heading" className="sr-only">
            Фільтри доступності
          </h2>
          <button
            className="flex items-center justify-between w-full font-medium py-2.5 cursor-pointer transition-colors hover:text-primary rounded-md px-3 focus:outline-none focus-visible:bg-primary/5"
            aria-expanded={accessibilityExpanded}
            aria-controls="accessibility-options"
            aria-labelledby="accessibility-heading"
            onKeyDown={(e) =>
              handleKeyDown(e, () => setAccessibilityExpanded(!accessibilityExpanded))
            }
            onClick={() => setAccessibilityExpanded(!accessibilityExpanded)}
          >
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-5 h-5 mr-2.5 transition-transform duration-300 ease-out ${accessibilityExpanded ? "rotate-90" : "rotate-0"}`}
                aria-hidden="true"
              >
                <ChevronRight className="w-5 h-5 text-primary/70" />
              </div>
              <span>Доступність</span>
            </div>
            {selectedAccessibility.length > 0 && (
              <span
                className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold"
                aria-label={`Вибрано ${selectedAccessibility.length} опцій`}
              >
                {selectedAccessibility.length}
              </span>
            )}
          </button>

          <div
            id="accessibility-options"
            className={`mt-1 overflow-hidden transition-all duration-300 ease-out ${accessibilityExpanded ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}
            role="group"
            aria-labelledby="accessibility-heading"
          >
            <div className="space-y-1">
              {accessibilityFeatures.map((feature) => (
                <div
                  key={feature.id}
                  className="flex items-center justify-between group hover:bg-primary/5 rounded-md p-2.5 transition-colors"
                >
                  <div className="flex items-center space-x-2.5">
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={selectedAccessibility.includes(feature.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:ring-primary focus-visible:ring-offset-2"
                      aria-describedby={`feature-desc-${feature.id}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleAccessibilityChange(
                            feature.id,
                            !selectedAccessibility.includes(feature.id),
                          );
                        }
                      }}
                      onCheckedChange={(checked) =>
                        handleAccessibilityChange(feature.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`feature-${feature.id}`}
                      className="text-sm leading-none transition-colors cursor-pointer"
                      id={`feature-desc-${feature.id}`}
                    >
                      {feature.label}
                    </label>
                  </div>
                  <div
                    className="text-gray-500 group-hover:text-gray-700 transition-colors pl-2"
                    aria-hidden="true"
                  >
                    {feature.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mb-5">
          <h2 id="categories-heading" className="sr-only">
            Категорії місць
          </h2>
          <button
            className="flex items-center justify-between w-full font-medium py-2.5 cursor-pointer transition-colors hover:text-primary rounded-md px-3 focus:outline-none focus-visible:bg-primary/5"
            aria-expanded={categoriesExpanded}
            aria-controls="categories-options"
            aria-labelledby="categories-heading"
            onClick={() => setCategoriesExpanded(!categoriesExpanded)}
            onKeyDown={(e) => handleKeyDown(e, () => setCategoriesExpanded(!categoriesExpanded))}
          >
            <div className="flex items-center">
              <div
                className={`flex items-center justify-center w-5 h-5 mr-2.5 transition-transform duration-300 ease-out ${categoriesExpanded ? "rotate-90" : "rotate-0"}`}
                aria-hidden="true"
              >
                <ChevronRight className="w-5 h-5 text-primary/70" />
              </div>
              <span>Категорії</span>
            </div>
            {selectedCategories.length > 0 && (
              <span
                className="ml-1 text-xs bg-primary/10 text-primary rounded-full px-2 py-0.5 font-semibold"
                aria-label={`Вибрано ${selectedCategories.length} категорій`}
              >
                {selectedCategories.length}
              </span>
            )}
          </button>

          <div
            id="categories-options"
            className={`mt-1 overflow-hidden transition-all duration-300 ease-out ${categoriesExpanded ? "max-h-80 opacity-100" : "max-h-0 opacity-0"}`}
            role="group"
            aria-labelledby="categories-heading"
          >
            <div className="space-y-1 max-h-64 overflow-y-auto pr-1 custom-scrollbar">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="flex items-center justify-between group hover:bg-primary/5 rounded-md p-2.5 transition-colors cursor-pointer"
                >
                  <div className="flex items-center space-x-2.5">
                    <Checkbox
                      id={`category-${category.id}`}
                      checked={selectedCategories.includes(category.id)}
                      className="data-[state=checked]:bg-primary data-[state=checked]:border-primary focus-visible:ring-primary focus-visible:ring-offset-2"
                      aria-describedby={`category-desc-${category.id}`}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") {
                          e.preventDefault();
                          handleCategoryChange(
                            category.id,
                            !selectedCategories.includes(category.id),
                          );
                        }
                      }}
                      onCheckedChange={(checked) =>
                        handleCategoryChange(category.id, checked === true)
                      }
                    />
                    <label
                      htmlFor={`category-${category.id}`}
                      className="text-sm leading-none transition-colors cursor-pointer"
                      id={`category-desc-${category.id}`}
                    >
                      {category.label}
                    </label>
                  </div>
                  <div
                    className="text-gray-500 group-hover:text-gray-700 transition-colors pl-2"
                    aria-hidden="true"
                  >
                    {category.icon}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
