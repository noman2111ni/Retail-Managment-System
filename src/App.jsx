import { Routes, Route } from "react-router-dom";
import Sidebar from "./components/layout/Sidebar";
import DashboardPage from "./pages/DashboardPage";
import POS from "./components/layout/Pos";
import Login from "./pages/Login";
import Reports from "./pages/Reports";

function DashboardLayout() {
  
  return (
    <div className="flex h-full">
      <Sidebar />
       <main className="flex-1 bg-gray-50 overflow-y-auto">
        <Routes>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/pos" element={<POS />} />
          <Route path="/inventory" element={<h1>Inventory Page</h1>} />
           <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<div className="p-6">Page Not Found</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default function App() {
  return (
    <div className="flex flex-col h-screen ">
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* Dashboard routes */}
        <Route path="/*" element={<DashboardLayout />} />
      </Routes>
    </div>
  );
}