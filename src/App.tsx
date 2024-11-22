import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Navbar from "./components/Navbar";
import { Sidebar } from "./components/Sidebar";
import Dashboard from "./pages/Dashboard";
import Users from "./pages/Users";
import Roles from "./pages/Roles";
import Settings from "./pages/Settings";


const NotFound: React.FC = () => (
  <div className="flex items-center justify-center h-[80vh]">
    <h1 className="text-4xl font-bold text-gray-600">404 - Page Not Found</h1>
  </div>
);

const App: React.FC = () => {
  return (
    <Router>
      <div className="flex">
        {/* Sidebar Navigation */}
        <Sidebar />
        <div className="flex-grow">
          {/* Top Navbar */}
          <Navbar />
          {/* Main Content Routes */}
          <main className="p-4">
            <Routes>
           
              <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/users" element={<Users />} />
              <Route path="/roles" element={<Roles />} />
              {/* Default Route to Redirect to Dashboard */}
              <Route path="/" element={<Navigate to="/dashboard" />} />
              {/* Fallback Route for Undefined Paths */}
              <Route path="/settings" element={<Settings />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
