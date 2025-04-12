import {
  Accessibility,
  Hand,
  FileSpreadsheet,
  SquareAsterisk,
  ArrowRight,
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
} from "lucide-react";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { PlaceCategory } from "@/lib/types/place.types";
import { Place } from "@/lib/types/place.types";

// Мапування категорій та їх іконок
export const categoryConfig = {
  [PlaceCategory.CAFE]: { label: "Кафе", icon: <Coffee className="h-4 w-4" /> },
  [PlaceCategory.RESTAURANT]: { label: "Ресторани", icon: <Utensils className="h-4 w-4" /> },
  [PlaceCategory.CINEMA]: { label: "Кінотеатри", icon: <Film className="h-4 w-4" /> },
  [PlaceCategory.LIBRARY]: { label: "Бібліотеки", icon: <Library className="h-4 w-4" /> },
  [PlaceCategory.TRANSPORT]: { label: "Транспорт", icon: <Bus className="h-4 w-4" /> },
  [PlaceCategory.SHOP]: { label: "Магазини", icon: <ShoppingCart className="h-4 w-4" /> },
  [PlaceCategory.MEDICAL]: { label: "Медичні заклади", icon: <Stethoscope className="h-4 w-4" /> },
  [PlaceCategory.EDUCATION]: {
    label: "Освітні заклади",
    icon: <GraduationCap className="h-4 w-4" />,
  },
  [PlaceCategory.SPORT]: { label: "Спортивні об'єкти", icon: <Trophy className="h-4 w-4" /> },
  [PlaceCategory.ENTERTAINMENT]: { label: "Розваги", icon: <Ticket className="h-4 w-4" /> },
  [PlaceCategory.GOVERNMENT]: {
    label: "Державні установи",
    icon: <Landmark className="h-4 w-4" />,
  },
  [PlaceCategory.COMMUNITY_CENTER]: {
    label: "Громадські центри",
    icon: <Users className="h-4 w-4" />,
  },
  [PlaceCategory.CULTURAL_CENTER]: {
    label: "Культурні центри",
    icon: <PaintBucket className="h-4 w-4" />,
  },
  [PlaceCategory.PARK]: { label: "Парки", icon: <Trees className="h-4 w-4" /> },
  [PlaceCategory.OTHER]: { label: "Інше", icon: <HelpCircle className="h-4 w-4" /> },
};

interface MapPlacePopupProps {
  place: Place;
}

export default function MapPlacePopup({ place }: MapPlacePopupProps) {
  return (
    <Card className="border-0 shadow-none p-0" style={{ width: "280px", maxWidth: "100%" }}>
      <CardHeader className="p-3 pb-2">
        <CardTitle className="text-base font-semibold">{place.name}</CardTitle>
        <CardDescription className="text-xs mt-1">{place.address}</CardDescription>
      </CardHeader>
      <CardContent className="p-3 pt-0 space-y-3">
        <div>
          <div className="text-xs text-muted-foreground mb-1 flex justify-between">
            <span>Доступність:</span>
            <span className="font-medium">
              {Math.round(place.overallAccessibilityScore * 100)}%
            </span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full bg-primary rounded-full"
              style={{ width: `${place.overallAccessibilityScore * 100}%` }}
            />
          </div>
          <div className="grid grid-cols-2 gap-x-2 gap-y-1.5 mt-3">
            <div
              className={cn(
                "flex items-center gap-1",
                place.wheelchairAccessible ? "text-primary" : "text-gray-400",
              )}
            >
              <Accessibility className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-[11px]">Інвалідні візки</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1",
                place.tactileElements ? "text-primary" : "text-gray-400",
              )}
            >
              <Hand className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-[11px]">Тактильні елементи</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1",
                place.brailleSignage ? "text-primary" : "text-gray-400",
              )}
            >
              <FileSpreadsheet className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-[11px]">Шрифт Брайля</span>
            </div>
            <div
              className={cn(
                "flex items-center gap-1",
                place.accessibleToilets ? "text-primary" : "text-gray-400",
              )}
            >
              <SquareAsterisk className="h-3.5 w-3.5 flex-shrink-0" />
              <span className="text-[11px]">Адаптовані туалети</span>
            </div>
          </div>
        </div>

        <div className="text-xs">
          <div className="flex items-center gap-1.5 mb-2">
            <span className="font-medium mr-1">Категорія:</span>
            <div className="flex items-center gap-1 text-primary">
              {categoryConfig[place.category]?.icon || <HelpCircle className="h-4 w-4" />}
              <span>{categoryConfig[place.category]?.label || place.category}</span>
            </div>
          </div>
        </div>

        <Button
          variant="default"
          size="sm"
          className="w-full mt-2 text-xs"
          onClick={() => (window.location.href = `/places/${place.id}`)}
        >
          Деталі
          <ArrowRight className="h-3 w-3 ml-1" />
        </Button>
      </CardContent>
    </Card>
  );
}
