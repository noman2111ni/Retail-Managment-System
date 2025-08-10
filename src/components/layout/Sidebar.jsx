import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  FileText,
  Bell,
  Menu,
  X,
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", path: "/dashboard", icon: Home },
    { name: "POS", path: "/pos", icon: ShoppingCart },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Vendors", path: "/vendors", icon: Users },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Alerts", path: "/alerts", icon: Bell },
  ];

  return (
    <div className="flex">
      {/* Sidebar */}
      <aside
        className={`bg-gray-900 text-white min-h-screen p-4 transition-all duration-300 ${
          isOpen ? "w-64" : "w-16"
        }`}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-6">
          {isOpen && <h1 className="text-xl font-bold">Retail Manager</h1>}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-md hover:bg-gray-800"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 p-2 rounded-md hover:bg-gray-800 transition-colors ${
                  active ? "bg-gray-800" : ""
                }`}
              >
                <Icon size={20} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>

      {/* Main Content Placeholder */}
    </div>
  );
}
