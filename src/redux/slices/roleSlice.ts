// src/redux/slices/roleSlice.ts
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { loadRoles, saveRoles } from "@/utils/localStorage";

type Role = {
  id: string;
  name: string;
  permissions: string[];
};

interface RoleState {
  data: Role[];
  loading: boolean;
  error: string | null;
}

const initialState: RoleState = {
  data: loadRoles(), // Load initial data from localStorage
  loading: false,
  error: null,
};

// Fetch roles from localStorage
export const fetchRoles = createAsyncThunk("roles/fetchRoles", async () => {
  return loadRoles(); // Return roles from localStorage
});

// Create a new role and save it to localStorage
export const createRole = createAsyncThunk(
  "roles/createRole",
  async ({ name, permissions }: { name: string; permissions: string[] }) => {
    const roles = loadRoles();
    const newRole = { id: Date.now().toString(), name, permissions };
    const updatedRoles = [...roles, newRole];
    saveRoles(updatedRoles); // Save to localStorage
    return newRole;
  }
);

// Delete a role and update localStorage
export const deleteRole = createAsyncThunk("roles/deleteRole", async (roleId: string) => {
  const roles = loadRoles();
  const updatedRoles = roles.filter((role) => role.id !== roleId);
  saveRoles(updatedRoles); // Save to localStorage
  return roleId;
});

// Update permissions for a role and save to localStorage
export const updateRolePermissions = createAsyncThunk(
  "roles/updateRolePermissions",
  async ({ roleId, permissions }: { roleId: string; permissions: string[] }) => {
    const roles = loadRoles();
    const updatedRoles = roles.map((role) =>
      role.id === roleId ? { ...role, permissions } : role
    );
    saveRoles(updatedRoles); // Save to localStorage
    return { roleId, permissions };
  }
);

const roleSlice = createSlice({
  name: "roles",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchRoles.fulfilled, (state, action) => {
        state.data = action.payload;
      })
      .addCase(createRole.fulfilled, (state, action) => {
        state.data.push(action.payload); // Add the new role
      })
      .addCase(deleteRole.fulfilled, (state, action) => {
        state.data = state.data.filter((role) => role.id !== action.payload);
      })
      .addCase(updateRolePermissions.fulfilled, (state, action) => {
        const { roleId, permissions } = action.payload;
        const roleIndex = state.data.findIndex((role) => role.id === roleId);
        if (roleIndex !== -1) {
          state.data[roleIndex].permissions = permissions;
        }
      });
  },
});

export default roleSlice.reducer;
