"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import Link from "next/link";
import { Lock } from "lucide-react";

import {
  Drawer,
  DrawerContent,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerDescription,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { PlaceSearchResult, PlaceCategory } from "@/lib/types/place.types";
import { useCreatePlace } from "@/lib/hooks/use-places";
import { useAuth } from "@/lib/contexts/auth.context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

import { categoryConfig } from "../map/map-place-popup";

const placeFormSchema = z.object({
  name: z.string().min(1, "Назва є обов'язковою"),
  address: z.string().min(1, "Адреса є обов'язковою"),
  lat: z.number(),
  lon: z.number(),
  wheelchairAccessible: z.boolean(),
  tactileElements: z.boolean(),
  brailleSignage: z.boolean(),
  accessibleToilets: z.boolean(),
  category: z.nativeEnum(PlaceCategory, {
    errorMap: () => ({ message: "Категорія є обов'язковою" }),
  }),
});

type PlaceFormData = z.infer<typeof placeFormSchema>;

interface PlaceApplicationDrawerProps {
  place: PlaceSearchResult | null;
  isOpen: boolean;
  onClose: () => void;
}

const parseSearchResult = (place: PlaceSearchResult): { name: string; address: string } => {
  if (!place.name) return { name: "", address: "" };

  const parts = place.name.split(",");

  const name = parts[0]?.trim() || "";

  let address = "";

  if (parts.length > 1) {
    const relevantParts = [];

    for (let i = 1; i < parts.length; i++) {
      const part = parts[i].trim();

      if (
        part.includes("Львівська міська громада") ||
        part.includes("Львівський район") ||
        part.includes("Львівська область")
      ) {
        break;
      }
      relevantParts.push(part);
    }
    address = relevantParts.join(", ");
  }

  return { name, address };
};

export default function PlaceApplicationDrawer({
  place,
  isOpen,
  onClose,
}: PlaceApplicationDrawerProps) {
  const { isAuthenticated } = useAuth();
  const [isSubmitSuccess, setIsSubmitSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { mutateAsync: createPlace, isPending } = useCreatePlace({
    onSuccess: () => {
      setIsSubmitSuccess(true);
    },
    onError: () => {
      setError("Сталася помилка під час надсилання заявки. Спробуйте пізніше.");
    },
  });

  const getInitialValues = (): Partial<PlaceFormData> => {
    if (!place) return {};

    const { name, address } = parseSearchResult(place);

    let category = PlaceCategory.OTHER;

    if (name.toLowerCase().includes("кафе")) {
      category = PlaceCategory.CAFE;
    } else if (name.toLowerCase().includes("ресторан")) {
      category = PlaceCategory.RESTAURANT;
    } else if (name.toLowerCase().includes("кінотеатр")) {
      category = PlaceCategory.CINEMA;
    } else if (name.toLowerCase().includes("бібліотек")) {
      category = PlaceCategory.LIBRARY;
    } else if (name.toLowerCase().includes("магазин") || name.toLowerCase().includes("маркет")) {
      category = PlaceCategory.SHOP;
    }

    return {
      name,
      address,
      lat: place.lat || 0,
      lon: place.lon || 0,
      category,
    };
  };

  const form = useForm<PlaceFormData>({
    resolver: zodResolver(placeFormSchema),
    defaultValues: {
      name: "",
      address: "",
      lat: 0,
      lon: 0,
      wheelchairAccessible: false,
      tactileElements: false,
      brailleSignage: false,
      accessibleToilets: false,
      category: PlaceCategory.OTHER,
    },
  });

  useEffect(() => {
    if (place && isOpen) {
      const initialValues = getInitialValues();

      Object.entries(initialValues).forEach(([key, value]) => {
        form.setValue(
          key as keyof PlaceFormData,
          value as unknown as PlaceFormData[keyof PlaceFormData],
        );
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [place, isOpen, form]);

  const onSubmit = async (data: PlaceFormData) => {
    if (!isAuthenticated) {
      setError("Для подання заявки необхідно увійти в систему.");

      return;
    }

    try {
      setError(null);
      await createPlace(data);
    } catch (error) {
      console.error("Error creating place:", error);
      setError("Сталася помилка під час надсилання заявки. Спробуйте пізніше.");
    }
  };

  const handleClose = () => {
    form.reset();
    setIsSubmitSuccess(false);
    setError(null);
    onClose();
  };

  if (!place) return null;

  const renderAuthenticationSection = () => {
    if (!isAuthenticated) {
      return (
        <div className="text-center py-4 bg-gray-50 rounded-md border border-gray-100 mb-4">
          <div className="flex justify-center mb-3">
            <Lock className="h-8 w-8 text-muted-foreground" />
          </div>
          <h4 className="font-medium mb-2">Увійдіть, щоб подати заявку</h4>
          <p className="text-sm text-muted-foreground mb-4">
            Щоб подати заявку на додавання місця, вам потрібно авторизуватися
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

    return null;
  };

  return (
    <Drawer open={isOpen} onOpenChange={(open) => !open && handleClose()}>
      <DrawerContent className="max-w-lg mx-auto rounded-t-lg">
        <div className="max-h-[80vh] overflow-y-auto overscroll-contain">
          <DrawerHeader className="border-b">
            <DrawerTitle>Подати заявку на додавання місця</DrawerTitle>
            <DrawerDescription>{place.name}</DrawerDescription>
          </DrawerHeader>

          <div className="p-4 space-y-6 mb-16">
            {renderAuthenticationSection()}

            {isSubmitSuccess ? (
              <div className="space-y-4">
                <div className="bg-green-50 p-4 rounded-md border border-green-200">
                  <p className="text-green-800">
                    Дякуємо за вашу заявку! Вона буде розглянута найближчим часом і вам буде
                    надіслано сповіщення на електронну пошту.
                  </p>
                </div>
                <Button variant="outline" className="w-full" onClick={handleClose}>
                  Закрити
                </Button>
              </div>
            ) : (
              <Form {...form}>
                <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                  {error && !isAuthenticated && (
                    <Alert className="bg-red-50 border-red-200">
                      <AlertDescription className="text-red-800">{error}</AlertDescription>
                    </Alert>
                  )}

                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Назва</FormLabel>
                        <FormControl>
                          <Input placeholder="Введіть назву місця" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="address"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Адреса</FormLabel>
                        <FormControl>
                          <Input placeholder="Введіть адресу" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Категорія</FormLabel>
                        <Select
                          defaultValue={field.value}
                          onValueChange={(value) => field.onChange(value as PlaceCategory)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Виберіть категорію" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(categoryConfig).map(([key, { label, icon }]) => (
                              <SelectItem key={key} value={key}>
                                <div className="flex items-center gap-2">
                                  {icon}
                                  <span>{label}</span>
                                </div>
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="space-y-2">
                    <h3 className="text-sm font-semibold mb-2">Доступність</h3>

                    <FormField
                      control={form.control}
                      name="wheelchairAccessible"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Доступно для інвалідних візків
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="tactileElements"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Тактильні елементи
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="brailleSignage"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Позначення шрифтом Брайля
                          </FormLabel>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="accessibleToilets"
                      render={({ field }) => (
                        <FormItem className="flex items-center space-x-2 space-y-0">
                          <FormControl>
                            <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                          </FormControl>
                          <FormLabel className="font-normal cursor-pointer">
                            Адаптовані туалети
                          </FormLabel>
                        </FormItem>
                      )}
                    />
                  </div>

                  <Button
                    type="submit"
                    className="w-full mt-4"
                    disabled={isPending || !isAuthenticated}
                  >
                    {isPending ? "Надсилання..." : "Подати заявку"}
                  </Button>
                </form>
              </Form>
            )}
          </div>
        </div>

        <DrawerFooter className="border-t bg-white z-10">
          <Button variant="outline" className="w-full cursor-pointer" onClick={handleClose}>
            Закрити
          </Button>
        </DrawerFooter>
      </DrawerContent>
    </Drawer>
  );
}
