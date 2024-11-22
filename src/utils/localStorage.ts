// src/utils/localStorage.ts
const LOCAL_STORAGE_KEY = "rolesData";

export const loadRoles = (): { id: string; name: string; permissions: string[] }[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveRoles = (roles: { id: string; name: string; permissions: string[] }[]): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(roles));
};
