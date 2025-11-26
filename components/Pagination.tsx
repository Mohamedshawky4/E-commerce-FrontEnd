import React from "react";

type PaginationProps = {
  pagination: {
    page: number;
    pages: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
  };
  onPageChange: (page: number) => void;
};

export function PaginationButton({ pagination, onPageChange }: PaginationProps) {
  const { page, pages, hasNextPage, hasPrevPage } = pagination;

  // Only show nearby pages for cleaner UI
  const getPageNumbers = () => {
    const delta = 2; // show 2 pages before and after
    const range = [];
    for (let i = 1; i <= pages; i++) {
      if (i === 1 || i === pages || (i >= page - delta && i <= page + delta)) {
        range.push(i);
      }
    }
    return range;
  };

  const pageNumbers = getPageNumbers();

  return (
    <div className="flex justify-center mt-6">
      <div className="flex items-center space-x-1">
        {/* Prev Button */}
        <button
          disabled={!hasPrevPage}
          onClick={() => hasPrevPage && onPageChange(page - 1)}
          className={`px-3 py-1 rounded-lg gradient-primary text-white disabled:opacity-40 transition cursor-pointer ${!hasPrevPage && "opacity-40 cursor-not-allowed"}`}
        >
          Prev
        </button>

        {/* Page Numbers */}
        {pageNumbers.map((p, idx) => {
          if (idx > 0 && p - pageNumbers[idx - 1] > 1) {
            return (
              <span key={`ellipsis-${p}`} className="px-2 text-gray-400 cursor-pointer">
                …
              </span>
            );
          }
          return (
            <button
              key={p}
              onClick={() => onPageChange(p)}
              className={`px-3 py-1 rounded-lg transition cursor-pointer ${
                p === page
                  ? "gradient-primary text-white shadow-md"
                  : "bg-surface dark:bg-surface-dark text-foreground dark:text-foreground-dark hover:bg-primary/10 dark:hover:bg-primary-dark/20"
              }`}
            >
              {p}
            </button>
          );
        })}

        {/* Next Button */}
        <button
          disabled={!hasNextPage}
          onClick={() => hasNextPage && onPageChange(page + 1)}
          className="px-3 py-1 rounded-lg gradient-primary text-white  disabled:opacity-40 transition cursor-pointer"
        >
          Next
        </button>
      </div>
    </div>
  );
}
