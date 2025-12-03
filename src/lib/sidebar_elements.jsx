import { Home, Building2, Layers, Tag, Package, FileText, Users } from "lucide-react";

/**
 * Sidebar Navigation Configuration
 * Centralized data for all sidebar menu items
 */

export const sidebarElements = [
  {
    id: "home",
    path: "/",
    label: "Dashboard Home",
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
    icon: Users,
  },
  {
    id : 'createOrder',
    path : '/createOrder',
    label : 'Create Order',
    icon : Users
  },
  {
    id: "users",
    path: "/users",
    label: "Users",
    icon: Users,
  }
];
