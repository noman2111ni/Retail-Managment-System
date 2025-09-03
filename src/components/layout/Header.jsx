import React, { useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { Input } from "../ui/input";
import { ModeToggle } from "../mode-toggle";
import { Bell, LogOut } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

const Header = () => {
  const [open, setOpen] = useState(false);

  // LocalStorage se user read
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const [user] = useState(storedUser);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access");
    localStorage.removeItem("refresh");
    window.location.href = "/login";
  };

  return (
    <header className="flex justify-between items-center px-6 py-[14px] border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-900 shadow-sm">
      {/* Search */}
      <div className="relative w-80">
        <IoSearchOutline className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400 dark:text-gray-300" />
        <Input
          placeholder="Search products, orders, etc."
          className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
        />
      </div>

      {/* Right side */}
      <div className="flex items-center gap-3 relative">
        <ModeToggle />
        <button className="relative p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800">
          <Bell className="w-5 h-5 text-gray-500 dark:text-gray-300" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {user ? (
          <div className="relative">
            <button
              onClick={() => setOpen(!open)}
              className="focus:outline-none rounded-full border-2 border-transparent hover:border-blue-500 transition"
            >
              <Avatar className="h-9 w-9 ring-2 ring-yellow-400 shadow-md">
                <AvatarImage
                  src={user.avatar}
                  alt={user.username}
                  className="rounded-full object-cover"
                />
                <AvatarFallback
                  className="bg-gradient-to-br from-yellow-400 via-yellow-500 to-orange-500 text-white font-semibold flex items-center justify-center"
                >
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
    </header>
  );
};

export default Header;
