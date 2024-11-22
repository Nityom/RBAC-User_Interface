import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store";
import { deleteUser } from "@/redux/slices/userSlice";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
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
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Edit, Trash2, ChevronDown } from "lucide-react";

interface User {
  id: string;
  name: string;
  role: string;
  status: string;
}

interface UserTableProps {
  users: User[];
  onEdit: (user: User) => void;
}

const UserTable: React.FC<UserTableProps> = ({ users, onEdit }) => {
  const dispatch: AppDispatch = useDispatch();

  const [filterText, setFilterText] = useState("");
  const [filterStatus, setFilterStatus] = useState<string | null>(null);
  const [sortCriteria, setSortCriteria] = useState<"name" | "role" | null>(null);
  const [isAscending, setIsAscending] = useState(true);

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" => {
    return status === "Active" ? "default" : "secondary";
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilterText(e.target.value.toLowerCase());
  };

  const handleStatusFilter = (status: string | null) => {
    setFilterStatus(status);
  };

  const handleSort = (criteria: "name" | "role" | null) => {
    if (sortCriteria === criteria) {
      setIsAscending(!isAscending); // Toggle ascending/descending
    } else {
      setSortCriteria(criteria);
      setIsAscending(true); // Reset to ascending on new criteria
    }
  };

  // Apply filters
  const filteredUsers = users
    .filter(
      (user) =>
        user.name.toLowerCase().includes(filterText) ||
        user.role.toLowerCase().includes(filterText)
    )
    .filter((user) => (filterStatus ? user.status === filterStatus : true));

  // Apply sorting
  const sortedUsers = sortCriteria
    ? [...filteredUsers].sort((a, b) => {
        const valueA = sortCriteria === "name" ? a.name : a.role;
        const valueB = sortCriteria === "name" ? b.name : b.role;
        const compareValue = valueA.localeCompare(valueB);
        return isAscending ? compareValue : -compareValue;
      })
    : filteredUsers;

  return (
    <div className="rounded-md border p-2 sm:p-4">
      <div className="flex flex-wrap gap-2 justify-between items-center">
        <Input
          placeholder="Filter by name or role..."
          value={filterText}
          onChange={handleFilterChange}
          className="w-full sm:w-1/3"
        />
        <div className="flex flex-wrap gap-2">
          <Button
            variant={filterStatus === "Active" ? "default" : "outline"}
            onClick={() => handleStatusFilter("Active")}
            className="text-sm"
          >
            Active
          </Button>
          <Button
            variant={filterStatus === "Inactive" ? "default" : "outline"}
            onClick={() => handleStatusFilter("Inactive")}
            className="text-sm"
          >
            Inactive
          </Button>
          <Button
            variant={filterStatus === null ? "default" : "outline"}
            onClick={() => handleStatusFilter(null)}
            className="text-sm"
          >
            All
          </Button>

          {/* Sort Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                Sort
                <ChevronDown className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40">
              <DropdownMenuItem onClick={() => handleSort("name")}>
                {sortCriteria === "name" && (isAscending ? "↑ " : "↓ ")}
                Sort by Name
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort("role")}>
                {sortCriteria === "role" && (isAscending ? "↑ " : "↓ ")}
                Sort by Role
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleSort(null)}>
                Clear Sort
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
      <div className="mt-4">
        <Table className="hidden sm:table">
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="w-[100px]">Status</TableHead>
              <TableHead className="text-right w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {sortedUsers.map((user) => (
              <TableRow key={user.id}>
                <TableCell className="font-medium">{user.name}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <Badge variant={getStatusBadgeVariant(user.status)}>
                    {user.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => onEdit(user)}
                      className="h-8 w-8"
                    >
                      <Edit className="h-4 w-4" />
                    </Button>

                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button
                          variant="outline"
                          size="icon"
                          className="h-8 w-8 text-red-500 hover:text-red-500 hover:border-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>Delete User</AlertDialogTitle>
                          <AlertDialogDescription>
                            Are you sure you want to delete this user? This
                            action cannot be undone.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() => handleDelete(user.id)}
                            className="bg-red-500 hover:bg-red-600"
                          >
                            Delete
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {sortedUsers.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={4}
                  className="text-center text-muted-foreground"
                >
                  No users found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        {/* Mobile View */}
        <div className="sm:hidden">
          {sortedUsers.map((user) => (
            <div
              key={user.id}
              className="border rounded p-2 mb-2 flex flex-col gap-2"
            >
              <div className="font-medium text-lg">{user.name}</div>
              <div className="text-sm">Role: {user.role}</div>
              <div className="text-sm">
                Status:{" "}
                <Badge variant={getStatusBadgeVariant(user.status)}>
                  {user.status}
                </Badge>
              </div>
              <div className="flex justify-end gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => onEdit(user)}
                  className="h-8 w-8"
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <AlertDialog>
                  <AlertDialogTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      className="h-8 w-8 text-red-500 hover:text-red-500 hover:border-red-500"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </AlertDialogTrigger>
                  <AlertDialogContent>
                    <AlertDialogHeader>
                      <AlertDialogTitle>Delete User</AlertDialogTitle>
                      <AlertDialogDescription>
                        Are you sure you want to delete this user? This action
                        cannot be undone.
                      </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                      <AlertDialogAction
                        onClick={() => handleDelete(user.id)}
                        className="bg-red-500 hover:bg-red-600"
                      >
                        Delete
                      </AlertDialogAction>
                    </AlertDialogFooter>
                  </AlertDialogContent>
                </AlertDialog>
              </div>
            </div>
          ))}
          {sortedUsers.length === 0 && (
            <div className="text-center text-muted-foreground">
              No users found.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserTable;
