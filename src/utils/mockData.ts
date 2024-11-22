// src/utils/mockData.ts
const mockUsers = [
    { id: "1", name: "Admin", role: "Admin", status: "Active" },
    { id: "2", name: "Editor", role: "Editor", status: "Inactive" },
    { id: "3", name: "fff", role: "Viewer", status: "Active" },
  ];
  
  localStorage.setItem("usersData", JSON.stringify(mockUsers));
  