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
  UserPlus,
  Users,
  Filter,
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";

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
import { useAllPlaces } from "@/lib/hooks/use-all-places";
import { categoryConfig } from "@/components/map/map-place-popup";
import { PlaceCategory } from "@/lib/types/place.types";
import { PlaceDTO } from "@/lib/types/admin.types";
import { UpdatePlaceRequest } from "@/lib/services/admin.service";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { useAuth } from "@/lib/contexts/auth.context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useUsers } from "@/lib/hooks/use-users";
import { ROLE_ADMIN, roleLabels, roleOptions } from "@/lib/constants/roles";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { UserDTO } from "@/lib/services/user.service";
import { updateUserSchema, UpdateUserFormData } from "@/lib/validations/user";

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
    places,
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
    placeFilter,
    setPlaceFilter,
  } = useAllPlaces(0, 10);

  const [actionPlaceId, setActionPlaceId] = useState<number | null>(null);
  const [actionType, setActionType] = useState<"approve" | "delete" | null>(null);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const [selectedPlace, setSelectedPlace] = useState<PlaceDTO | null>(null);
  const [showAddAdminDialog, setShowAddAdminDialog] = useState(false);
  const [adminError, setAdminError] = useState<string | null>(null);
  const { register } = useAuth();

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

  const adminForm = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
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

  const onSubmitAdminForm = async (data: RegisterFormData) => {
    try {
      setAdminError(null);
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        roles: ["ROLE_ADMIN"],
      });

      setShowAddAdminDialog(false);
      adminForm.reset();
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 409) {
        setAdminError("Користувач з таким email вже існує");
      } else if (axiosError.response?.status === 400) {
        setAdminError("Невірний формат даних");
      } else {
        setAdminError("Сталася помилка. Спробуйте пізніше");
      }
    }
  };

  const [selectedTab, setSelectedTab] = useState<string>("places");
  const [userActionType, setUserActionType] = useState<"edit" | "delete" | null>(null);
  const [selectedUser, setSelectedUser] = useState<UserDTO | null>(null);
  const [showUserDialog, setShowUserDialog] = useState(false);
  const [userError, setUserError] = useState<string | null>(null);

  const {
    users,
    isLoading: isLoadingUsers,
    isError: isUsersError,
    updateUser,
    isUpdating,
    deleteUser,
    isDeleting,
    selectedRole,
    setSelectedRole,
  } = useUsers();

  const userForm = useForm<UpdateUserFormData>({
    resolver: zodResolver(updateUserSchema),
    defaultValues: {
      email: "",
      firstName: "",
      lastName: "",
      roles: [],
    },
  });

  const handleUserAction = async () => {
    if (!selectedUser || !userActionType) return;

    try {
      if (userActionType === "delete") {
        await deleteUser(selectedUser.id);
        setShowUserDialog(false);
        setSelectedUser(null);
        setUserActionType(null);
      }
    } catch (error) {
      console.error(`Error performing ${userActionType} action:`, error);
    }
  };

  const confirmUserAction = (user: UserDTO, type: "edit" | "delete") => {
    setSelectedUser(user);
    setUserActionType(type);

    if (type === "edit") {
      userForm.reset({
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        roles: user.roles,
      });
    }

    setShowUserDialog(true);
  };

  const onSubmitUserEdit = async (data: UpdateUserFormData) => {
    if (!selectedUser) return;

    try {
      setUserError(null);
      await updateUser(selectedUser.id, data);
      setShowUserDialog(false);
      setSelectedUser(null);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 409) {
        setUserError("Користувач з таким email вже існує");
      } else if (axiosError.response?.status === 400) {
        setUserError("Невірний формат даних");
      } else {
        setUserError("Сталася помилка. Спробуйте пізніше");
      }
    }
  };

  const handleRoleFilter = (role: number | null) => {
    setSelectedRole(role);
  };

  if (isError || isUsersError) {
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
      <div className="w-full max-w-[1550px] mx-auto bg-white p-8 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold mb-6">Адміністративна панель</h1>

        <Tabs
          defaultValue="places"
          value={selectedTab}
          className="w-full"
          onValueChange={setSelectedTab}
        >
          <TabsList className="mb-6">
            <TabsTrigger value="places" className="flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Місця
            </TabsTrigger>
            <TabsTrigger value="users" className="flex items-center gap-2">
              <Users className="h-4 w-4" />
              Користувачі
            </TabsTrigger>
          </TabsList>

          <TabsContent value="places" className="w-full">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Управління місцями</h2>
                <div className="flex gap-4">
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500 mr-2">Фільтр:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={placeFilter === "all" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPlaceFilter("all")}
                      >
                        Всі місця
                      </Button>
                      <Button
                        variant={placeFilter === "unapproved" ? "default" : "outline"}
                        size="sm"
                        onClick={() => setPlaceFilter("unapproved")}
                      >
                        Непідтверджені
                      </Button>
                    </div>
                  </div>
                </div>
              </div>

              {isLoading ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Завантаження місць...</span>
                </div>
              ) : places.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">
                    {placeFilter === "unapproved" ? "Немає непідтверджених місць" : "Немає місць"}
                  </p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>
                      {placeFilter === "unapproved"
                        ? "Список місць, що очікують підтвердження"
                        : "Список всіх місць"}
                    </TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Назва</TableHead>
                        <TableHead>Адреса</TableHead>
                        <TableHead>Категорія</TableHead>
                        <TableHead>Доступність</TableHead>
                        <TableHead>Статус</TableHead>
                        <TableHead>Дата створення</TableHead>
                        <TableHead className="text-right">Дії</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {places.map((place) => (
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
                          <TableCell>
                            <Badge variant={place.approved ? "default" : "secondary"}>
                              {place.approved ? "Підтверджено" : "Очікує підтвердження"}
                            </Badge>
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
                              {!place.approved && (
                                <Button
                                  variant="outline"
                                  size="sm"
                                  disabled={approvingPlace || deletingPlace || editingPlace}
                                  onClick={() => confirmAction(place, "approve")}
                                >
                                  <Check className="h-4 w-4 mr-1" />
                                  Підтвердити
                                </Button>
                              )}
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
          </TabsContent>

          <TabsContent value="users" className="w-full">
            <div className="mb-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-semibold">Управління користувачами</h2>
                <div className="flex gap-4">
                  <Button onClick={() => setShowAddAdminDialog(true)}>
                    <UserPlus className="h-4 w-4 mr-2" />
                    Додати адміністратора
                  </Button>
                  <div className="flex items-center">
                    <Filter className="h-4 w-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-500 mr-2">Фільтр за роллю:</span>
                    <div className="flex gap-2">
                      <Button
                        variant={selectedRole === null ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleRoleFilter(null)}
                      >
                        Всі
                      </Button>
                      {roleOptions.map((role) => (
                        <Button
                          key={role.value}
                          variant={selectedRole === role.value ? "default" : "outline"}
                          size="sm"
                          onClick={() => handleRoleFilter(role.value)}
                        >
                          {role.label}
                        </Button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {isLoadingUsers ? (
                <div className="flex items-center justify-center h-40">
                  <Loader2 className="h-8 w-8 animate-spin text-primary" />
                  <span className="ml-2">Завантаження користувачів...</span>
                </div>
              ) : users.length === 0 ? (
                <div className="text-center py-8 border border-dashed rounded-lg">
                  <Users className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-500">Немає користувачів з вибраною роллю</p>
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableCaption>Список користувачів системи</TableCaption>
                    <TableHeader>
                      <TableRow>
                        <TableHead>ID</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Ім&apos;я</TableHead>
                        <TableHead>Прізвище</TableHead>
                        <TableHead>Ролі</TableHead>
                        <TableHead className="text-right">Дії</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {users.map((user) => (
                        <TableRow key={user.id}>
                          <TableCell className="font-medium">{user.id}</TableCell>
                          <TableCell>{user.email}</TableCell>
                          <TableCell>{user.firstName}</TableCell>
                          <TableCell>{user.lastName}</TableCell>
                          <TableCell>
                            <div className="flex flex-wrap gap-1">
                              {user.roles.map((roleId) => (
                                <Badge key={roleId} variant="outline">
                                  {roleLabels[roleId] || `Роль ${roleId}`}
                                </Badge>
                              ))}
                            </div>
                          </TableCell>
                          <TableCell className="text-right">
                            <div className="flex justify-end gap-2">
                              <Button
                                variant="outline"
                                size="sm"
                                disabled={isUpdating || isDeleting}
                                onClick={() => confirmUserAction(user, "edit")}
                              >
                                <Edit className="h-4 w-4 mr-1" />
                                Редагувати
                              </Button>
                              <Button
                                variant="destructive"
                                size="sm"
                                disabled={
                                  isUpdating || isDeleting || user.roles.includes(ROLE_ADMIN)
                                }
                                onClick={() => confirmUserAction(user, "delete")}
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
            </div>
          </TabsContent>
        </Tabs>
      </div>

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

      <Dialog open={showUserDialog} onOpenChange={setShowUserDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>
              {userActionType === "edit" ? "Редагувати користувача" : "Видалити користувача"}
            </DialogTitle>
            <DialogDescription>
              {userActionType === "edit"
                ? "Змініть інформацію про користувача та натисніть зберегти."
                : "Ви впевнені, що хочете видалити цього користувача? Ця дія безповоротна."}
            </DialogDescription>
          </DialogHeader>

          {userActionType === "edit" ? (
            <Form {...userForm}>
              <form className="space-y-4" onSubmit={userForm.handleSubmit(onSubmitUserEdit)}>
                {userError && (
                  <Alert variant="destructive">
                    <AlertDescription>{userError}</AlertDescription>
                  </Alert>
                )}

                <FormField
                  control={userForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={userForm.control}
                    name="firstName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ім&apos;я</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={userForm.control}
                    name="lastName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Прізвище</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={userForm.control}
                  name="roles"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ролі користувача</FormLabel>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {roleOptions.map((role) => (
                          <div key={role.value} className="flex items-center space-x-2">
                            <Checkbox
                              id={`role-${role.value}`}
                              checked={field.value.includes(role.value)}
                              onCheckedChange={(checked) => {
                                if (checked) {
                                  field.onChange([...field.value, role.value]);
                                } else {
                                  field.onChange(
                                    field.value.filter((value) => value !== role.value),
                                  );
                                }
                              }}
                            />
                            <label
                              htmlFor={`role-${role.value}`}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {role.label}
                            </label>
                          </div>
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <DialogFooter className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    disabled={isUpdating}
                    onClick={() => setShowUserDialog(false)}
                  >
                    Скасувати
                  </Button>
                  <Button type="submit" disabled={isUpdating}>
                    {isUpdating && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                    Зберегти зміни
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          ) : (
            <>
              {selectedUser && (
                <div className="py-4">
                  <h3 className="font-medium">{selectedUser.email}</h3>
                  <p className="text-sm text-gray-500">
                    {selectedUser.firstName} {selectedUser.lastName}
                  </p>
                </div>
              )}

              <DialogFooter>
                <Button
                  variant="outline"
                  disabled={isDeleting}
                  onClick={() => setShowUserDialog(false)}
                >
                  Скасувати
                </Button>
                <Button variant="destructive" disabled={isDeleting} onClick={handleUserAction}>
                  {isDeleting && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
                  Видалити
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      <Dialog open={showAddAdminDialog} onOpenChange={setShowAddAdminDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Додати нового адміністратора</DialogTitle>
            <DialogDescription>Створіть обліковий запис з правами адміністратора</DialogDescription>
          </DialogHeader>

          <Form {...adminForm}>
            <form className="space-y-4" onSubmit={adminForm.handleSubmit(onSubmitAdminForm)}>
              {adminError && (
                <Alert variant="destructive">
                  <AlertDescription>{adminError}</AlertDescription>
                </Alert>
              )}

              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={adminForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ім&apos;я</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Іван"
                          autoCapitalize="none"
                          autoCorrect="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={adminForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Прізвище</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Петренко"
                          autoCapitalize="none"
                          autoCorrect="off"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={adminForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="example@mail.com"
                        type="email"
                        autoCapitalize="none"
                        autoComplete="email"
                        autoCorrect="off"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={adminForm.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoCapitalize="none"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={adminForm.control}
                name="confirmPassword"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Підтвердіть пароль</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        autoCapitalize="none"
                        autoComplete="new-password"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAddAdminDialog(false)}
                >
                  Скасувати
                </Button>
                <Button type="submit" disabled={adminForm.formState.isSubmitting}>
                  {adminForm.formState.isSubmitting ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Створення...
                    </>
                  ) : (
                    "Створити адміністратора"
                  )}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
