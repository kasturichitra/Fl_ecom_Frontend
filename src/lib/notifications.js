// src/notifications.js
import { getToken, onMessage } from "firebase/messaging";
import { messaging } from "./firebase";

// Call this to request permission and get the FCM token
// src/lib/notifications.js
export async function requestPermissionAndGetToken(vapidKey) {
  try {
    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      throw new Error("Notification permission not granted");
    }

    const currentToken = await getToken(messaging, { vapidKey });
    if (!currentToken) throw new Error("Failed to get token");
    return currentToken;
  } catch (error) {
    console.error("Error getting FCM token:", error);
    throw error;
  }
}

// Foreground messages
export function listenForForegroundMessages(callback) {
  try {
    onMessage(messaging, (payload) => {
      // payload is the message received in foreground
      callback(payload);
    });
  } catch (error) {
    console.error("Error listening for foreground messages:", error);
    throw error;
  }
}
