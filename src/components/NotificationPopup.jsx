import React from "react";
import { useNotification } from "../hooks/useNotification";
import { useNavigate } from "react-router-dom";

const NotificationPopup = ({ open }) => {
  if (!open) return null;

  const { data } = useNotification();
  const navigate = useNavigate();


  // console.log("data", data);
  const notifications = data?.data?.map((notification) => ({
    path: notification.link,
    message: notification.message,
  }));

  const maxVisible = 12; // number of notifications before scrolling
  const itemHeight = 40; // approximate height per notification
  const maxHeight = maxVisible * itemHeight;

  return (
    <div className="absolute right-0 mt-2 w-90 bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50">
      <h3 className="font-semibold mb-2 text-gray-700">Notifications</h3>

      <ul
        className="space-y-2"
        style={{
          maxHeight: notifications?.length > maxVisible ? `${maxHeight}px` : "auto",
          overflowY: notifications?.length > maxVisible ? "auto" : "visible",
        }}
      >
        {notifications?.map((msg, index) => (
          <li
            key={index}
            className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
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
