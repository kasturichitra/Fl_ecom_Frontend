import React, { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import { LogOut } from "lucide-react";
import NotificationPopup from "./NotificationPopup";
import { useLogout } from "../hooks/useAuth";

const Navbar = ({ onToggleSidebar }) => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef();
  const { mutate: logout } = useLogout();

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="fixed top-0 md:left-72 left-0 right-0 z-40 bg-white shadow-md p-3 px-4 md:px-10 flex justify-between items-center transition-all duration-300">
      {/* Mobile Toggle Button */}
      <button
        onClick={onToggleSidebar} // Accepts prop from MainLayout
        className="md:hidden p-2 text-gray-700 hover:bg-gray-100 rounded-lg focus:outline-none"
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </button>

      {/* Placeholder to push content right on desktop if no hamburger */}
      <div className="hidden md:block"></div>

      <div className="flex items-center gap-2 md:gap-4">
        {/* Notification Bell */}
        <div ref={popupRef} className="relative">
          <button onClick={() => setOpen((prev) => !prev)} className="relative p-2 hover:bg-gray-100 rounded-full">
            <BellIcon className="w-6 h-6 md:w-7 md:h-7 text-gray-700" />
            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
          </button>

          <NotificationPopup open={open} />
        </div>

        {/* Logout Button */}
        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 md:px-4 hover:bg-red-50 rounded-full transition-all duration-300 group"
          title="Logout"
        >
          <LogOut className="w-5 h-5 md:w-6 md:h-6 text-gray-700 group-hover:text-red-600" />
          <span className="hidden md:block text-gray-700 group-hover:text-red-600 font-medium">Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Navbar;
