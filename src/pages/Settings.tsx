import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Building, History, Lock, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Types
interface Department {
  id: number;
  name: string;
  head: string;
  email: string;
}

interface AuditLog {
  timestamp: string;
  user: string;
  action: string;
  details: string;
}

const Settings: React.FC = () => {
  // State Variables
  const [departments, setDepartments] = useState<Department[]>([]);
  const [auditLogs, setAuditLogs] = useState<AuditLog[]>([
    {
      timestamp: "2024-03-23 14:30",
      user: "admin@example.com",
      action: "Modified",
      details: "Updated Sales department",
    },
  ]);
  const [newDepartment, setNewDepartment] = useState<Pick<Department, "name" | "head" | "email">>({
    name: "",
    head: "",
    email: "",
  });
  const [editingId, setEditingId] = useState<number | null>(null);
  const [selectedSection, setSelectedSection] = useState<"departments" | "audit" | "security">(
    "departments"
  );

  // Effects
  useEffect(() => {
    const storedDepartments = localStorage.getItem("departments");
    if (storedDepartments) {
      setDepartments(JSON.parse(storedDepartments) as Department[]);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("departments", JSON.stringify(departments));
  }, [departments]);

  // Handlers
  const handleAddDepartment = () => {
    if (newDepartment.name && newDepartment.head && newDepartment.email) {
      if (editingId !== null) {
        setDepartments((prev) =>
          prev.map((dept) =>
            dept.id === editingId ? { ...newDepartment, id: editingId } : dept
          )
        );
        setEditingId(null);
      } else {
        setDepartments((prev) => [
          ...prev,
          { id: Date.now(), ...newDepartment },
        ]);
      }
      setNewDepartment({ name: "", head: "", email: "" });
    }
  };

  const handleEdit = (department: Department) => {
    setNewDepartment({
      name: department.name,
      head: department.head,
      email: department.email,
    });
    setEditingId(department.id);
  };

  const handleDelete = (id: number) => {
    setDepartments((prev) => prev.filter((dept) => dept.id !== id));
  };

  const DepartmentCard: React.FC<{ department: Department }> = ({ department }) => (
    <div className="bg-card border rounded-lg p-4 mb-4">
      <div className="flex justify-between items-start mb-2">
        <div>
          <h3 className="font-medium">{department.name}</h3>
          <p className="text-sm text-gray-500">{department.head}</p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleEdit(department)}
          >
            Edit
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(department.id)}
          >
            Delete
          </Button>
        </div>
      </div>
      <p className="text-sm">{department.email}</p>
    </div>
  );

  return (
    <div className="w-full max-w-6xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <h1 className="text-2xl font-bold">System Settings</h1>
        <Badge variant="outline" className="px-4 py-1">
          Admin
        </Badge>
      </div>

      {/* Dropdown Menu */}
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="flex items-center gap-2">
            {selectedSection === "departments" && "Departments"}
            {selectedSection === "audit" && "Audit"}
            {selectedSection === "security" && "Security"}
            <ChevronDown className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start">
          <DropdownMenuItem onClick={() => setSelectedSection("departments")}>
            Departments
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedSection("audit")}>
            Audit
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => setSelectedSection("security")}>
            Security
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {/* Selected Section Content */}
      {selectedSection === "departments" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building className="w-5 h-5" />
              Department Management
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Add department form */}
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              <div className="space-y-2">
                <Label>Department Name</Label>
                <Input
                  placeholder="Enter department name"
                  value={newDepartment.name}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, name: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Department Head</Label>
                <Input
                  placeholder="Enter head name"
                  value={newDepartment.head}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, head: e.target.value })
                  }
                />
              </div>
              <div className="space-y-2">
                <Label>Contact Email</Label>
                <Input
                  type="email"
                  placeholder="Enter email"
                  value={newDepartment.email}
                  onChange={(e) =>
                    setNewDepartment({ ...newDepartment, email: e.target.value })
                  }
                />
              </div>
            </div>
            <Button
              onClick={handleAddDepartment}
              className="w-full sm:w-auto mt-2 sm:mt-0"
            >
              {editingId !== null ? "Update Department" : "Add Department"}
            </Button>
          </CardContent>
        </Card>
      )}

      {selectedSection === "audit" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <History className="w-5 h-5" />
              Audit Log
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="hidden sm:block overflow-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Timestamp</TableHead>
                    <TableHead>User</TableHead>
                    <TableHead>Action</TableHead>
                    <TableHead>Details</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {auditLogs.map((log, index) => (
                    <TableRow key={index}>
                      <TableCell>{log.timestamp}</TableCell>
                      <TableCell>{log.user}</TableCell>
                      <TableCell>{log.action}</TableCell>
                      <TableCell>{log.details}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      )}

      {selectedSection === "security" && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Lock className="w-5 h-5" />
              Security Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="flex flex-col gap-1">
                <Label>Two-Factor Authentication</Label>
                <p className="text-sm text-muted-foreground">
                  Require 2FA for all admin accounts
                </p>
              </div>
              <Switch />
            </div>
            <div className="flex flex-wrap gap-4 justify-between">
              <div className="flex flex-col gap-1">
                <Label>Session Timeout</Label>
                <p className="text-sm text-muted-foreground">
                  Auto logout after inactivity
                </p>
              </div>
              <Select>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Select timeout" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">1 hour</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Settings;
