/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useObjectsQuery } from './hooks/useObjectsQuery';
import { useFilteredObjects } from './hooks/useFilteredObjects';
import { FilterState, ObjectItem } from './types/object';
import { Header } from './components/header/Header';
import { YandexMap } from './components/map/YandexMap';
import { FilterDrawer } from './components/filters/FilterDrawer';
import { MobileFilterButton } from './components/filters/MobileFilterButton';
import { ObjectDetailPopup } from './components/popup/ObjectDetailPopup';
import { Loader2, AlertTriangle, RotateCcw } from 'lucide-react';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 10,
      retry: 2,
    },
  },
});

function MapApplication() {
  // 1. Data Fetching via React Query
  const { data: objects, isLoading, isError, error, refetch } = useObjectsQuery();

  // 2. Filter State (defaults closed)
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [selectedObject, setSelectedObject] = useState<ObjectItem | null>(null);

  const [filters, setFilters] = useState<FilterState>({
    searchQuery: '',
    systems: [],
    coatings: [],
    buildingTypes: [],
    selectedCity: '',
  });

  // 3. Filtered Objects Hook
  const filteredObjects = useFilteredObjects(objects, filters);

  const activeFilterCount =
    filters.systems.length +
    filters.coatings.length +
    filters.buildingTypes.length +
    (filters.selectedCity ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  const handleResetFilters = () => {
    setFilters({
      searchQuery: '',
      systems: [],
      coatings: [],
      buildingTypes: [],
      selectedCity: '',
    });
  };

  if (isLoading) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-900 text-white p-6">
        <div className="w-14 h-14 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center mb-5 shadow-2xl">
          <Loader2 className="w-7 h-7 text-sky-400 animate-spin" />
        </div>
        <h2 className="text-xl font-bold tracking-wider uppercase mb-1">
          SCHTANDART
        </h2>
        <p className="text-xs text-slate-400 tracking-widest uppercase mb-4">
          гарантия качества
        </p>
        <div className="text-sm text-slate-300 font-medium animate-pulse">
          Загрузка каталога объектов...
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="w-screen h-screen flex flex-col items-center justify-center bg-slate-50 p-6 text-center">
        <div className="w-14 h-14 bg-red-100 text-red-600 rounded-full flex items-center justify-center mb-4">
          <AlertTriangle className="w-7 h-7" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">
          Не удалось загрузить данные
        </h2>
        <p className="text-sm text-slate-600 max-w-sm mb-6">
          {error?.message || 'Произошла ошибка при обращении к сервису данных.'}
        </p>
        <button
          type="button"
          onClick={() => refetch()}
          className="bg-sky-600 hover:bg-sky-700 text-white text-sm font-semibold px-5 py-2.5 rounded-xl transition-all cursor-pointer shadow-md"
        >
          Повторить попытку
        </button>
      </div>
    );
  }

  const allObjects = objects || [];

  return (
    <div className="relative w-screen h-screen overflow-hidden bg-slate-100 font-sans">
      {/* Top Header Bar */}
      <Header
        onOpenFilterDrawer={() => setIsFilterOpen(true)}
        searchQuery={filters.searchQuery}
        onSearchChange={(query) => setFilters((prev) => ({ ...prev, searchQuery: query }))}
        totalCount={allObjects.length}
        filteredCount={filteredObjects.length}
        activeFilterCount={activeFilterCount}
        onResetFilters={handleResetFilters}
      />

      {/* Main Interactive Yandex Map with Clusters */}
      <YandexMap
        objects={filteredObjects}
        selectedObject={selectedObject}
        onSelectObject={setSelectedObject}
      />

      {/* Floating Indicator when no objects match filters */}
      {filteredObjects.length === 0 && (
        <div className="absolute top-24 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md px-5 py-3 rounded-2xl shadow-xl border border-slate-200 text-center max-w-sm mx-4">
          <p className="text-sm font-bold text-slate-800 mb-1">
            Ничего не найдено
          </p>
          <p className="text-xs text-slate-500 mb-3">
            По выбранным фильтрам объекты отсутствуют
          </p>
          <button
            type="button"
            onClick={handleResetFilters}
            className="inline-flex items-center gap-1.5 bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold px-4 py-2 rounded-xl transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Сбросить фильтры</span>
          </button>
        </div>
      )}

      {/* Hamburger Drawer with category filters (by default closed) */}
      <FilterDrawer
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        filters={filters}
        onFiltersChange={setFilters}
        allObjects={allObjects}
        filteredCount={filteredObjects.length}
      />

      {/* Mobile Floating Filter Launch Button (bottom center on mobile) */}
      <MobileFilterButton
        onOpen={() => setIsFilterOpen(true)}
        activeFilterCount={activeFilterCount}
        filteredCount={filteredObjects.length}
      />

      {/* Popup with Object Details on Marker Click (smooth bottom slide-up) */}
      <ObjectDetailPopup
        object={selectedObject}
        onClose={() => setSelectedObject(null)}
      />
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <MapApplication />
    </QueryClientProvider>
  );
}
