import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { createRole } from "@/redux/slices/roleSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Loader2 } from "lucide-react";

interface RoleModalProps {
  isOpen: boolean;
  onClose: () => void;
}

interface Permission {
  id: string;
  label: string;
  description: string;
}

const availablePermissions: Permission[] = [
  { id: "read", label: "Read", description: "Can read content" },
  { id: "write", label: "Write", description: "Can create and edit content" },
  { id: "delete", label: "Delete", description: "Can delete content" },
  { id: "edit_settings", label: "Edit Settings", description: "Can modify system settings" },
  { id: "view_users", label: "View Users", description: "Can view user details" },
  { id: "edit_users", label: "Edit Users", description: "Can modify user details" },
  { id: "delete_users", label: "Delete Users", description: "Can remove users from the system" },
];

const RoleModal: React.FC<RoleModalProps> = ({ isOpen, onClose }) => {
  const [roleName, setRoleName] = useState<string>("");
  const [permissions, setPermissions] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const dispatch: AppDispatch = useDispatch();

  const handlePermissionToggle = (permission: string) => {
    setPermissions((prev) =>
      prev.includes(permission) ? prev.filter((p) => p !== permission) : [...prev, permission]
    );
  };

  const handleSubmit = async () => {
    if (!roleName.trim()) {
      setError("Role name is required.");
      return;
    }

    if (permissions.length === 0) {
      setError("At least one permission must be selected.");
      return;
    }

    try {
      setIsSubmitting(true);
      setError(null);
      await dispatch(createRole({ name: roleName, permissions })).unwrap();
      setRoleName("");
      setPermissions([]);
      onClose();
    } catch (err: unknown) {
      setError("Failed to create role. Please try again.");
      console.error("Error creating role:", err);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px] max-w-[90%]">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Create New Role</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Role Name Input */}
          <div className="space-y-2">
            <Label htmlFor="role-name">Role Name</Label>
            <Input
              id="role-name"
              value={roleName}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRoleName(e.target.value)}
              placeholder="Enter role name"
              disabled={isSubmitting}
            />
          </div>

          {/* Permissions Section */}
          <div className="space-y-2">
            <Label>Permissions</Label>
            <Card>
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {availablePermissions.map((permission) => (
                    <TooltipProvider key={permission.id}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <div className="flex items-center space-x-2">
                            <Checkbox
                              id={permission.id}
                              checked={permissions.includes(permission.id)}
                              onCheckedChange={() => handlePermissionToggle(permission.id)}
                              disabled={isSubmitting}
                            />
                            <Label
                              htmlFor={permission.id}
                              className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                            >
                              {permission.label}
                            </Label>
                          </div>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{permission.description}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Error Message */}
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="w-full sm:w-auto"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Creating...
              </>
            ) : (
              "Create Role"
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default RoleModal;
