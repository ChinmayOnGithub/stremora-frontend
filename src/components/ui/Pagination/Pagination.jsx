import PropTypes from 'prop-types';
import './pagination.css';

const Pagination = ({ currentPage, totalPages, setPage, className = "" }) => {
  if (totalPages <= 1) return null;

  // Calculate which page numbers to show
  const getPageNumbers = () => {
    let pageNumbers = [];

    if (totalPages <= 5) {
      // If 5 or fewer pages, show all
      pageNumbers = Array.from({ length: totalPages }, (_, i) => i + 1);
    } else {
      // Always include first and last page
      pageNumbers.push(1);

      // Calculate middle pages
      if (currentPage <= 3) {
        // Near start: show 1, 2, 3, 4, ..., totalPages
        pageNumbers.push(2, 3, 4, 'ellipsis', totalPages);
      } else if (currentPage >= totalPages - 2) {
        // Near end: show 1, ..., totalPages-3, totalPages-2, totalPages-1, totalPages
        pageNumbers.push('ellipsis', totalPages - 3, totalPages - 2, totalPages - 1, totalPages);
      } else {
        // Middle: show 1, ..., currentPage-1, currentPage, currentPage+1, ..., totalPages
        pageNumbers.push('ellipsis', currentPage - 1, currentPage, currentPage + 1, 'ellipsis', totalPages);
      }
    }

    // Remove duplicates and sort
    return [...new Set(pageNumbers)].sort((a, b) => {
      if (a === 'ellipsis') return 1;
      if (b === 'ellipsis') return -1;
      return a - b;
    });
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className={`inline-flex items-center gap-1 rounded-lg bg-background p-1 shadow-sm dark:bg-gray-800/90 ${className}`}>
      <button
        onClick={() => setPage(1)}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-primary/10 disabled:opacity-40 dark:hover:bg-amber-500/10"
        aria-label="First page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M15.79 14.77a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L11.832 10l3.938 3.71a.75.75 0 01.02 1.06zm-6 0a.75.75 0 01-1.06.02l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 111.04 1.08L5.832 10l3.938 3.71a.75.75 0 01.02 1.06z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        onClick={() => setPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-primary/10 disabled:opacity-40 dark:hover:bg-amber-500/10"
        aria-label="Previous page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M12.79 5.23a.75.75 0 01-.02 1.06L8.832 10l3.938 3.71a.75.75 0 11-1.04 1.08l-4.5-4.25a.75.75 0 010-1.08l4.5-4.25a.75.75 0 011.06.02z" clipRule="evenodd" />
        </svg>
      </button>

      {pageNumbers.map((pageNum, index) =>
        pageNum === 'ellipsis' ? (
          <span key={`ellipsis-${index}`} className="flex h-8 w-8 items-center justify-center text-sm text-muted-foreground">
            …
          </span>
        ) : (
          <button
            key={pageNum}
            onClick={() => setPage(pageNum)}
            className={`flex h-8 min-w-[2rem] items-center justify-center rounded-md px-1 text-sm font-medium transition-colors ${pageNum === currentPage
              ? 'bg-primary text-white dark:bg-amber-500'
              : 'text-foreground hover:bg-primary/10 dark:text-gray-300 dark:hover:bg-amber-500/10'
              }`}
            aria-current={pageNum === currentPage ? 'page' : undefined}
          >
            {pageNum}
          </button>
        )
      )}

      <button
        onClick={() => setPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-primary/10 disabled:opacity-40 dark:hover:bg-amber-500/10"
        aria-label="Next page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M7.21 14.77a.75.75 0 01.02-1.06L11.168 10 7.23 6.29a.75.75 0 111.04-1.08l4.5 4.25a.75.75 0 010 1.08l-4.5 4.25a.75.75 0 01-1.06-.02z" clipRule="evenodd" />
        </svg>
      </button>

      <button
        onClick={() => setPage(totalPages)}
        disabled={currentPage === totalPages}
        className="flex h-8 w-8 items-center justify-center rounded-md text-sm text-muted-foreground transition-colors hover:bg-primary/10 disabled:opacity-40 dark:hover:bg-amber-500/10"
        aria-label="Last page"
      >
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="h-4 w-4">
          <path fillRule="evenodd" d="M4.21 14.77a.75.75 0 001.06.02l4.5-4.25a.75.75 0 000-1.08l-4.5-4.25a.75.75 0 10-1.04 1.08L8.168 10l-3.938 3.71a.75.75 0 00-.02 1.06zm6 0a.75.75 0 001.06.02l4.5-4.25a.75.75 0 000-1.08l-4.5-4.25a.75.75 0 00-1.04 1.08L14.168 10l-3.938 3.71a.75.75 0 00-.02 1.06z" clipRule="evenodd" />
        </svg>
      </button>
    </div>
  );
};

Pagination.propTypes = {
  currentPage: PropTypes.number.isRequired,
  totalPages: PropTypes.number.isRequired,
  setPage: PropTypes.func.isRequired,
  className: PropTypes.string
};

export default Pagination;
