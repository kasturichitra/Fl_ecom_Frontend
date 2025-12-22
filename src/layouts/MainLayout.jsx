import { Link, NavLink, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import Navbar from "../components/Navbar";
import { sidebarElements } from "../lib/sidebar_elements";

const MainLayout = ({ children }) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const location = useLocation();

  // Close sidebar on route change (mobile)
  useEffect(() => {
    setIsSidebarOpen(false);
  }, [location.pathname]);

  return (
    <>
      {/* Mobile Overlay */}
      {isSidebarOpen && (
        <div
          onClick={() => setIsSidebarOpen(false)}
          className="fixed inset-0 bg-black/50 z-40 md:hidden backdrop-blur-sm"
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 md:w-72 bg-gray-900 text-white shadow-2xl z-50 overflow-y-auto transform transition-transform duration-300 ease-in-out ${isSidebarOpen ? "translate-x-0" : "-translate-x-full"
          } md:translate-x-0`}
      >
        <div className="p-8 border-b border-gray-800 flex justify-between items-center">
          <Link to={"/"}>
            <h1 className="text-3xl font-bold tracking-wider bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              Admin Panel
            </h1>
            <p className="text-gray-400 text-sm mt-2">Management System</p>
          </Link>
          {/* Mobile Close Button */}
          <button
            onClick={() => setIsSidebarOpen(false)}
            className="md:hidden text-gray-400 hover:text-white"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        <nav className="mt-8 space-y-3 px-6 pb-24">
          {sidebarElements.map((item) => {
            if (item.type === "divider") {
              return <div key={item.id} className="h-px bg-gray-800 my-6" />;
            }
            const IconComponent = item.icon;
            return (
              <NavLink
                key={item.id}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `flex items-center gap-4 px-6 py-4 rounded-xl text-lg font-medium transition-all duration-300 ${isActive
                    ? "bg-linear-to-r from-indigo-600 to-purple-600 shadow-xl text-white scale-105"
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

      {/* Navbar with Toggle */}
      <Navbar onToggleSidebar={() => setIsSidebarOpen(true)} />

      {/* Main Content Area */}
      <main className="md:ml-72 ml-0 pt-20 min-h-screen bg-linear-to-br from-gray-50 to-indigo-50 transition-all duration-300">
        <div className="p-4 md:p-6">{children}</div>
      </main>
    </>
  );
};

export default MainLayout;
