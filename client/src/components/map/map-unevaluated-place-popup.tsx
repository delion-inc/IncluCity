import { useState } from "react";
import { MapPin, ArrowRight } from "lucide-react";
import dynamic from "next/dynamic";

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { PlaceSearchResult } from "@/lib/types/place.types";
import { usePlaceById } from "@/lib/hooks/use-places";

import PlaceApplicationDrawer from "../place/place-application-drawer";

const PlaceDetailsDrawer = dynamic(() => import("../place/place-details-drawer"), {
  ssr: false,
  loading: () => null,
});

interface MapUnevaluatedPlacePopupProps {
  place: PlaceSearchResult;
}

export default function MapUnevaluatedPlacePopup({ place }: MapUnevaluatedPlacePopupProps) {
  const [isApplicationDrawerOpen, setIsApplicationDrawerOpen] = useState(false);
  const [isDetailsDrawerOpen, setIsDetailsDrawerOpen] = useState(false);

  const isExistingPlace = !!place.placeId;

  const { data: placeDetails, isLoading: isPlaceLoading } = usePlaceById(place.placeId || 0);

  const handleSubmitClick = () => {
    setIsApplicationDrawerOpen(true);
  };

  const handleDetailsClick = () => {
    setIsDetailsDrawerOpen(true);
  };

  return (
    <>
      <Card className="border-0 shadow-none p-0" style={{ width: "280px", maxWidth: "100%" }}>
        <CardHeader className="p-3 pb-2">
          <CardTitle className="text-base font-semibold">{place.name}</CardTitle>
          <CardDescription className="text-xs mt-1 flex items-center gap-1">
            <MapPin className="h-3 w-3 flex-shrink-0 text-gray-500" />
            <span>{isExistingPlace ? "Доступне місце" : "Нове місце на мапі"}</span>
          </CardDescription>
        </CardHeader>
        <CardContent className="p-2 pt-0 space-y-3">
          {isExistingPlace ? (
            isPlaceLoading ? (
              <div className="bg-blue-50 p-2 rounded-md border border-blue-200">
                <div className="flex items-center justify-center py-1">
                  <div className="h-5 w-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                </div>
              </div>
            ) : (
              <div className="bg-green-50 p-2 rounded-md border border-green-200">
                <div className="flex items-start gap-2">
                  <p className="text-xs text-green-800">
                    Це місце вже є в базі доступних місць. Ви можете переглянути деталі доступності
                    та відгуки користувачів.
                  </p>
                </div>
              </div>
            )
          ) : (
            <div className="bg-yellow-50 p-2 rounded-md border border-yellow-200">
              <div className="flex items-start gap-2">
                <p className="text-xs text-yellow-800">
                  Це місце ще не оцінено на доступність. Ви можете подати заявку, щоб додати його до
                  бази доступних місць.
                </p>
              </div>
            </div>
          )}

          {isExistingPlace ? (
            <Button
              variant="default"
              size="sm"
              className="w-full mt-2 text-xs cursor-pointer"
              disabled={isPlaceLoading}
              onClick={handleDetailsClick}
            >
              Переглянути деталі
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          ) : (
            <Button
              variant="default"
              size="sm"
              className="w-full mt-2 text-xs cursor-pointer"
              onClick={handleSubmitClick}
            >
              Подати заявку
              <ArrowRight className="h-3 w-3 ml-1" />
            </Button>
          )}
        </CardContent>
      </Card>

      {isExistingPlace && placeDetails ? (
        <PlaceDetailsDrawer
          place={placeDetails}
          isOpen={isDetailsDrawerOpen}
          onClose={() => setIsDetailsDrawerOpen(false)}
        />
      ) : (
        <PlaceApplicationDrawer
          place={place}
          isOpen={isApplicationDrawerOpen}
          onClose={() => setIsApplicationDrawerOpen(false)}
        />
      )}
    </>
  );
}
