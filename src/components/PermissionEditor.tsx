// src/components/PermissionEditor.tsx
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "../redux/store";
import { updateRolePermissions } from "../redux/slices/roleSlice";
import { Checkbox } from "@/components/ui/checkbox";

export interface PermissionEditorProps {
  roleId: string;
  permissions: { id: string; name: string; children?: { id: string; name: string }[] }[];
  selectedPermissions: string[];
  onChange: (updatedPermissions: string[]) => void;
}

const PermissionEditor: React.FC<PermissionEditorProps> = ({
  roleId,
  permissions,
  selectedPermissions,
  onChange,
}) => {
  const [isSaving, setIsSaving] = useState(false);
  const dispatch: AppDispatch = useDispatch();
  const [error, setError] = useState<string | null>(null);

  const handleSave = async () => {
    setIsSaving(true);
    setError(null);

    try {
      // Dispatch the action to update permissions
      await dispatch(
        updateRolePermissions({
          roleId,
          permissions: selectedPermissions,
        })
      );

      alert("Permissions saved successfully!");
    } catch (err) {
      console.error("Error saving permissions:", err);
      setError("Failed to save permissions. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const renderPermissions = (
    items: { id: string; name: string; children?: { id: string; name: string }[] }[]
  ) => (
    <ul className="list-disc ml-6">
      {items.map((item) => (
        <li key={item.id} className="mb-2">
          <div className="flex items-center">
            <Checkbox
              id={item.id}
              checked={selectedPermissions.includes(item.id)}
              onCheckedChange={(checked) =>
                onChange(
                  checked
                    ? [...selectedPermissions, item.id]
                    : selectedPermissions.filter((id) => id !== item.id)
                )
              }
              className="data-[state=checked]:bg-black data-[state=checked]:border-black border-gray-400"
            />
            <label htmlFor={item.id} className="ml-2 cursor-pointer">
              {item.name}
            </label>
          </div>
          {item.children && renderPermissions(item.children)}
        </li>
      ))}
    </ul>
  );

  return (
    <div>
      <h2 className="text-lg font-bold mb-4">Permissions</h2>
      {permissions.length > 0 ? (
        renderPermissions(permissions)
      ) : (
        <p className="text-gray-500">No permissions available.</p>
      )}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      <button
        onClick={handleSave}
        disabled={isSaving}
        className={`mt-4 px-4 py-2 ${
          isSaving ? "bg-gray-500" : "bg-black"
        } text-white rounded`}
      >
        {isSaving ? "Saving..." : "Save Changes"}
      </button>
    </div>
  );
};

export default PermissionEditor;
