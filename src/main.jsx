import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { ReactQueryDevtools } from "@tanstack/react-query-devtools";

import store, { persistor } from "./redux/store.js";
import "./index.css";
import queryClient from "./react-query/queryClient.js";

// src/main.jsx (or similar startup file)
if ("serviceWorker" in navigator) {
  navigator.serviceWorker
    .register("/firebase-messaging-sw.js")
    .then((reg) => console.log("sw registered", reg.scope))
    .catch((err) => console.error("sw register failed", err));
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
          <ReactQueryDevtools initialIsOpen={false} />
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
