// src/redux/slices/userSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadUsers, saveUsers } from "@/utils/userStorage";

type User = {
  id: string;
  name: string;
  role: string;
  status: string;
};

interface UserState {
  data: User[];
  loading: boolean;
  error: string | null;
}

const initialState: UserState = {
  data: loadUsers(), // Load initial users from localStorage
  loading: false,
  error: null,
};

// Fetch users from localStorage
export const fetchUsers = createAsyncThunk("users/fetchUsers", async () => {
  return loadUsers(); // Return users from localStorage
});

// Create a new user and save to localStorage
export const createUser = createAsyncThunk(
  "users/createUser",
  async ({ name, role, status }: { name: string; role: string; status: string }) => {
    const users = loadUsers();
    const newUser = { id: Date.now().toString(), name, role, status };
    const updatedUsers = [...users, newUser];
    saveUsers(updatedUsers); // Save to localStorage
    return newUser;
  }
);

// Update a user and save to localStorage
export const updateUser = createAsyncThunk(
  "users/updateUser",
  async ({ id, name, role, status }: { id: string; name: string; role: string; status: string }) => {
    const users = loadUsers();
    const updatedUsers = users.map((user) =>
      user.id === id ? { ...user, name, role, status } : user
    );
    saveUsers(updatedUsers); // Save to localStorage
    return { id, name, role, status };
  }
);

// Delete a user and update localStorage
export const deleteUser = createAsyncThunk("users/deleteUser", async (userId: string) => {
  const users = loadUsers();
  const updatedUsers = users.filter((user) => user.id !== userId);
  saveUsers(updatedUsers); // Save to localStorage
  return userId;
});

const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch users
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.data = action.payload;
      })

      // Create user
      .addCase(createUser.fulfilled, (state, action) => {
        state.data.push(action.payload); // Optimistically add the new user
      })

      // Update user
      .addCase(updateUser.fulfilled, (state, action) => {
        const updatedUser = action.payload;
        const index = state.data.findIndex((user) => user.id === updatedUser.id);
        if (index !== -1) {
          state.data[index] = updatedUser; // Update the user's details
        }
      })

      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.data = state.data.filter((user) => user.id !== action.payload); // Remove the user
      });
  },
});

export default userSlice.reducer;
