import {
  BadgeDollarSign,
  Briefcase,
  Building2,
  ClipboardPlus,
  FileText,
  Home,
  Layers,
  LogOut,
  Package,
  Palette,
  Tag,
  Users,
  BadgePercent
} from "lucide-react";

/**
 * Sidebar Navigation Configuration
 * Centralized data for all sidebar menu items
 */

export const sidebarElements = [
  {
    id: "home",
    path: "/",
    label: "Dashboard",
    icon: Home,
    end: true, // For exact path matching
  },
  {
    id: "divider",
    type: "divider",
  },
  {
    id: "industry-types",
    path: "/industryTypeList",
    label: "Industry Types",
    icon: Building2,
  },
  {
    id: "categories",
    path: "/CategoryList",
    label: "Categories",
    icon: Layers,
  },
  {
    id: "brands",
    path: "/brands",
    label: "Brands",
    icon: Tag,
  },
  {
    id: "products",
    path: "/productList",
    label: "Products",
    icon: Package,
  },
  {
    id: "orders",
    path: "/order",
    label: "Order",
    icon: FileText,
  },
  {
    id: "employees",
    path: "/employee",
    label: "Employees",
    icon: Briefcase,
  },
  {
    id: "createOrder",
    path: "/createOrder",
    label: "Create Order",
    icon: ClipboardPlus,
  },
  {
    id: "theme",
    path: "/theme",
    label: "Theme",
    icon: Palette,
  },
  {
    id: "users",
    path: "/users",
    label: "Users",
    icon: Users,
  },
  {
    id: "coupons",
    path: "/coupons",
    label: "Coupons",
    icon: BadgePercent,
  },
  {
    id: "notifications",
    path: "/notificationList",
    label: "Notifications",
    icon: ClipboardPlus,
  },
  {
    id: "sale-trends",
    path: "/saleTrends",
    label: "Sale Trends",
    icon: BadgeDollarSign, // Using a placeholder icon, you might want to import FaChartLine or similar if available within lucide-react or react-icons
  },
  {
    id: "contact-info",
    path: "/contactInfo",
    label: "Contact Info",
    icon: ClipboardPlus,
  },
];
