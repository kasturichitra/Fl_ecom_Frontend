import { useState } from "react";
import InventoryTabComponent from "./Charts/Tabs/InventoryTabComponent";
import OverallTabComponent from "./Charts/Tabs/OverallTabComponent";
import PerformanceTabComponent from "./Charts/Tabs/PerformanceTabComponent";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overall");

  return (
    <div className="flex flex-col gap-6">
      {/* --- TABS HEADER --- */}
      <div className="flex gap-4 border-b pb-2">
        {["overall", "performance", "inventory"].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`px-4 py-2 text-sm font-medium rounded-t-md transition ${
              activeTab === tab ? "bg-blue-600 text-white shadow" : "text-gray-600 hover:bg-gray-100"
            }`}
          >
            {tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* --- TAB CONTENT --- */}

      {/* === OVERALL TAB === */}
      {activeTab === "overall" && <OverallTabComponent />}

      {/* === PERFORMANCE TAB === */}
      {activeTab === "performance" && <PerformanceTabComponent activeTab={activeTab} />}

      {/* === INVENTORY TAB === */}
      {activeTab === "inventory" && <InventoryTabComponent />}
    </div>
  );
};

export default Dashboard;
