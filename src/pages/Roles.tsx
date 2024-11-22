import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRoles } from "../redux/slices/roleSlice";
import RoleTable from "../components/RoleTable";
import PermissionEditor from "../components/PermissionEditor";
import { RootState, AppDispatch } from "../redux/store";
import RoleModal from "@/components/RoleMode";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { PlusCircle, Users, Settings, AlertCircle, Loader2 } from "lucide-react";

const Roles: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { data: roles, loading, error } = useSelector((state: RootState) => state.roles) as { 
    data: { id: string; name: string; permissions: string[] }[]; 
    loading: boolean; 
    error: string | null 
  };

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRole, setSelectedRole] = useState<string | null>(null);
  const [selectedPermissions, setSelectedPermissions] = useState<string[]>([]);

  const permissions = [
    {
      id: "dashboard",
      name: "Dashboard",
      children: [
        { id: "view_dashboard", name: "View Dashboard" },
        { id: "edit_dashboard", name: "Edit Dashboard" },
      ],
    },
    {
      id: "users",
      name: "Users",
      children: [
        { id: "view_users", name: "View Users" },
        { id: "edit_users", name: "Edit Users" },
        { id: "delete_users", name: "Delete Users" },
      ],
    },
    {
      id: "settings",
      name: "Settings",
      children: [{ id: "edit_settings", name: "Edit Settings" }],
    },
  ];

  useEffect(() => {
    dispatch(fetchRoles());
  }, [dispatch]);

  const handleRoleClick = (roleId: string) => {
    setSelectedRole(roleId);
    const role = roles.find((r) => r.id === roleId);
    setSelectedPermissions(role ? role.permissions : []);
  };

  const handlePermissionsChange = (updatedPermissions: string[]) => {
    setSelectedPermissions(updatedPermissions);
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    dispatch(fetchRoles());
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="flex items-center space-x-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span className="text-lg">Loading roles...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>Error loading roles: {error}</AlertDescription>
        </Alert>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6 h-[80vh]">
      <div className="flex flex-col lg:flex-row justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Role Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user roles and permissions for your organization
          </p>
        </div>
        <Button 
          onClick={() => setIsModalOpen(true)}
          className="mt-4 lg:mt-0 flex items-center space-x-2"
        >
          <PlusCircle className="h-4 w-4" />
          <span>Add Role</span>
        </Button>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Roles Section */}
        <Card className="flex flex-col h-[68vh]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Users className="h-5 w-5" />
              <span>Roles</span>
            </CardTitle>
            <CardDescription>
              Select a role to manage its permissions
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <ScrollArea>
              <RoleTable roles={roles} onRoleClick={handleRoleClick} />
            </ScrollArea>
          </CardContent>
        </Card>

        {/* Permissions Section */}
        <Card className="flex flex-col h-[68vh]">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Settings className="h-5 w-5" />
              <span>Permissions</span>
            </CardTitle>
            <CardDescription>
              {selectedRole 
                ? "Configure permissions for the selected role" 
                : "Select a role to edit its permissions"}
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-grow overflow-auto">
            <ScrollArea>
              {selectedRole ? (
                <PermissionEditor
                  roleId={selectedRole}
                  permissions={permissions}
                  selectedPermissions={selectedPermissions}
                  onChange={handlePermissionsChange}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-muted-foreground">
                  Select a role from the left panel to edit its permissions
                </div>
              )}
            </ScrollArea>
          </CardContent>
        </Card>
      </div>

      <RoleModal isOpen={isModalOpen} onClose={handleModalClose} />
    </div>
  );
};

export default Roles;
