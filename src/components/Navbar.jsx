import React, { useState, useRef, useEffect } from "react";
import { BellIcon } from "@heroicons/react/24/outline";
import NotificationPopup from "./NotificationPopup";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const popupRef = useRef();

  useEffect(() => {
    function handleClickOutside(e) {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div className="fixed top-0 left-72 right-0 z-40 bg-white shadow-md p-1 px-10 flex justify-end mb-10">
      <div ref={popupRef} className="relative">
        <button
          onClick={() => setOpen((prev) => !prev)}
          className="relative p-2 hover:bg-gray-100 rounded-full"
        >
          <BellIcon className="w-7 h-7 text-gray-700" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        <NotificationPopup open={open} />
      </div>
    </div>
  );
};

export default Navbar;
