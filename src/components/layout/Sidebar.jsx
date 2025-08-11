import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  FileText,
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
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Supliers", path: "/vendors", icon: Users },
    { name: "Order", path: "/orders", icon: ShoppingCart },
    { name: "Manage Store", path: "/manage-store", icon: Package }, // Placeholder for settings
  ];

  return (
    <div className="flex border-r border-gray-200 dark:border-gray-700">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 dark:text-white text-gray-900 min-h-screen p-4 transition-all duration-300 ${isOpen ? "w-64" : "w-16"
          }`}
      >
        {/* Header with toggle */}
        <div className="flex items-center justify-between mb-8">
          {isOpen && <div className="flex items-center space-x-3">
            {/* Shopping Cart Icon */}
            <ShoppingCart
              size={35}
              className="text-gray-800 dark:text-gray-200 drop-shadow-[0_0_4px_rgba(0,0,0,0.5)]"
            />
            {/* Text */}
            <h1 className="text-[25px] font-bold">
              <span className="text-gray-800 dark:text-gray-200">
                Retail
              </span>
              <span className="text-[#FFC107] drop-shadow-[0_0_20px_#FFC107]">
                MS
              </span>
            </h1>
          </div>
          }
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 -mr-2 rounded-md hover:bg-gray-200 dark:hover:bg-gray-800"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="space-y-4">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-5 p-2 rounded-md transition-colors ${active
                  ? " text-yellow-400 dark:bg-gray-800"
                  : "hover:bg-gray-200 dark:hover:bg-gray-800"
                  }`}
              >
                <Icon size={20} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
