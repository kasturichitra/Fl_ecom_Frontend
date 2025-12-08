import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Link, NavLink, Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import Navbar from "./components/Navbar";
import { useStoreFcmToken } from "./hooks/useUser";
import { listenForForegroundMessages, requestPermissionAndGetToken } from "./lib/notifications";
// import UserList from "./pages/users/UserList";
import { sidebarElements } from "./lib/sidebar_elements";
import CreateOrder from "./pages/Orders/CreateOrder";
import OrderListManager from "./pages/Orders/OrderListManager";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import EmployeeList from "./pages/users/EmployeeList";
import UsersList from "./pages/users/UsersList";
import NotificationList from "./pages/Notifications/NotificationList";
import Orders from "./pages/Charts/OrdersStatus";
import OrderTypeChart from "./pages/Charts/OrderTypeChart";
import PaymentMethodChart from "./pages/Charts/PaymentMethodChart";
import OrdersLineChart from "./pages/Charts/OrdersLineChart";
import Dashboard from "./pages/Dashboard";

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
const ThemeManager = lazy(() => import("./pages/ThemeManager/ThemeManager"));
// Home Page
const Home = () => (
  <div className="flex flex-col gap-4">
    <div className="grid grid-cols-3 gap-4">
      <Orders />
      <OrderTypeChart />
      <PaymentMethodChart />
    </div>
    <div className="grid grid-cols-2 gap-4">
      <OrdersLineChart />
    </div>
    {/* <Dashboard /> */}
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
          {sidebarElements.map((item) => {
            // Render divider
            if (item.type === "divider") {
              return <div key={item.id} className="h-px bg-gray-800 my-6" />;
            }

            // Get the icon component
            const IconComponent = item.icon;

            // Render nav link
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${
                    isActive
                      ? "bg-gradient-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
                      : "text-gray-300 hover:bg-gray-800 hover:text-white hover:translate-x-2"
                  }`
                }
              >
                <IconComponent className="w-6 h-6" />
                <span>{item.label}</span>
              </NavLink>
            );
          })}
        </nav>
      </aside>

      {/* Navbar */}
      <Navbar />

      {/* Main Content Area */}
      <main className="ml-72 pt-16 min-h-screen bg-gradient-to-br from-gray-50 to-indigo-50">
        <div className="p-4">
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

              {/* <Route path="/user" element={<UserList />} /> */}
              <Route path="/createOrder" element={<CreateOrder />} />

              {/* <Route path="/docs" element={<NginxEC2Setup />} /> */}
              {/* <Route path="/docs/2" element={<NginxEC2Setup2 />} /> */}

              <Route path="/employee" element={<EmployeeList />} />
              <Route path="/theme" element={<ThemeManager />} />
              <Route path="/users" element={<UsersList />} />
              <Route path="/notificationList" element={<NotificationList />} />

              <Route path="*" element={<PageNotFound />} />
            </Routes>
          </Suspense>
        </div>
      </main>
    </Router>
  );
};

export default App;
