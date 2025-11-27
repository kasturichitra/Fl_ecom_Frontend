importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/9.22.2/firebase-messaging-compat.js');

// Use your firebase config (same as client)
firebase.initializeApp({
  apiKey: "AIzaSyCWnVQDItp-zU1dGQ2MTPORAGWTVsMK3Gc",
  authDomain: "ecomgen-2bd99.firebaseapp.com",
  projectId: "ecomgen-2bd99",
  messagingSenderId: "565033272052",
  measurementId: "G-JP4DN1E7NE",
  appId: "1:565033272052:web:1c87ef8f105be0e7a754a1",
});

const messaging = firebase.messaging();

messaging.onBackgroundMessage((payload) => {
  const notification = payload.notification || {};
  self.registration.showNotification(notification.title || "Background Message", {
    body: notification.body || "",
    icon: notification.icon || "/icon.png",
  });
});