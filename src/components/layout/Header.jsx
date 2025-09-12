import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { ModeToggle } from "../mode-toggle";
import { Bell, LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = () => {
  const [open, setOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const { pathname } = useLocation();

  // LocalStorage se user read
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user] = useState(storedUser);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  const navItems = [
    { name: "Dashboard", path: "/" },
    { name: "POS", path: "/pos" },
    { name: "Sales", path: "/sales" },
    { name: "AuditLog", path: "/auditlog" },
    { name: "Branches", path: "/branches" },
    { name: "Branch Stock", path: "/branch-stock" },
    { name: "Vendors", path: "/vendors" },
    { name: "Ledger", path: "/ledger" },
  ];

  return (
    <header className="flex justify-between items-center px-4 sm:px-6 py-[8.5px] border-b  bg-white dark:bg-gray-900 sticky top-0 z-30">

      {/* Left: Logo + Mobile Menu */}
      <div className="flex items-center gap-4">
        {/* ✅ Show only on mobile */}
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="sm:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800"
        >
          <Menu className="w-6 h-6 text-gray-700 dark:text-gray-200" />
        </button>
        <h1 className="sm:hidden text-lg font-bold text-gray-800 dark:text-gray-100">
          Retail<span className="text-yellow-500">MS</span>
        </h1>
      </div>

      {/* Center: Nav Links (❌ hide on laptop/desktop, ✅ only mobile dropdown me show honge) */}
      <nav className="hidden"></nav>

      {/* Right side */}
      <div className="flex items-center lustify-center gap-4 relative">
        <ModeToggle />

        {/* <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button> */}

        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="focus:outline-none rounded-full  transition"
            >
              <Avatar className="h-[40px] w-[40px] ring-1 ring-gray-200 hover:ring-1 hover:ring-yellow-500   shadow-md mt-1">
                <AvatarImage
                  src="../public/images/avator.jpg"
                  // alt={user.username}
                  className="rounded-full object-cover h-full w-full"
                />
                <AvatarFallback className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white font-semibold flex items-center justify-center">
                  {user.username?.charAt(0).toUpperCase()}
                </AvatarFallback>
              </Avatar>
            </button>

            {open && (
              <div className="absolute right-0 mt-3 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 py-2 z-50">
                <div className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 border-b border-gray-200 dark:border-gray-700">
                  {user.username}
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center gap-2 w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-gray-700 rounded"
                >
                  <LogOut className="w-4 h-4" /> Logout
                </button>
              </div>
            )}
          </div>
        ) : (
          <a
            href="/login"
            className="px-3 py-2 bg-yellow-500 text-sm text-white rounded hover:bg-yellow-600 shadow-md transition"
          >
            Login
          </a>
        )}
      </div>

      {/* Mobile Nav Dropdown */}
      {menuOpen && (
        <div className="absolute top-14 left-0 w-full bg-white dark:bg-gray-900 sm:hidden border-b border-gray-100">
          <nav className="flex flex-col p-4 gap-3">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`block px-3 py-2 rounded ${pathname === item.path
                  ? "bg-yellow-500 text-white"
                  : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                  }`}
                onClick={() => setMenuOpen(false)}
              >
                {item.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
