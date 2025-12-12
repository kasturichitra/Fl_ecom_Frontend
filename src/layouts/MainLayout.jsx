import { Link, NavLink } from "react-router-dom";
import Navbar from "../components/Navbar";
import { sidebarElements } from "../lib/sidebar_elements";

const MainLayout = ({ children }) => {
    return (
        <>
            {/* Sidebar */}
            <aside className="fixed top-0 left-0 h-screen w-72 bg-gray-900 text-white shadow-2xl z-50 overflow-y-auto">
                <div className="p-8 border-b border-gray-800">
                    <Link to={"/"}>
                        <h1 className="text-3xl font-bold tracking-wider bg-linear-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
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

            {/* Navbar */}
            <Navbar />

            {/* Main Content Area */}
            <main className="ml-72 pt-16 min-h-screen bg-linear-to-br from-gray-50 to-indigo-50">
                <div className="p-4">{children}</div>
            </main>
        </>
    );
};

export default MainLayout;
