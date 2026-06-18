import React, { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";

interface PaginationProps {
  page: number;
  total: number;
  limit: number;
  loading: boolean;
  onPrev: () => void;
  onNext: () => void;
  onPageSizeChange?: (newSize: number) => void; // New prop for parent to handle page size change
}

// Available page size options
const PAGE_SIZE_OPTIONS = [10, 25, 50, 100];

export default function Pagination({
  page,
  total,
  limit,
  loading,
  onPrev,
  onNext,
  onPageSizeChange,
}: PaginationProps) {
  const location = useLocation();
  
  // Get route name for localStorage key
  const getRouteKey = () => {
    const path = location.pathname;
    // Remove leading slash and replace / with _
    const routeKey = path.replace(/^\//, '').replace(/\//g, '_') || 'home';
    return `pagination_pageSize_${routeKey}`;
  };

  // Load saved page size or use default
  const [pageSize, setPageSize] = useState(() => {
    const storageKey = getRouteKey();
    const saved = localStorage.getItem(storageKey);
    if (saved) {
      const parsed = parseInt(saved, 10);
      if (PAGE_SIZE_OPTIONS.includes(parsed)) {
        return parsed;
      }
    }
    return limit || 10;
  });

  // Save page size to localStorage when it changes
  useEffect(() => {
    const storageKey = getRouteKey();
    localStorage.setItem(storageKey, String(pageSize));
    if (onPageSizeChange) {
      onPageSizeChange(pageSize);
    }
  }, [pageSize, location.pathname, onPageSizeChange]);

  // Update page size when limit prop changes from parent
  useEffect(() => {
    if (limit && limit !== pageSize) {
      // Only update if the parent forces a different size
      setPageSize(limit);
    }
  }, [limit]);

  // Handle page size change from dropdown
  const handlePageSizeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newSize = parseInt(e.target.value, 10);
    setPageSize(newSize);
  };

  const start = total === 0 ? 0 : (page - 1) * pageSize + 1;
  const end = Math.min(page * pageSize, total);
  const isFirst = page === 1;
  const isLast = end >= total;

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-6 border-t-4 border-silver-bright/10 pt-8">
      <div className="flex flex-col sm:flex-row items-center gap-4">
        <p
          aria-live="polite"
          aria-atomic="true"
          className="text-[10px] font-mono text-silver/30 uppercase tracking-widest italic"
        >
          <span className="sr-only">
            {total === 0
              ? "No records found."
              : `Showing records ${start} to ${end} of ${total} total.`}
          </span>
          <span aria-hidden="true">
            Showing_Records:{" "}
            <span className="text-silver-bright">
              {start}–{end}
            </span>{" "}
            // Total: <span className="text-rag-blue">{total}</span>
          </span>
        </p>
        
        {/* Page Size Selector */}
        <div className="flex items-center gap-2">
          <label 
            htmlFor="pageSizeSelect" 
            className="text-[9px] font-mono text-silver/30 uppercase tracking-widest italic"
          >
            Per Page:
          </label>
          <select
            id="pageSizeSelect"
            value={pageSize}
            onChange={handlePageSizeChange}
            disabled={loading}
            className="bg-charcoal-dark border-2 border-silver-bright/10 text-silver-bright text-[10px] font-mono uppercase tracking-widest px-3 py-2 rounded-md focus:outline-none focus:border-rag-blue transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            aria-label="Select number of items per page"
          >
            {PAGE_SIZE_OPTIONS.map((size) => (
              <option key={size} value={size} className="bg-charcoal-dark text-silver-bright">
                {size}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button
          onClick={onPrev}
          disabled={isFirst || loading}
          aria-disabled={isFirst || loading}
          aria-label="Go to previous page"
          className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border-2 border-silver-bright/10 text-silver/40 hover:border-rag-blue hover:text-rag-blue transition-all flex items-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed italic"
        >
          <span className="material-symbols-outlined text-sm" aria-hidden="true">arrow_back</span>
          Prev_Page
        </button>
        <div
          aria-label={`Page ${page}`}
          className="bg-charcoal-dark border-2 border-black px-4 py-3 shadow-[3px_3px_0px_0px_rgba(0,0,0,1)]"
        >
          <span className="text-[10px] font-black font-mono text-rag-blue" aria-hidden="true">
            {page}
          </span>
        </div>
        <button
          onClick={onNext}
          disabled={isLast || loading}
          aria-disabled={isLast || loading}
          aria-label="Go to next page"
          className="px-6 py-3 text-[10px] font-black uppercase tracking-widest border-2 border-silver-bright/10 text-silver/40 hover:border-rag-blue hover:text-rag-blue transition-all flex items-center gap-2 disabled:opacity-20 disabled:cursor-not-allowed italic"
        >
          Next_Page
          <span className="material-symbols-outlined text-sm" aria-hidden="true">
            arrow_forward
          </span>
        </button>
      </div>
    </div>
  );
}
