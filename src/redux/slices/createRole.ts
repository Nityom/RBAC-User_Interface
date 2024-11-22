import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create a role
export const createRole = createAsyncThunk(
  "roles/createRole",
  async ({ name, permissions }: { name: string; permissions: string[] }) => {
    const response = await axios.post("/api/roles", { name, permissions });
    return response.data;
  }
);

// Role Slice
const roleSlice = createSlice({
  name: "roles",
  initialState: {
    data: [] as { id: string; name: string; permissions: string[] }[], // Explicitly typed
    loading: false,
    error: null as string | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createRole.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.loading = false;
        state.data.push(action.payload); // Add the new role to the state
      })
      .addCase(createRole.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to create role";
      });
  },
});

// Export the reducer
export default roleSlice.reducer;
