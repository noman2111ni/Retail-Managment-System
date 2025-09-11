import React from "react";

const PageSkeleton = ({ title, totalLabel, totalValue, children }) => {
  return (
    <div className="p-6 min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">
          {title}
        </h2>
        {totalValue !== undefined && (
          <div className="bg-yellow-500 text-white px-4 py-2 rounded-lg shadow">
            {totalLabel}: Rs {Number(totalValue).toFixed(2)}
          </div>
        )}
      </div>

      {/* Main Content */}
      <div className="space-y-6">{children}</div>
    </div>
  );
};

export default PageSkeleton;
