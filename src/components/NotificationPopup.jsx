import React from "react";
import { useNotification } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";

const NotificationPopup = ({ open }) => {
  if (!open) return null;

  const { data } = useNotification();
  const navigate = useNavigate();


  console.log("data", data);
  const notifications = data?.data?.map((notification) => ({
    path: notification.link,
    message: notification.message,
  }));

  return (
    <div className="fixed top-16 left-1/2 -translate-x-1/2 w-[90vw] max-w-sm md:absolute md:top-full md:right-0 md:left-auto md:translate-x-0 md:w-96 md:mt-2 bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50">
      <h3 className="font-semibold mb-2 text-gray-700">Notifications</h3>

      <ul className="space-y-2 max-h-[60vh] overflow-y-auto">
        {notifications?.map((msg, index) => (
          <li
            key={index}
            className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors duration-200"
            onClick={() => navigate(msg.path)}
          >
            {msg.message}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPopup;
