import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes, useLocation } from "react-router-dom";
import { useStoreFcmToken } from "./hooks/useUser";
import { listenForForegroundMessages, requestPermissionAndGetToken } from "./lib/notifications";
import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";
import CreateOrder from "./pages/Orders/CreateOrder";
import OrderListManager from "./pages/Orders/OrderListManager";
import PageNotFound from "./pages/PageNotFound/PageNotFound";
import EmployeeList from "./pages/users/EmployeeList";
import UsersList from "./pages/users/UsersList";
import NotificationList from "./pages/Notifications/NotificationList";
import Dashboard from "./pages/Dashboard";
import SingleSaleTrendPage from "./pages/SaleTrends/SingleSaleTrendPage";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import VerifyOtp from "./pages/VerifyOtp";
import ForgotPassword from "./pages/ForgotPassword";
import ForgotOtp from "./pages/ForgotOtp";
import ResetPassword from "./pages/ResetPassword";
import ProtectedRoute from "./components/ProtectedRoute";
import ContactInfoManager from "./pages/ContactInfo/ContactInfoManager";

// Lazy-loaded pages
const CategoryManager = lazy(() => import("./pages/CategoryManager/CategoryManager"));
const IndustryTypeManager = lazy(() => import("./pages/industryType/IndustryTypeManager"));
const BrandManager = lazy(() => import("./pages/BrandManager/BrandManager"));
const ProductManager = lazy(() => import("./pages/ProductManager/ProductManager"));

const ProductList = lazy(() => import("./pages/ProductManager/ProductList"));
const IndustryTypeList = lazy(() => import("./pages/industryType/IndustryTypeList"));
const SaleTrends = lazy(() => import("./pages/SaleTrends/SaleTrendsList"));
const CategoryListManager = lazy(() => import("./pages/CategoryManager/CategoryListManager"));
const BrandListManager = lazy(() => import("./pages/BrandManager/BrandListManager"));
const OrderProductsDetailes = lazy(() => import("./pages/Orders/OrderProductsDetailes"));
const ThemeManager = lazy(() => import("./pages/ThemeManager/ThemeManager"));

const ScrollToTop = () => {
  const { pathname } = useLocation();
  useEffect(() => {
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: "smooth",
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

      <Routes>
        {/* Auth Routes - No Sidebar/Navbar */}
        <Route
          path="/login"
          element={
            <AuthLayout>
              <Login />
            </AuthLayout>
          }
        />

        <Route
          path="/verify-otp"
          element={
            <AuthLayout>
              <VerifyOtp />
            </AuthLayout>
          }
        />

        <Route
          path="/forgot-password"
          element={
            <AuthLayout>
              <ForgotPassword />
            </AuthLayout>
          }
        />

        <Route
          path="/verify-forgot-otp"
          element={
            <AuthLayout>
              <ForgotOtp />
            </AuthLayout>
          }
        />

        <Route
          path="/reset-password"
          element={
            <AuthLayout>
              <ResetPassword />
            </AuthLayout>
          }
        />

        <Route
          path="/signup"
          element={
            <AuthLayout>
              <Signup />
            </AuthLayout>
          }
        />

        {/* Main Routes - With Sidebar/Navbar */}
        <Route element={<ProtectedRoute />}>
          <Route
            path="/*"
            element={
              <MainLayout>
                <Suspense
                  fallback={
                    <div className="flex items-center justify-center h-screen">
                      <div className="text-3xl font-bold text-indigo-600 animate-pulse">Loading...</div>
                    </div>
                  }
                >
                  <Routes>
                    <Route path="/" element={<Dashboard />} />

                    {/* List Pages */}
                    <Route path="/industryTypeList" element={<IndustryTypeList />} />
                    <Route path="/saleTrends" element={<SaleTrends />} />
                    <Route path="/saleTrends/:id" element={<SingleSaleTrendPage />} />
                    <Route path="/CategoryList" element={<CategoryListManager />} />
                    <Route path="/brands" element={<BrandListManager />} />
                    <Route path="/productList" element={<ProductList />} />
                    <Route path="/order" element={<OrderListManager />} />

                    {/* Add / Create Pages */}
                    <Route path="/add-industry-type" element={<IndustryTypeManager />} />
                    <Route path="/add-category" element={<CategoryManager />} />
                    <Route path="/add-brand" element={<BrandManager />} />
                    <Route path="/add-product" element={<ProductManager />} />
                    <Route path="/order-products-detailes/:id" element={<OrderProductsDetailes />} />

                    <Route path="/createOrder" element={<CreateOrder />} />
                    <Route path="/employee" element={<EmployeeList />} />
                    <Route path="/theme" element={<ThemeManager />} />
                    <Route path="/users" element={<UsersList />} />
                    <Route path="/notificationList" element={<NotificationList />} />

                    <Route path="/contactInfo" element={<ContactInfoManager />} />


                    <Route path="*" element={<PageNotFound />} />
                  </Routes>
                </Suspense>
              </MainLayout>
            }
          />
        </Route>
      </Routes>
    </Router>
  );
};

export default App;
