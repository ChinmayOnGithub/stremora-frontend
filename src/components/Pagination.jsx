// import React from 'react'

function Pagination({ currentPage, totalPages, setPage }) {
  return (
    <div className="w-full flex items-center justify-between p-3 bg-white dark:bg-gray-800 text-gray-900 dark:text-white border-t border-gray-300 dark:border-gray-700 my-2 mx-0 rounded-lg">

      {/* Previous Button */}
      <button
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      {/* Page Indicator */}
      <span className="font-medium">
        Page {currentPage} of {totalPages}
      </span>

      {/* Next Button */}
      <button
        className="px-3 py-1 bg-gray-200 dark:bg-gray-700 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition"
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>

    </div>
  );
}

export default Pagination;
