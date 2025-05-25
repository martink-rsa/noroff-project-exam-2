import { ChevronLeft, ChevronRight } from 'lucide-react';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  className?: string;
}

export default function Pagination({ 
  currentPage, 
  totalPages, 
  onPageChange, 
  className = "" 
}: PaginationProps) {
  if (totalPages <= 1) return null;

  const getPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;
    
    let startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1);
    
    if (endPage - startPage + 1 < maxVisiblePages) {
      startPage = Math.max(1, endPage - maxVisiblePages + 1);
    }
    
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }
    
    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <nav className={`flex items-center justify-center space-x-2 ${className}`} aria-label="Pagination">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-600 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        <ChevronLeft size={16} />
        Previous
      </button>
      
      {pageNumbers[0] > 1 && (
        <>
          <button
            onClick={() => onPageChange(1)}
            className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:shadow-soft transition-all duration-200"
          >
            1
          </button>
          {pageNumbers[0] > 2 && (
            <span className="px-3 py-2 text-sm font-medium text-neutral-500">...</span>
          )}
        </>
      )}
      
      {pageNumbers.map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`px-3 py-2 text-sm font-medium rounded-xl transition-all duration-200 ${
            page === currentPage
              ? 'bg-gradient-to-r from-primary-500 to-secondary-500 text-white shadow-soft'
              : 'text-neutral-700 bg-white/80 backdrop-blur-sm border border-neutral-200 hover:bg-neutral-50 hover:shadow-soft'
          }`}
        >
          {page}
        </button>
      ))}
      
      {pageNumbers[pageNumbers.length - 1] < totalPages && (
        <>
          {pageNumbers[pageNumbers.length - 1] < totalPages - 1 && (
            <span className="px-3 py-2 text-sm font-medium text-neutral-500">...</span>
          )}
          <button
            onClick={() => onPageChange(totalPages)}
            className="px-3 py-2 text-sm font-medium text-neutral-700 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:shadow-soft transition-all duration-200"
          >
            {totalPages}
          </button>
        </>
      )}
      
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-neutral-600 bg-white/80 backdrop-blur-sm border border-neutral-200 rounded-xl hover:bg-neutral-50 hover:shadow-soft disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
      >
        Next
        <ChevronRight size={16} />
      </button>
    </nav>
  );
}