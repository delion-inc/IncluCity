import { z } from "zod";

export const updateUserSchema = z.object({
  email: z.string().min(1, "Email є обов'язковим").email("Введіть коректний email"),
  firstName: z
    .string()
    .min(1, "Ім'я є обов'язковим")
    .min(2, "Ім'я повинно містити щонайменше 2 символи"),
  lastName: z
    .string()
    .min(1, "Прізвище є обов'язковим")
    .min(2, "Прізвище повинно містити щонайменше 2 символи"),
  roles: z.array(z.number()).nonempty("Виберіть хоча б одну роль"),
});

export type UpdateUserFormData = z.infer<typeof updateUserSchema>;
