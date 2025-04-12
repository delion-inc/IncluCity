"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface RegisterFormProps {
  onSuccess?: () => void;
}

export default function RegisterForm({ onSuccess }: RegisterFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.();
  };

  return (
    <form className="space-y-4 py-2" onSubmit={handleSubmit}>
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="firstName">
            Ім&apos;я
          </label>
          <Input id="firstName" placeholder="Іван" className="border-gray-200" />
        </div>
        <div className="space-y-2">
          <label className="text-sm font-medium" htmlFor="lastName">
            Прізвище
          </label>
          <Input id="lastName" placeholder="Петренко" className="border-gray-200" />
        </div>
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="regEmail">
          Email
        </label>
        <Input
          id="regEmail"
          type="email"
          placeholder="example@mail.com"
          className="border-gray-200"
        />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="regPassword">
          Пароль
        </label>
        <Input id="regPassword" type="password" className="border-gray-200" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="confirmPassword">
          Підтвердіть пароль
        </label>
        <Input id="confirmPassword" type="password" className="border-gray-200" />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Зареєструватися
      </Button>
    </form>
  );
}
