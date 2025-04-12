"use client";

import { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { ArrowLeft } from "lucide-react";

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
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Input } from "@/components/ui/input";
import { registerSchema, RegisterFormData } from "@/lib/validations/auth";
import { useAuth } from "@/lib/contexts/auth.context";

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const form = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setError(null);
      await register({
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      });
    } catch (error) {
      const axiosError = error as AxiosError;

      if (axiosError.response?.status === 409) {
        setError("Користувач з таким email вже існує");
      } else if (axiosError.response?.status === 400) {
        setError("Невірний формат даних");
      } else {
        setError("Сталася помилка. Спробуйте пізніше");
      }
    }
  };
  
  const handleGoBack = () => {
    router.back();
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
            <p className="text-xl text-gray-600 mb-6">Приєднуйтесь до спільноти</p>
            <p className="text-gray-600 max-w-sm mb-6">
            Створіть обліковий запис, щоб залишати відгуки та впливати на доступність вашого міста.
            </p>
          </div>
          
          <div className="flex flex-col space-y-4 max-w-sm">
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 11c0 3.517-1.009 6.799-2.753 9.571m-3.44-2.04l.054-.09A13.916 13.916 0 008 11a4 4 0 118 0c0 1.017-.07 2.019-.203 3m-2.118 6.844A21.88 21.88 0 0015.171 17m3.839 1.132c.645-2.266.99-4.659.99-7.132A8 8 0 008 4.07M3 15.364c.64-1.319 1-2.8 1-4.364 0-1.457.39-2.823 1.07-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Повний доступ</h3>
                <p className="text-sm text-gray-500">Оцінюйте місця та будуйте маршрути безкоштовно.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Відстежуйте зміни</h3>
                <p className="text-sm text-gray-500">Отримуйте повідомлення про пропозиції щодо доступності.</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <div className="bg-primary/20 p-2 rounded-full">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
                </svg>
              </div>
              <div>
                <h3 className="font-medium">Станьте частиною змін</h3>
                <p className="text-sm text-gray-500">Допомагайте робити міста доступнішими для всіх.</p>
              </div>
            </div>
          </div>
        </div>
        
        <div className="md:hidden w-full max-w-md mb-6 text-center">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">IncluCity</h1>
          <p className="text-gray-600">Приєднуйтесь до спільноти</p>
        </div>
        
        <Card className="w-full max-w-md shadow-xl border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader className="space-y-1">
            <CardTitle className="text-2xl text-center text-primary font-bold">Реєстрація</CardTitle>
            <CardDescription className="text-center text-muted-foreground">
              Створіть свій обліковий запис
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
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                          autoComplete="new-password"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
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
                <Button
                  type="submit"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Реєстрація..." : "Зареєструватися"}
                </Button>
              </form>
            </Form>
          </CardContent>
          <CardFooter className="flex flex-col space-y-4">
            <div className="text-sm text-center text-muted-foreground">
              Вже маєте обліковий запис?{" "}
              <Link
                href="/login"
                className="text-primary hover:text-primary/90 hover:underline font-medium"
              >
                Увійти
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}
