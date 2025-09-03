import InventoryDashboard from "@/components/layout/Inventoy/InventoryDashboard";
import { Outlet, useLocation } from "react-router-dom";

export default function Inventory() {
  const location = useLocation();
  const isAddProductPage = location.pathname.endsWith("add-product");

  return (
    <div className="relative flex flex-col gap-6 bg-gray-50 dark:bg-gray-800 min-h-screen">
      {/* Top Section */}
      <InventoryDashboard />

      {/* Blur overlay when Add Product is open */}
      {isAddProductPage && (
        <div className="fixed inset-0 z-40 bg-black/10 backdrop-blur-sm transition-all"></div>
      )}

      {/* Slide-in Add Product Panel */}
      <div
        className={`fixed top-0 right-0 h-full w-full md:w-[600px] z-50 transition-transform duration-500 overflow-y-auto
          ${isAddProductPage ? "translate-x-0" : "translate-x-full"}
        `}
        style={{ pointerEvents: isAddProductPage ? "auto" : "none" }}
      >
        <Outlet />
      </div>

      {/* Main Content / Footer */}
      <div className="fixed bottom-0 left-0 w-full bg-gray-50 dark:bg-gray-800">
        {/* 👇 یہ Outlet وہ routes render کرے گا جو Add Product نہیں ہیں */}
        {!isAddProductPage && <Outlet />}
      </div>
    </div>
  );
}
