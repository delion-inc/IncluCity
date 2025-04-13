"use client";

import { useState } from "react";
import {
  Check,
  AlertCircle,
  MapPin,
  Loader2,
  Trash2,
  Edit,
  CheckCircle2,
  XCircle,
} from "lucide-react";
import { useForm } from "react-hook-form";

import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
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
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { useUnapprovedPlaces } from "@/lib/hooks/use-admin";
import { categoryConfig } from "@/components/map/map-place-popup";
import { PlaceCategory } from "@/lib/types/place.types";
import { PlaceDTO } from "@/lib/types/admin.types";
import { UpdatePlaceRequest } from "@/lib/services/admin.service";

const formatDate = (timestamp: number): string => {
  const date = new Date(timestamp);

  return date.toLocaleDateString("uk-UA", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

export default function AdminPanel() {
  const {
    unapprovedPlaces,
    totalPages,
    isLoading,
    isError,
    approvePlace,
    approvingPlace,
    deletePlace,
    deletingPlace,
    editPlace,
    editingPlace,
    handlePageChange,
    page,
  } = useUnapprovedPlaces(0, 10);

  const [actionPlaceId, setActionPlaceId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"approve" | "delete" | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDTO | null>(null);

  const form = useForm<UpdatePlaceRequest>({
    defaultValues: {
      name: "",
      address: "",
      wheelchairAccessible: false,
      tactileElements: false,
      brailleSignage: false,
      accessibleToilets: false,
      category: "OTHER",
    },
  });

  const handleAction = async () => {
    if (!actionPlaceId || !actionType) return;

    try {
      if (actionType === "approve") {
        await approvePlace(actionPlaceId);
      } else if (actionType === "delete") {
        await deletePlace(actionPlaceId);
      }
      setShowConfirmDialog(false);
      setActionPlaceId(null);
      setActionType(null);
    } catch (error) {
      console.error(`Error performing ${actionType} action:`, error);
    }
  };

  const confirmAction = (place: PlaceDTO, type: "approve" | "delete") => {
    setSelectedPlace(place);
    setActionPlaceId(place.id);
    setActionType(type);
    setShowConfirmDialog(true);
  };

  const handleEdit = (place: PlaceDTO) => {
    setSelectedPlace(place);
    form.reset({
      name: place.name,
      address: place.address,
      wheelchairAccessible: place.wheelchairAccessible,
      tactileElements: place.tactileElements,
      brailleSignage: place.brailleSignage,
      accessibleToilets: place.accessibleToilets,
      category: place.category.toString(),
    });
    setShowEditDialog(true);
  };

  const onSubmitEdit = async (data: UpdatePlaceRequest) => {
    if (!selectedPlace) return;

    try {
      await editPlace(selectedPlace.id, data);
      setShowEditDialog(false);
    } catch (error) {
      console.error("Error editing place:", error);
    }
  };

  const getCategoryDisplay = (place: PlaceDTO) => {
    if (place.categoryName) {
      return place.categoryName;
    }

    if (place.category && categoryConfig[place.category as PlaceCategory]) {
      return categoryConfig[place.category as PlaceCategory].label;
    }

    return "Інше";
  };

  const renderPagination = () => {
    if (totalPages <= 1) return null;

    return (
      <Pagination className="mt-4">
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious
              size="default"
              onClick={() => handlePageChange(Math.max(0, page - 1))}
            />
          </PaginationItem>

          {Array.from({ length: totalPages }).map((_, index) => (
            <PaginationItem key={index}>
              <PaginationLink
                isActive={index === page}
                size="default"
                onClick={() => handlePageChange(index)}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}

          <PaginationItem>
            <PaginationNext
              size="default"
              onClick={() => handlePageChange(Math.min(totalPages - 1, page + 1))}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    );
  };

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center p-6 bg-gray-50">
        <div className="w-full max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-md">
          <div className="text-center text-red-500">
            <AlertCircle className="h-12 w-12 mx-auto mb-4" />
            <h2 className="text-2xl font-bold">Помилка завантаження даних</h2>
            <p className="mt-2">Спробуйте оновити сторінку або зверніться до адміністратора.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col items-start p-6 bg-gray-50">
      <div className="w-full max-w-7xl mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6">Адміністративна панель</h1>

        <div className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Непідтверджені місця</h2>

          {isLoading ? (
            <div className="flex items-center justify-center h-40">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
              <span className="ml-2">Завантаження...</span>
            </div>
          ) : unapprovedPlaces.length === 0 ? (
            <div className="text-center py-8 border border-dashed rounded-lg">
              <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
              <p className="text-gray-500">Немає непідтверджених місць</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableCaption>Список місць, що очікують підтвердження</TableCaption>
                <TableHeader>
                  <TableRow>
                    <TableHead>ID</TableHead>
                    <TableHead>Назва</TableHead>
                    <TableHead>Адреса</TableHead>
                    <TableHead>Категорія</TableHead>
                    <TableHead>Доступність</TableHead>
                    <TableHead>Дата створення</TableHead>
                    <TableHead className="text-right">Дії</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {unapprovedPlaces.map((place) => (
                    <TableRow key={place.id}>
                      <TableCell className="font-medium">{place.id}</TableCell>
                      <TableCell>{place.name}</TableCell>
                      <TableCell className="max-w-xs truncate">{place.address}</TableCell>
                      <TableCell>{getCategoryDisplay(place)}</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1 text-xs">
                          <div className="flex items-center gap-1">
                            {place.wheelchairAccessible ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>Доступно для колясок</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {place.tactileElements ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>Тактильні елементи</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {place.brailleSignage ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>Шрифт Брайля</span>
                          </div>
                          <div className="flex items-center gap-1">
                            {place.accessibleToilets ? (
                              <CheckCircle2 className="h-3 w-3 text-green-500" />
                            ) : (
                              <XCircle className="h-3 w-3 text-red-500" />
                            )}
                            <span>Доступні туалети</span>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>{formatDate(place.createdAt)}</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={approvingPlace || deletingPlace || editingPlace}
                            onClick={() => handleEdit(place)}
                          >
                            <Edit className="h-4 w-4 mr-1" />
                            Редагувати
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            disabled={approvingPlace || deletingPlace || editingPlace}
                            onClick={() => confirmAction(place, "approve")}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Підтвердити
                          </Button>
                          <Button
                            variant="destructive"
                            size="sm"
                            disabled={approvingPlace || deletingPlace || editingPlace}
                            onClick={() => confirmAction(place, "delete")}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Видалити
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {renderPagination()}
        </div>
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {actionType === "approve" ? "Підтвердити місце" : "Видалити місце"}
            </DialogTitle>
            <DialogDescription>
              {actionType === "approve"
                ? "Ви впевнені, що хочете підтвердити це місце? Після підтвердження воно стане видимим для всіх користувачів."
                : "Ви впевнені, що хочете видалити це місце? Ця дія безповоротна."}
            </DialogDescription>
          </DialogHeader>

          {selectedPlace && (
            <div className="py-4">
              <h3 className="font-medium">{selectedPlace.name}</h3>
              <p className="text-sm text-gray-500">{selectedPlace.address}</p>
            </div>
          )}

          <DialogFooter>
            <Button
              variant="outline"
              disabled={approvingPlace || deletingPlace}
              onClick={() => setShowConfirmDialog(false)}
            >
              Скасувати
            </Button>
            <Button
              variant={actionType === "approve" ? "default" : "destructive"}
              disabled={approvingPlace || deletingPlace}
              onClick={handleAction}
            >
              {(approvingPlace || deletingPlace) && (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              )}
              {actionType === "approve" ? "Підтвердити" : "Видалити"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Edit Dialog */}
      <Dialog open={showEditDialog} onOpenChange={setShowEditDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Редагувати місце</DialogTitle>
            <DialogDescription>
              Змініть інформацію про місце та натисніть зберегти.
            </DialogDescription>
          </DialogHeader>

          <Form {...form}>
            <form className="space-y-4" onSubmit={form.handleSubmit(onSubmitEdit)}>
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
                    <Select defaultValue={field.value} onValueChange={field.onChange}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Виберіть категорію" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {Object.entries(categoryConfig).map(([key, value]) => (
                          <SelectItem key={key} value={key}>
                            {value.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="space-y-2">
                <FormLabel>Доступність</FormLabel>
                <div className="space-y-2">
                  <FormField
                    control={form.control}
                    name="wheelchairAccessible"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Доступно для колясок</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="tactileElements"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Тактильні елементи</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="brailleSignage"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Шрифт Брайля</FormLabel>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="accessibleToilets"
                    render={({ field }) => (
                      <FormItem className="flex items-center gap-2 space-y-0">
                        <FormControl>
                          <Checkbox checked={field.value} onCheckedChange={field.onChange} />
                        </FormControl>
                        <FormLabel className="text-sm font-normal">Доступні туалети</FormLabel>
                      </FormItem>
                    )}
                  />
                </div>
              </div>

              <DialogFooter className="pt-4">
                <Button
                  type="button"
                  variant="outline"
                  disabled={editingPlace}
                  onClick={() => setShowEditDialog(false)}
                >
                  Скасувати
                </Button>
                <Button type="submit" disabled={editingPlace}>
                  {editingPlace && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Зберегти зміни
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
