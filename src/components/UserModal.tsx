import React, { useState, useEffect } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store"; // Ensure your store exports AppDispatch
import { createUser, updateUser } from "@/redux/slices/userSlice";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, Save, AlertCircle } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface UserModalProps {
  isOpen: boolean;
  onClose: () => void;
  userToEdit?: Partial<User> | null;
}

const UserModal: React.FC<UserModalProps> = ({ isOpen, onClose, userToEdit }) => {
  const [name, setName] = useState<string>("");
  const [role, setRole] = useState<string>("");
  const [status, setStatus] = useState<string>("Active");
  const [error, setError] = useState<string | null>(null);

  const dispatch: AppDispatch = useDispatch();

  useEffect(() => {
    if (userToEdit) {
      setName(userToEdit.name || "");
      setRole(userToEdit.role || "");
      setStatus(userToEdit.status || "Active");
    } else {
      setName("");
      setRole("");
      setStatus("Active");
    }
    setError(null);
  }, [userToEdit]);

  const handleSubmit = async () => {
    setError(null);

    if (!name.trim() || !role.trim()) {
      setError("Name and role are required fields.");
      return;
    }

    try {
      if (userToEdit?.id) {
        await dispatch(updateUser({ id: userToEdit.id, name, role, status })).unwrap();
      } else {
        await dispatch(createUser({ name, role, status })).unwrap();
      }
      onClose();
    } catch (err) {
      console.error("Error saving user:", err);
      setError("An error occurred while saving the user.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {userToEdit ? (
              <>
                <Save className="h-5 w-5" />
                Edit User
              </>
            ) : (
              <>
                <UserPlus className="h-5 w-5" />
                Add New User
              </>
            )}
          </DialogTitle>
        </DialogHeader>

        {error && (
          <Alert variant="destructive" className="my-2">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <Label htmlFor="name">Name</Label>
            <Input
              id="name"
              value={name}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value)}
              placeholder="Enter user name"
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="role">Role</Label>
            <Input
              id="role"
              value={role}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setRole(e.target.value)}
              placeholder="Enter user role"
              className="w-full"
            />
          </div>

          <div className="grid gap-2">
            <Label htmlFor="status">Status</Label>
            <Select value={status} onValueChange={(value) => setStatus(value)}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter className="flex gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="w-full sm:w-auto"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            className="w-full sm:w-auto"
          >
            {userToEdit ? "Save Changes" : "Add User"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default UserModal;
