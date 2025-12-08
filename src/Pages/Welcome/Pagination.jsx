import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function Pagination({ 
  currentPage, 
  setCurrentPage, 
  totalCount, 
  previousPage, 
  nextPage 
}) {
  return (
    <div className="flex justify-center items-center space-x-3 mt-8">
      <button
        onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
        disabled={!previousPage}
        className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors" 
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
      
      <div className="flex space-x-1">
        {[...Array(Math.ceil(totalCount / 10))].slice(0, 5).map((_, i) => (
          <button
            key={i}
            onClick={() => setCurrentPage(i + 1)}
            className={`w-8 h-8 rounded-lg transition-colors text-sm ${
              currentPage === i + 1
                ? 'bg-green-500 text-white'
                : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50'
            }`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <button
        onClick={() => setCurrentPage(prev => prev + 1)}
        disabled={!nextPage}
        className="p-2 rounded-lg bg-white border border-gray-300 text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
      >
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}