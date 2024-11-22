import React from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteRole } from "@/redux/slices/roleSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { MoreHorizontal, Edit2, Trash2, Shield } from "lucide-react";

interface Role {
  id: string;
  name: string;
  permissions: string[];
}

interface RoleTableProps {
  roles: Role[];
  onRoleClick: (roleId: string) => void;
  isLoading?: boolean;
}

const RoleTable: React.FC<RoleTableProps> = ({ roles, onRoleClick, isLoading = false }) => {
  const dispatch: AppDispatch = useDispatch();

  const handleDelete = (roleId: string) => {
    dispatch(deleteRole(roleId));
  };

  const getPermissionVariant = (permission: string): "default" | "secondary" | "outline" => {
    const permissionMap: { [key: string]: "default" | "secondary" | "outline" } = {
      read: "default",
      write: "secondary",
      delete: "outline",
      manage: "secondary",
      admin: "default",
    };

    const type = Object.keys(permissionMap).find((key) =>
      permission.toLowerCase().includes(key)
    );

    return permissionMap[type || ""] || "secondary";
  };

  if (isLoading) {
    return (
      <div className="w-full h-64 flex items-center justify-center">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <Shield className="h-8 w-8 animate-pulse" />
          <p>Loading roles...</p>
        </div>
      </div>
    );
  }

  if (roles.length === 0) {
    return (
      <div className="w-full h-64 flex items-center justify-center border rounded-lg">
        <div className="flex flex-col items-center gap-2 text-muted-foreground">
          <p>No roles found</p>
          <p className="text-sm">Create a role to get started</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full border rounded-lg overflow-x-auto">
      <Table className="min-w-full">
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px] sm:w-[150px]">Role Name</TableHead>
            <TableHead className="min-w-[300px] sm:min-w-[200px] hidden md:table-cell">
              Permissions
            </TableHead>
            <TableHead className="w-[150px] sm:w-[100px] text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {roles.map((role) => (
            <TableRow key={role.id}>
              <TableCell className="font-medium">
                <div className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-muted-foreground" />
                  {role.name}
                </div>
              </TableCell>
              <TableCell className="hidden md:table-cell">
                <ScrollArea className="w-full max-h-20">
                  <div className="flex flex-wrap gap-2">
                    {role.permissions.map((permission, index) => (
                      <Badge
                        key={index}
                        variant={getPermissionVariant(permission)}
                        className="cursor-help"
                      >
                        {permission}
                      </Badge>
                    ))}
                  </div>
                </ScrollArea>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="hover:bg-secondary hover:text-secondary-foreground"
                    >
                      <MoreHorizontal className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-40">
                    <DropdownMenuItem onClick={() => onRoleClick(role.id)}>
                      <Edit2 className="mr-2 h-4 w-4" />
                      Edit
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      asChild
                      onClick={(e) => e.stopPropagation()} // Prevent dropdown from closing
                    >
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <div className="flex items-center cursor-pointer text-destructive">
                            <Trash2 className="mr-2 h-4 w-4" />
                            Delete
                          </div>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-white text-black dark:bg-gray-800 dark:text-gray-100">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-lg font-bold">Delete Role</AlertDialogTitle>
                            <AlertDialogDescription className="text-sm">
                              Are you sure you want to delete{" "}
                              <span className="font-semibold">{role.name}</span>? This action
                              cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="px-4 py-2 bg-gray-200 text-black dark:bg-gray-700 dark:text-gray-100 rounded-md">
                              Cancel
                            </AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(role.id)}
                              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                            >
                              Delete Role
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default RoleTable;
