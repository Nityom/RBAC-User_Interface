import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchUsers } from "@/redux/slices/userSlice";
import UserTable from "../components/UserTable";
import UserModal from "../components/UserModal";
import { RootState, AppDispatch } from "@/redux/store";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Loader2, UserPlus, Users as UsersIcon } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Separator } from "@/components/ui/separator";

const Users: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: users, loading, error } = useSelector((state: RootState) => state.users);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState<{
    id: string;
    name: string;
    role: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    dispatch(fetchUsers());
  }, [dispatch]);

  const handleEdit = (user: { id: string; name: string; role: string; status: string }) => {
    setUserToEdit(user);
    setIsModalOpen(true);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setUserToEdit(null);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center space-y-4">
          <Loader2 className="h-8 w-8 animate-spin mx-auto text-primary" />
          <p className="text-muted-foreground">Loading users...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-4 max-w-4xl mt-8">
        <Alert variant="destructive">
          <AlertTitle className="text-lg font-semibold">Error Loading Users</AlertTitle>
          <AlertDescription className="mt-2">
            We encountered an issue while fetching the user data. Please try again later or
            contact support if the problem persists.
            <div className="mt-2 text-sm opacity-80">{error}</div>
          </AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="h-[80vh] bg-gradient-to-b from-background to-muted/20 pb-8">
      <div className="container mx-auto px-4 py-8">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 space-y-4 md:space-y-0">
          <div className="space-y-1">
            <div className="flex items-center space-x-2">
              <UsersIcon className="h-6 w-6 text-primary" />
              <h1 className="text-3xl font-bold tracking-tight">Users</h1>
            </div>
            <p className="text-muted-foreground">
              Manage and oversee all user accounts in your system.
            </p>
          </div>
          <Button
            onClick={() => setIsModalOpen(true)}
            className="shadow-lg hover:shadow-xl transition-all"
            size="lg"
          >
            <UserPlus className="mr-2 h-5 w-5" />
            Add New User
          </Button>
        </div>

        <Separator className="mb-6" />

        {/* Main Content */}
        <Card className="shadow-xl">
          <CardHeader className="border-b bg-muted/50">
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <CardTitle>User Management</CardTitle>
                <CardDescription>Total Users: {users.length}</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="relative overflow-hidden">
              <UserTable users={users} onEdit={handleEdit} />
            </div>
          </CardContent>
        </Card>
      </div>

      <UserModal isOpen={isModalOpen} onClose={handleModalClose} userToEdit={userToEdit} />
    </div>
  );
};

export default Users;
