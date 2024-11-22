import React, { useState } from "react";
import { useDispatch } from "react-redux";
import { AppDispatch } from "@/redux/store"; // Ensure your store exports AppDispatch
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
import { Input } from "@/components/ui/input"; // Assuming you have a styled Input component
import { Edit, Trash2, SortAsc, SortDesc } from "lucide-react";

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

  const [filter, setFilter] = useState("");
  const [sortCriteria, setSortCriteria] = useState<"name" | "role" | null>(null);
  const [isAscending, setIsAscending] = useState(true);

  const handleDelete = (id: string) => {
    dispatch(deleteUser(id));
  };

  const getStatusBadgeVariant = (status: string): "default" | "secondary" => {
    return status === "Active" ? "default" : "secondary";
  };

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFilter(e.target.value.toLowerCase());
  };

  const toggleSort = (criteria: "name" | "role") => {
    setSortCriteria(criteria);
    setIsAscending((prev) => (sortCriteria === criteria ? !prev : true));
  };

  const filteredUsers = users.filter((user) =>
    user.name.toLowerCase().includes(filter) || user.role.toLowerCase().includes(filter)
  );

  const sortedUsers = sortCriteria
    ? [...filteredUsers].sort((a, b) => {
        const valueA = sortCriteria === "name" ? a.name : a.role;
        const valueB = sortCriteria === "name" ? b.name : b.role;
        const compareValue = valueA.localeCompare(valueB);
        return isAscending ? compareValue : -compareValue;
      })
    : filteredUsers;

  return (
    <div className="rounded-md border">
      <div className="p-4 flex justify-between items-center">
        <Input
          placeholder="Filter users..."
          value={filter}
          onChange={handleFilterChange}
          className="w-1/3"
        />
        <div className="flex gap-4">
          <Button
            variant="outline"
            onClick={() => toggleSort("name")}
            className="flex items-center gap-2"
          >
            {sortCriteria === "name" && (isAscending ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
            Sort by Name
          </Button>
          <Button
            variant="outline"
            onClick={() => toggleSort("role")}
            className="flex items-center gap-2"
          >
            {sortCriteria === "role" && (isAscending ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />)}
            Sort by Role
          </Button>
        </div>
      </div>
      <Table>
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
                          Are you sure you want to delete this user? This action cannot be undone.
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
              <TableCell colSpan={4} className="text-center text-muted-foreground">
                No users found.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
};

export default UserTable;
