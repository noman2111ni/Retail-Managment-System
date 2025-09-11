import React, { useState } from 'react';
import { FiChevronLeft, FiChevronRight, FiMoreHorizontal } from 'react-icons/fi';

export const Pagination = ({
  currentPage: externalCurrentPage,
  totalPages,
  onPageChange,
  showPageNumbers = true,
  showNavigationLabels = false,
  compact = false
}) => {
  const [internalCurrentPage, setInternalCurrentPage] = useState(1);
  const isControlled = externalCurrentPage !== undefined;
  const currentPage = isControlled ? externalCurrentPage : internalCurrentPage;

  const handlePageChange = (page) => {
    if (page < 1 || page > totalPages) return;

    if (!isControlled) setInternalCurrentPage(page);
    if (onPageChange) onPageChange(page);
  };

  const getVisiblePages = () => {
    if (compact) {
      if (totalPages <= 3) return Array.from({ length: totalPages }, (_, i) => i + 1);
      if (currentPage === 1) return [1, 2, 'ellipsis', totalPages];
      if (currentPage === totalPages) return [1, 'ellipsis', totalPages - 1, totalPages];
      return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
    }

    const delta = 2;
    const range = [];
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    if (currentPage - delta > 2) range.unshift('ellipsis');
    if (currentPage + delta < totalPages - 1) range.push('ellipsis');
    range.unshift(1);
    if (totalPages !== 1) range.push(totalPages);
    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      {/* Mobile Navigation */}
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700 border border-gray-300 dark:border-gray-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700 border border-gray-300 dark:border-gray-600 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>

      {/* Desktop Navigation */}
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            {/* Previous Button */}
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showNavigationLabels ? <>Previous</> : <FiChevronLeft className="h-4 w-4" />}
            </button>

            {/* Page Numbers */}
            {showPageNumbers && getVisiblePages().map((page, index) => {
              if (page === 'ellipsis') {
                return (
                  <span
                    key={`ellipsis-${index}`}
                    className="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300"
                  >
                    <FiMoreHorizontal className="h-4 w-4" />
                  </span>
                );
              }
              return (
                <button
                  key={page}
                  onClick={() => handlePageChange(page)}
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${currentPage === page
                      ? 'z-10 bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700 border-yellow-500 text-gray-900 dark:text-gray-100'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-yellow-100 dark:hover:bg-yellow-900/20'
                    }`}
                >
                  {page}
                </button>
              );
            })}

            {/* Next Button */}
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-700 dark:text-gray-200 bg-gradient-to-r from-yellow-400 to-yellow-500 dark:from-yellow-600 dark:to-yellow-700 hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showNavigationLabels ? <>Next</> : <FiChevronRight className="h-4 w-4" />}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};

export default Pagination;
