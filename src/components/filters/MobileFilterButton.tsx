import React from 'react';
import { SlidersHorizontal } from 'lucide-react';

interface MobileFilterButtonProps {
  onOpen: () => void;
  activeFilterCount: number;
  filteredCount: number;
}

export const MobileFilterButton: React.FC<MobileFilterButtonProps> = ({
  onOpen,
  activeFilterCount,
  filteredCount,
}) => {
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 sm:hidden pointer-events-auto">
      <button
        type="button"
        onClick={onOpen}
        className="flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white px-5 py-3 rounded-full shadow-2xl border border-slate-700/80 transition-all active:scale-95 cursor-pointer"
        aria-label="Открыть фильтры категорий"
      >
        <SlidersHorizontal className="w-4 h-4 text-sky-400" />
        <span className="text-sm font-semibold tracking-wide">Фильтры</span>
        <span className="w-1.5 h-1.5 rounded-full bg-slate-600" />
        <span className="text-xs text-slate-300 font-medium">
          {filteredCount}
        </span>
        {activeFilterCount > 0 && (
          <span className="w-5 h-5 bg-sky-500 text-white text-[11px] font-bold rounded-full flex items-center justify-center ring-2 ring-slate-900">
            {activeFilterCount}
          </span>
        )}
      </button>
    </div>
  );
};
