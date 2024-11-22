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
  id: number;
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
      id: 1,
      timestamp: "2024-11-21 10:30",
      user: "admin@example.com",
      action: "Added",
      details: "Added Marketing department",
    },
    {
      id: 2,
      timestamp: "2024-11-22 14:45",
      user: "user@example.com",
      action: "Updated",
      details: "Updated Sales department",
    },
    {
      id: 3,
      timestamp: "2024-11-22 16:10",
      user: "admin@example.com",
      action: "Deleted",
      details: "Deleted HR department",
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
        const newDept = { id: Date.now(), ...newDepartment };
        setDepartments((prev) => [...prev, newDept]);

        // Log the addition to the audit log
        setAuditLogs((prev) => [
          ...prev,
          {
            id: prev.length + 1,
            timestamp: new Date().toISOString(),
            user: "admin@example.com",
            action: "Added",
            details: `Added ${newDept.name} department`,
          },
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
    const dept = departments.find((dept) => dept.id === id);
    if (dept) {
      setDepartments((prev) => prev.filter((dept) => dept.id !== id));

      // Log the deletion to the audit log
      setAuditLogs((prev) => [
        ...prev,
        {
          id: prev.length + 1,
          timestamp: new Date().toISOString(),
          user: "admin@example.com",
          action: "Deleted",
          details: `Deleted ${dept.name} department`,
        },
      ]);
    }
  };

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
            <TableBody>
  {departments.map((department) => (
    <TableRow key={department.id}>
      <TableCell>{department.name}</TableCell>
      <TableCell>{department.head}</TableCell>
      <TableCell>{department.email}</TableCell>
      <TableCell>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(department)} // Using handleEdit
          >
            Edit
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleDelete(department.id)} // Using handleDelete
          >
            Delete
          </Button>
        </div>
      </TableCell>
    </TableRow>
  ))}
</TableBody>

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
  <div className="block sm:hidden space-y-4">
    {auditLogs.map((log) => (
      <div
        key={log.id}
        className="bg-gray-100 border rounded-md p-4"
      >
        <p className="font-medium text-sm">
          <span className="text-gray-500">Timestamp:</span> {log.timestamp}
        </p>
        <p className="font-medium text-sm">
          <span className="text-gray-500">User:</span> {log.user}
        </p>
        <p className="font-medium text-sm">
          <span className="text-gray-500">Action:</span> {log.action}
        </p>
        <p className="font-medium text-sm">
          <span className="text-gray-500">Details:</span> {log.details}
        </p>
      </div>
    ))}
  </div>
  <div className="hidden sm:block overflow-x-auto">
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
        {auditLogs.map((log) => (
          <TableRow key={log.id}>
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
