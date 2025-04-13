import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().min(1, "Email є обов'язковим").email("Введіть коректний email"),
  password: z
    .string()
    .min(1, "Пароль є обов'язковим")
    .min(8, "Пароль повинен містити щонайменше 8 символів"),
});

export const registerSchema = z
  .object({
    firstName: z
      .string()
      .min(1, "Ім'я є обов'язковим")
      .min(2, "Ім'я повинно містити щонайменше 2 символи"),
    lastName: z
      .string()
      .min(1, "Прізвище є обов'язковим")
      .min(2, "Прізвище повинно містити щонайменше 2 символи"),
    email: z.string().min(1, "Email є обов'язковим").email("Введіть коректний email"),
    password: z
      .string()
      .min(1, "Пароль є обов'язковим")
      .min(8, "Пароль повинен містити щонайменше 8 символів")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/,
        "Пароль повинен містити великі та малі літери, а також цифри",
      ),
    confirmPassword: z.string().min(1, "Підтвердження паролю є обов'язковим"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Паролі не співпадають",
    path: ["confirmPassword"],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
