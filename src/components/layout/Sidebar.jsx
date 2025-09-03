import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  Home,
  ShoppingCart,
  Package,
  Users,
  FileText,
  BarChart,
  Settings,
  Menu,
  X,
  ClipboardList,
  Building2,
} from "lucide-react";

export default function Sidebar() {
  const { pathname } = useLocation();
  const [isOpen, setIsOpen] = useState(true);

  const navItems = [
    { name: "Dashboard", path: "/", icon: Home },
    { name: "POS", path: "/pos", icon: ShoppingCart },
    { name: "Inventory", path: "/inventory", icon: Package },
    { name: "Orders", path: "/orders", icon: ClipboardList },
    { name: "Customers", path: "/customers", icon: Users },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Sales", path: "/sales", icon: BarChart },
    { name: "AuditLog", path: "/auditlog", icon: Building2 },
    { name: "Branches", path: "/branches", icon: Settings },
  ];

  return (
    <div className="flex border-r  border-gray-200 dark:border-gray-700 relative">
      {/* Sidebar */}
      <aside
        className={`bg-white dark:bg-gray-900 dark:text-white text-gray-900 
          min-h-screen   shadow-md
          ${isOpen ? "w-55" : "w-20"}
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-800">
          {isOpen && (
            <div className="flex items-center gap-2">
              <ShoppingCart size={28} className="text-yellow-500" />
              <h1 className="text-xl font-bold">
                <span className="text-gray-800 dark:text-gray-200">Retail</span>
                <span className="text-yellow-500 ">MS</span>
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
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-4 p-2 rounded transition-all font-medium
                  ${active
                    ? "bg-yellow-500 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }
                `}
              >
                <Icon size={22} />
                {isOpen && <span>{item.name}</span>}
              </Link>
            );
          })}
        </nav>
      </aside>
    </div>
  );
}
