import React from "react";
import { useNotification } from "../hooks/useNotification";

const NotificationPopup = ({ open }) => {
  if (!open) return null;

  const {data } = useNotification();

//   console.log("notificationsData", notificationsData);


  const notifications = data?.map((notification) => notification.message);
//   console.log("newData", newData);


//   const notifications = [
//     "New order received",
//     "Stock is low for product XYZ",
//     "Your report is ready for download",
//     "User John added a new brand",
//   ];

  return (
    <div className="absolute right-0 mt-2 w-90 bg-white shadow-xl rounded-xl p-4 border border-gray-200 z-50">
      <h3 className="font-semibold mb-2 text-gray-700">Notifications</h3>

      <ul className="space-y-2">
        {notifications?.map((msg, index) => (
          <li
            key={index}
            className="text-sm text-gray-600 bg-gray-50 p-2 rounded-lg hover:bg-gray-100 cursor-pointer"
          >
            {msg}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default NotificationPopup;
