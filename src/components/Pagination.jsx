import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

function Pagination({ currentPage, totalPages, setPage }) {
  totalPages = Math.max(1, Math.ceil(totalPages)); // ✅ Fix: Ensure at least 1 page

  const getPages = () => {
    let pages = [];
    let start = Math.max(1, currentPage - 2);
    let end = Math.min(totalPages, currentPage + 2);

    if (end - start < 4) {
      if (start === 1) end = Math.min(totalPages, start + 4);
      else if (end === totalPages) start = Math.max(1, end - 4);
    }

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  };

  return (
    <div className="w-full sm:w-[92%] lg:w-[98%] max-w-[96%] mx-auto flex items-center justify-center gap-2 p-3 bg-white dark:bg-gray-800/40 text-gray-900 dark:text-white border-b-1 border-r-1 border-gray-300 dark:border-gray-700 my-4 rounded-lg shadow-md">

      {/* Prev Button */}
      <button
        className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        onClick={() => setPage(currentPage - 1)}
        disabled={currentPage <= 1} // ✅ Fix: Prevent going below 1
      >
        <FaChevronLeft size={16} /> Prev
      </button>

      {/* Page Numbers */}
      <div className="flex items-center gap-1">
        {getPages().map((page) => (
          <button
            key={page}
            onClick={() => setPage(page)}
            className={`px-3 py-1 rounded-md text-sm font-medium transition-all ${page === currentPage
              ? "bg-amber-600 text-white shadow-md"
              : "bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600"
              }`}
          >
            {page}
          </button>
        ))}
      </div>

      {/* Next Button */}
      <button
        className="px-3 py-1 flex items-center gap-1 bg-gray-200 dark:bg-gray-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 dark:hover:bg-gray-600 transition-all"
        onClick={() => setPage(currentPage + 1)}
        disabled={currentPage >= totalPages} // ✅ Fix: Prevent going beyond max pages
      >
        Next <FaChevronRight size={16} />
      </button>
    </div>
  );
}

export default Pagination;
