// src/utils/userStorage.ts
const LOCAL_STORAGE_KEY_USERS = "usersData";

export const loadUsers = (): { id: string; name: string; role: string; status: string }[] => {
  const data = localStorage.getItem(LOCAL_STORAGE_KEY_USERS);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = (
  users: { id: string; name: string; role: string; status: string }[]
): void => {
  localStorage.setItem(LOCAL_STORAGE_KEY_USERS, JSON.stringify(users));
};
