import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage";

import categoryReducer from "./categorySlice";
import industryTypeReducer from "./industryTypeSlice";
import brandReducer from "./brandSlice"; // ✅ renamed for clarity
import productReducer from "./productSlice";

const persistConfig = {
  key: "root",
  storage,
  blacklist: [], // You can add slices here if you don't want to persist them
};

const rootReducer = combineReducers({
  categories: categoryReducer,
  industryTypes: industryTypeReducer,
  brands: brandReducer, // ✅ now correctly named
  products: productReducer,
});

const persistedReducer = persistReducer(persistConfig, rootReducer);

const store = configureStore({
  reducer: persistedReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: [
          "persist/PERSIST",
          "persist/REHYDRATE",
          "persist/FLUSH",
          "persist/PAUSE",
          "persist/PURGE",
          "persist/REGISTER",
        ],
      },
    }),
});

export const persistor = persistStore(store);
export default store;
