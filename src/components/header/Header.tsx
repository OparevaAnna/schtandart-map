import React from 'react';
import { Menu, Search, X, SlidersHorizontal, RotateCcw } from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';

interface HeaderProps {
  onOpenFilterDrawer: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
  totalCount: number;
  filteredCount: number;
  activeFilterCount: number;
  onResetFilters: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  onOpenFilterDrawer,
  searchQuery,
  onSearchChange,
  totalCount,
  filteredCount,
  activeFilterCount,
  onResetFilters,
}) => {
  return (
    <header className="absolute top-0 left-0 right-0 z-20 pointer-events-none p-3 md:p-4">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-3">
        {/* Left Section: Hamburger + Brand Logo with dark podlozhka */}
        <div className="flex items-center gap-2.5 pointer-events-auto">
          {/* Hamburger Menu Toggle Button */}
          <button
            type="button"
            onClick={onOpenFilterDrawer}
            className="flex items-center justify-center w-11 h-11 bg-white hover:bg-slate-100 text-slate-800 rounded-xl shadow-md border border-slate-200/80 transition-all hover:scale-105 active:scale-95 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-500 relative cursor-pointer"
            aria-label="Открыть меню фильтров"
            title="Открыть фильтры по категориям"
          >
            <Menu className="w-5 h-5 text-slate-800" />
            {activeFilterCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-sky-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-sm ring-2 ring-white">
                {activeFilterCount}
              </span>
            )}
          </button>

          {/* Company Logo on dark podlozhka */}
          <BrandLogo size="md" />
        </div>

        {/* Center / Search bar & live count indicator */}
        <div className="hidden sm:flex items-center gap-2 pointer-events-auto flex-1 max-w-md mx-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              placeholder="Поиск по названию, городу или адресу..."
              className="w-full bg-white/95 backdrop-blur-md pl-10 pr-9 py-2.5 text-sm rounded-xl border border-slate-200/90 shadow-md text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition-all"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => onSearchChange('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5 rounded-full"
                aria-label="Очистить поиск"
              >
                <X className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Stats badge & quick filter buttons */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Active stats counter badge */}
          <div className="hidden md:flex items-center gap-2 bg-white/95 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-md text-xs">
            <span className="font-semibold text-slate-900">{filteredCount}</span>
            <span className="text-slate-500">из {totalCount} объектов</span>
            {filteredCount < totalCount && (
              <button
                type="button"
                onClick={onResetFilters}
                className="ml-1 text-sky-600 hover:text-sky-700 font-medium flex items-center gap-1 hover:underline cursor-pointer"
                title="Сбросить все фильтры"
              >
                <RotateCcw className="w-3 h-3" />
                Сброс
              </button>
            )}
          </div>

          {/* Quick Filter toggle button for tablets & desktops */}
          <button
            type="button"
            onClick={onOpenFilterDrawer}
            className="hidden sm:inline-flex items-center gap-2 bg-white/95 hover:bg-slate-50 backdrop-blur-md px-3.5 py-2.5 rounded-xl border border-slate-200/90 shadow-md text-xs font-semibold text-slate-800 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <SlidersHorizontal className="w-4 h-4 text-sky-600" />
            <span>Категории</span>
            {activeFilterCount > 0 && (
              <span className="bg-sky-100 text-sky-800 px-1.5 py-0.2 text-[11px] font-bold rounded">
                {activeFilterCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
};
