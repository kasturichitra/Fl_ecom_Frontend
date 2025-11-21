import React, { useState, lazy, Suspense } from "react";
import { BrowserRouter as Router, Routes, Route, NavLink } from "react-router-dom";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import { Toaster } from "react-hot-toast";

// Lazy-loaded components
const CategoryManager = lazy(() => import("./pages/CategoryManager/CategoryManager"));
const IndustryTypeManager = lazy(() => import("./pages/industryType/IndustryTypeManager"));
const BrandManager = lazy(() => import("./pages/BrandManager/BrandManager"));
const ProductManager = lazy(() => import("./pages/ProductManager/ProductManager"));
const ProductList = lazy(() => import("./pages/ProductManager/ProductList"));
const IndustryTypeList = lazy(() => import("./pages/industryType/IndustryTypeList"));
const CategoryListManager = lazy(() => import("./pages/CategoryManager/CategoryListManager"));
const BrandListManager = lazy(() => import("./pages/BrandManager/BrandListManager"));

// --- Home Page ---
const Home = () => (
  <div className="flex flex-col items-center justify-center h-screen bg-gray-50">
    <h1 className="text-5xl font-extrabold text-indigo-600 mb-6">Admin Dashboard</h1>
    <p className="text-xl text-gray-600 mb-8">Welcome to your management panel</p>
    <NavLink
      to="/industryTypeList"
      className="bg-gradient-to-r from-indigo-600 to-purple-700 text-white px-8 py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-2xl transform hover:scale-105 transition"
    >
      Go to Industry Types
    </NavLink>
  </div>
);

const App = () => {
  const tenantID = "tenant123";
  const [isManagementOpen, setIsManagementOpen] = useState(true);

  const toggleManagementMenu = () => setIsManagementOpen((prev) => !prev);

  return (
    <Router>
      {/* --- Sidebar --- */}
      <aside className="fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white p-6 shadow-2xl z-50">
        <div className="mb-10">
          <h1 className="text-2xl font-bold tracking-wider">Admin Panel</h1>
          <p className="text-gray-400 text-sm mt-1">Management System</p>
        </div>

        <nav className="space-y-3">
          {/* Home */}
          <NavLink
            to="/"
            className={({ isActive }) =>
              `flex items-center gap-4 px-5 py-3 rounded-xl transition-all duration-200 ${
                isActive ? "bg-indigo-600 shadow-lg font-semibold" : "hover:bg-gray-800"
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
            <span className="text-lg">Home</span>
          </NavLink>

          {/* Management Dropdown */}
          <div>
            <button
              onClick={toggleManagementMenu}
              className="flex items-center justify-between w-full px-5 py-3 rounded-xl hover:bg-gray-800 transition-all duration-200"
            >
              <div className="flex items-center gap-4">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0H5"
                  />
                </svg>
                <span className="text-lg font-medium">Management</span>
              </div>
              <svg
                className={`w-5 h-5 transition-transform duration-300 ${isManagementOpen ? "rotate-90" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>

            {/* Dropdown Items */}
            <ul
              className={`mt-2 space-y-2 pl-10 transition-all duration-500 ${
                isManagementOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0 overflow-hidden"
              }`}
            >
              <li>
                <NavLink
                  to="/industryTypeList"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-5 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                  <span>Industry Types</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/CategoryList"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-5 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7h18M3 12h18M3 17h18" />
                  </svg>
                  <span>Categories</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/brands"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-5 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z"
                    />
                  </svg>
                  <span>Brands</span>
                </NavLink>
              </li>

              <li>
                <NavLink
                  to="/productList"
                  className={({ isActive }) =>
                    `flex items-center gap-3 py-3 px-5 rounded-lg transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-semibold shadow-md"
                        : "text-gray-300 hover:bg-gray-800 hover:text-white"
                    }`
                  }
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4"
                    />
                  </svg>
                  <span>Products</span>
                </NavLink>
              </li>
            </ul>
          </div>
        </nav>
      </aside>

      {/* --- Main Content --- */}
      <main className="ml-72 p-8 bg-gray-50 min-h-screen">
        <Suspense
          fallback={
            <div className="flex justify-center items-center h-screen">
              <div className="text-2xl font-bold text-indigo-600 animate-pulse">Loading...</div>
            </div>
          }
        >
          <Routes>
            <Route path="/" element={<Home />} />

            {/* Forms */}
            <Route path="/categories" element={<CategoryManager tenantID={tenantID} />} />
            <Route path="/industryType" element={<IndustryTypeManager tenantID={tenantID} />} />
            <Route path="/brands" element={<BrandListManager tenantID={tenantID} />} />
            <Route path="/product" element={<ProductManager tenantID={tenantID} />} />

            {/* Lists */}
            <Route path="/industryTypeList" element={<IndustryTypeList tenantID={tenantID} />} />
            <Route path="/CategoryList" element={<CategoryListManager tenantID={tenantID} />} />
            <Route path="/brands" element={<BrandListManager tenantID={tenantID} />} />
            <Route path="/productList" element={<ProductList tenantID={tenantID} />} />
            {/* <Route path="/productList" element={<ProductManager tenantID={tenantID} />} /> */}

            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </Suspense>
      </main>

      <Toaster position="top-right" reverseOrder={false} />
    </Router>
  );
};

export default App;
