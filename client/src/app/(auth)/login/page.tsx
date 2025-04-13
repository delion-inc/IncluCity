"use client";

import { useState } from "react";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { zodResolver } from "@hookform/resolvers/zod";
import { ArrowLeft } from "lucide-react";

import { useAuth } from "@/lib/contexts/auth.context";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { loginSchema, LoginFormData } from "@/lib/validations/auth";

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setError(null);
      await login(data.email, data.password);
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 401) {
        setError("Невірний email або пароль");
      } else if (axiosError.response?.status === 400) {
        setError("Невірний формат даних");
      } else {
        setError("Сталася помилка. Спробуйте пізніше");
      }
    }
  };

  const handleGoBack = () => {
    router.push("/");
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute top-10 left-10 w-64 h-64 bg-primary/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-10 right-10 w-80 h-80 bg-secondary/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/3 right-1/4 w-40 h-40 bg-indigo-200/20 rounded-full blur-2xl"></div>

        <div className="hidden md:block absolute -top-16 -left-16 w-64 h-64 bg-blue-300/10 rounded-full"></div>
        <div className="hidden md:block absolute -bottom-20 -right-20 w-80 h-80 bg-purple-300/10 rounded-full"></div>

        <div className="absolute bottom-0 left-0 right-0 h-48 bg-gradient-to-t from-blue-100/30 to-transparent"></div>
        <div className="absolute bottom-0 left-10 w-[70%] h-32 bg-blue-900/10 rounded-t-3xl transform skew-x-12"></div>
        <div className="absolute bottom-0 right-10 w-[60%] h-24 bg-blue-800/10 rounded-t-3xl transform -skew-x-6"></div>
      </div>

      <Button
        variant="ghost"
        size="sm"
        className="absolute top-4 left-4 z-20 hover:bg-primary hover:text-white cursor-pointer text-gray-700"
        onClick={handleGoBack}
      >
        <ArrowLeft className="h-5 w-5 mr-1" />
        Назад
      </Button>

      <div className="relative z-10 min-h-screen flex flex-col md:flex-row items-center justify-center p-4 md:p-8 gap-8">
        <div className="hidden md:flex flex-col w-full max-w-md items-center md:items-start justify-center space-y-6">
          <div className="text-center md:text-left">
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-3">IncluCity</h1>
            <p className="text-xl text-gray-600 mb-6">Знаходь доступні місця у твоєму місті</p>
            <p className="text-gray-600 max-w-sm mb-6">
              Інтерактивна карта доступності для пошуку зручних місць та впливу на покращення
              міського простору.
            </p>
          </div>

          <div className="flex flex-col space-y-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Знаходьте доступні місця</h3>
                <p className="text-sm text-gray-500">
                  Шукайте локації з пандусами, тактильними елементами та іншими зручностями.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Залишайте відгуки</h3>
                <p className="text-sm text-gray-500">
                  Оцінюйте місця та діліться досвідом з іншими.
                </p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-6 w-6 text-primary"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Покращуйте простір</h3>
                <p className="text-sm text-gray-500">
                  Пропонуйте зміни і робіть міста зручнішими для всіх.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="md:hidden w-full max-w-md mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">IncluCity</h1>
          <p className="text-gray-600">Знаходь доступні місця у твоєму місті</p>
        </div>

        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-primary font-bold">Вхід</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Увійдіть у свій обліковий запис
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form className="space-y-4" onSubmit={form.handleSubmit(onSubmit)}>
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}
                <FormField
                  control={form.control}
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
                  control={form.control}
                  name="password"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Пароль</FormLabel>
                      <FormControl>
                        <Input
                          type="password"
                          autoCapitalize="none"
                          autoComplete="current-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Вхід..." : "Увійти"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Немає облікового запису?{" "}
              <Link
                href="/register"
                className="text-primary hover:text-primary/90 hover:underline font-medium"
              >
                Зареєструватися
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
