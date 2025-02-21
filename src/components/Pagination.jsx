// import React from 'react'

function Pagination({ currentPage, totalPages, setPage }) {
  return (
    <div className="w-full flex items-center justify-between p-3 bg-gray-800 text-white border-t border-gray-700 my-2  mx-0 rounded-lg">
      <button
        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        onClick={() => setPage((prev) => Math.max(prev - 1, 1))}
        disabled={currentPage === 1}
      >
        Prev
      </button>

      <span>
        Page {currentPage} of {totalPages}
      </span>

      <button
        className="px-3 py-1 bg-gray-700 rounded disabled:opacity-50"
        onClick={() => setPage((prev) => Math.min(prev + 1, totalPages))}
        disabled={currentPage === totalPages}
      >
        Next
      </button>
    </div>
  );
}

export default Pagination