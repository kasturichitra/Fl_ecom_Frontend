import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { Provider } from "react-redux";
import { PersistGate } from "redux-persist/integration/react";
import { QueryClientProvider } from "@tanstack/react-query";

import store, { persistor } from "./redux/store.js";
import "./index.css";
import queryClient from "./react-query/queryClient.js";

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <Provider store={store}>
      <QueryClientProvider client={queryClient}>
        <PersistGate loading={null} persistor={persistor}>
          <App />
        </PersistGate>
      </QueryClientProvider>
    </Provider>
  </React.StrictMode>
);
