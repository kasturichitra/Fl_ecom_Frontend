import React, { useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink, useLocation, Link } from "react-router-dom";
import { lazy, Suspense } from "react";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import { Toaster, ToastIcon } from "react-hot-toast";
import OrderListManager from "./pages/Orders/OrderListManager";
import { useStoreFcmToken } from "./hooks/useUser";
import Navbar from "./components/Navbar";
import { listenForForegroundMessages, requestPermissionAndGetToken } from "./lib/notifications";
import UserList from "./pages/users/UserList";

// Lazy-loaded pages
const CategoryManager = lazy(() => import("./pages/CategoryManager/CategoryManager"));
const IndustryTypeManager = lazy(() => import("./pages/industryType/IndustryTypeManager"));
const BrandManager = lazy(() => import("./pages/BrandManager/BrandManager"));
const ProductManager = lazy(() => import("./pages/ProductManager/ProductManager"));

const ProductList = lazy(() => import("./pages/ProductManager/ProductList"));
const IndustryTypeList = lazy(() => import("./pages/industryType/IndustryTypeList"));
const CategoryListManager = lazy(() => import("./pages/CategoryManager/CategoryListManager"));
const BrandListManager = lazy(() => import("./pages/BrandManager/BrandListManager"));
const OrderProductsDetailes = lazy(() => import("./pages/Orders/OrderProductsDetailes"));
// Home Page
const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gradient-to-br from-indigo-50 to-purple-100">
    <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-700 mb-6">
      Admin Dashboard
    </h1>
    <p className="text-xl text-gray-700 mb-10">Manage your store with ease</p>
    <NavLink
      to="/industryTypeList"
      className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-10 py-5 rounded-2xl font-bold text-xl shadow-2xl hover:shadow-purple-500/50 transform hover:scale-110 transition duration-300"
    >
      Get Started
    </NavLink>
  </div>
);

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth", // remove "smooth" if you want instant scroll
    });
  }, [pathname]);
  return null;
};

const App = () => {
  const { mutateAsync: storeFcmToken } = useStoreFcmToken();

  useEffect(() => {
    async function initFCM() {
      try {
        const token = await requestPermissionAndGetToken(import.meta.env.VITE_FIREBASE_VAPID_PUBLIC_KEY);

        if (token) {
          await storeFcmToken({ token });
          console.log("Token stored:", token);
        }
      } catch (err) {
        console.error("FCM error:", err);
      }
    }

    initFCM();
    listenForForegroundMessages();
  }, []);

  return (
    <Router>
      <ScrollToTop />
      <Toaster position="top-right" />
      {/* Sidebar */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white shadow-2xl z-50 overflow-y-auto">
        <div className="p-8 border-b border-gray-800">
          <Link to={"/"}>
            <h1 className="text-3xl font-bold tracking-wider bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-400 text-sm mt-2">Management System</p>
          </Link>
        </div>

        <nav className="mt-8 space-y-3 px-6">
          {/* Home */}
          <NavLink
            to="/"
            end
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"
              />
            </svg>
            <span>Dashboard Home</span>
          </NavLink>

          <div className="h-px bg-gray-800 my-6" />

          {/* Divider */}

          {/* Direct Links — No Dropdown */}
          <NavLink
            to="/industryTypeList"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5"
              />
            </svg>
            <span>Industry Types</span>
          </NavLink>

          <NavLink
            to="/CategoryList"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
            </svg>
            <span>Categories</span>
          </NavLink>

          <NavLink
            to="/brands"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
              />
            </svg>
            <span>Brands</span>
          </NavLink>

          <NavLink
            to="/productList"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
              />
            </svg>
            <span>Products</span>
          </NavLink>
          <NavLink
            to="/order"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"
              />
            </svg>
            <span>Order</span>
          </NavLink>
          <NavLink
            to="/user"
            className={({ isActive }) =>
              `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                isActive
                  ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                  : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
              }`
            }
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5.121 17.804A9 9 0 0112 15a9 9 0 016.879 2.804M15 10a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>

            <span>Users</span>
          </NavLink>
        </nav>
      </aside>

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="ml-72 pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="p-8">
          <Suspense
            fallback={
              <div className="flex items-center justify-center h-screen">
                <div className="text-3xl font-bold text-indigo-600 animate-pulse">Loading...</div>
              </div>
            }
          >
            <Routes>
              <Route path="/" element={<Home />} />

              {/* List Pages */}
              <Route path="/industryTypeList" element={<IndustryTypeList />} />
              <Route path="/CategoryList" element={<CategoryListManager />} />
              <Route path="/brands" element={<BrandListManager />} />
              <Route path="/productList" element={<ProductList />} />
              <Route path="/order" element={<OrderListManager />} />

              {/* Add / Create Pages (usually opened as modals, but accessible via URL) */}
              <Route path="/add-industry-type" element={<IndustryTypeManager />} />
              <Route path="/add-category" element={<CategoryManager />} />
              <Route path="/add-brand" element={<BrandManager />} />
              <Route path="/add-product" element={<ProductManager />} />
              <Route path="/order-products-detailes/:id" element={<OrderProductsDetailes />} />

              <Route path="/user" element={<UserList />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </Router>
  );
};

export default App;
