export const ROLE_USER = 2001;
export const ROLE_ADMIN = 5320;

export const roleLabels: Record<number, string> = {
  [ROLE_USER]: "Користувач",
  [ROLE_ADMIN]: "Адміністратор",
};

export const roleOptions = [
  { value: ROLE_USER, label: roleLabels[ROLE_USER] },
  { value: ROLE_ADMIN, label: roleLabels[ROLE_ADMIN] },
];
