import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  FileText,
  BarChart,
  Settings,
  Menu,
  X,
  ClipboardList,
  Building2,
  Warehouse,
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "POS", path: "/pos", icon: ShoppingCart },
    { name: "AuditLog", path: "/auditlog", icon: Building2 },
    { name: "Branches", path: "/branches", icon: Settings },
    { name: "Ledger", path: "/ledger", icon: FileText },
    { name: "Vendors", path: "/vendors", icon: ClipboardList },
    { name: "Sales", path: "/sales", icon: BarChart },
    { name: "Purchases", path: "/purchases", icon: FileText },
    { name: "Stock Movement", path: "/branch-stock", icon: Warehouse },
  ];

  return (
    <div className="sticky top-0 left-0 h-screen flex-shrink-0 z-50">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 h-full dark:text-white text-gray-900 
          min-h-screen transition-all duration-100 dark:duration-0 dark:transition-none border-r border-gray-200 dark:border-gray-800
          ${isOpen ? "w-56" : "w-20"} hidden md:block
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between py-4 px-4 border-b border-gray-200 dark:border-gray-800">
          {isOpen && (
            <div className="flex items-center gap-2">
              <ShoppingCart size={28} className="text-yellow-500" />
              <h1 className="text-xl font-bold">
                <span className="text-gray-800 dark:text-gray-200">Retail</span>
                <span className="bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 bg-clip-text text-transparent">
                  MS
                </span>
              </h1>
            </div>
          )}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-3">
          {navItems.map((item) => {
            const Icon = item.icon;
            const active = pathname === item.path;
            return (
              <div key={item.path} className="relative group">
                <Link
                  to={item.path}
                  className={`flex items-center gap-4 p-2 rounded transition-all font-medium
                    ${active
                      ? "bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 text-white shadow-md"
                      : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                    }
                  `}
                >
                  <Icon size={22} />
                  {isOpen && <span>{item.name}</span>}
                </Link>

                {/* Tooltip (only show when collapsed) */}
                {!isOpen && (
                  <div
                    className="absolute left-full top-1/2 -translate-y-1/2 ml-3 
                               bg-gradient-to-r from-yellow-400 via-yellow-500 to-yellow-600 
                               text-white text-sm px-2 py-1 rounded-md shadow-lg 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-200 whitespace-nowrap
                               z-100"
                  >
                    {item.name}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
