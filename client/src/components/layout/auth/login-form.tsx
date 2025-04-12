"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSuccess?.();
  };

  return (
    <form className="space-y-4 py-2" onSubmit={handleSubmit}>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="email">
          Email
        </label>
        <Input id="email" type="email" placeholder="example@mail.com" className="border-gray-200" />
      </div>
      <div className="space-y-2">
        <label className="text-sm font-medium" htmlFor="password">
          Пароль
        </label>
        <Input id="password" type="password" className="border-gray-200" />
      </div>
      <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white">
        Увійти
      </Button>
    </form>
  );
}
