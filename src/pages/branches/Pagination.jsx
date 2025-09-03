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
    
    if (!isControlled) {
      setInternalCurrentPage(page);
    }
    
    if (onPageChange) {
      onPageChange(page);
    }
  };

  const getVisiblePages = () => {
    if (compact) {
      // For compact mode, only show current page and ellipsis
      if (totalPages <= 3) {
        return Array.from({ length: totalPages }, (_, i) => i + 1);
      }
      
      if (currentPage === 1) {
        return [1, 2, 'ellipsis', totalPages];
      } else if (currentPage === totalPages) {
        return [1, 'ellipsis', totalPages - 1, totalPages];
      } else {
        return [1, 'ellipsis', currentPage, 'ellipsis', totalPages];
      }
    }
    
    // For normal mode, show more pages
    const delta = 2;
    const range = [];
    // const rangeWithDots = [];
    
    for (let i = Math.max(2, currentPage - delta); i <= Math.min(totalPages - 1, currentPage + delta); i++) {
      range.push(i);
    }
    
    if (currentPage - delta > 2) {
      range.unshift('ellipsis');
    }
    if (currentPage + delta < totalPages - 1) {
      range.push('ellipsis');
    }
    
    range.unshift(1);
    if (totalPages !== 1) range.push(totalPages);
    
    return range;
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between px-4 py-3 bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm">
      <div className="flex-1 flex justify-between sm:hidden">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="relative inline-flex items-center px-4 py-2 ml-3 text-sm font-medium rounded-md text-gray-700 dark:text-gray-200 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
            <button
              onClick={() => handlePageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-3 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showNavigationLabels ? (
                <>Previous</>
              ) : (
                <>
                  <span className="sr-only">Previous</span>
                  <FiChevronLeft className="h-4 w-4" />
                </>
              )}
            </button>
            
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
                  className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                    currentPage === page
                      ? 'z-10 bg-blue-50 dark:bg-blue-900/30 border-blue-500 text-blue-600 dark:text-blue-300'
                      : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'
                  }`}
                >
                  {page}
                </button>
              );
            })}
            
            <button
              onClick={() => handlePageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-3 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 bg-white dark:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {showNavigationLabels ? (
                <>Next</>
              ) : (
                <>
                  <span className="sr-only">Next</span>
                  <FiChevronRight className="h-4 w-4" />
                </>
              )}
            </button>
          </nav>
        </div>
      </div>
    </div>
  );
};
export default Pagination;