import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  RotateCcw,
  Layers,
  Palette,
  Building2,
  MapPin,
  Check,
  Search,
  Sparkles,
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import {
  FilterState,
  SystemType,
  CoatingType,
  BuildingType,
  ObjectItem,
} from '../../types/object';
import {
  SYSTEM_OPTIONS,
  COATING_OPTIONS,
  BUILDING_TYPE_OPTIONS,
  CITIES_LIST,
} from '../../data/mockObjects';

interface FilterDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  filters: FilterState;
  onFiltersChange: (newFilters: FilterState) => void;
  allObjects: ObjectItem[];
  filteredCount: number;
}

export const FilterDrawer: React.FC<FilterDrawerProps> = ({
  isOpen,
  onClose,
  filters,
  onFiltersChange,
  allObjects,
  filteredCount,
}) => {
  // Toggle individual filter value in an array
  const toggleArrayFilter = <T extends string>(
    key: 'systems' | 'coatings' | 'buildingTypes',
    value: T
  ) => {
    const current = filters[key] as unknown as T[];
    const exists = current.includes(value);
    const updated = exists ? current.filter((v) => v !== value) : [...current, value];
    onFiltersChange({
      ...filters,
      [key]: updated,
    });
  };

  // Reset all filters to default empty state
  const handleResetAll = () => {
    onFiltersChange({
      searchQuery: '',
      systems: [],
      coatings: [],
      buildingTypes: [],
      selectedCity: '',
    });
  };

  // Count items matching specific criterion in all objects
  const getSystemCount = (system: SystemType) =>
    allObjects.filter((o) => o.system === system).length;

  const getCoatingCount = (coating: CoatingType) =>
    allObjects.filter((o) => o.coating === coating).length;

  const getBuildingTypeCount = (bType: BuildingType) =>
    allObjects.filter((o) => o.buildingType === bType).length;

  const getCityCount = (city: string) =>
    allObjects.filter((o) => o.city === city).length;

  const activeFiltersCount =
    filters.systems.length +
    filters.coatings.length +
    filters.buildingTypes.length +
    (filters.selectedCity ? 1 : 0) +
    (filters.searchQuery ? 1 : 0);

  // Coating swatch colors for visual identification
  const getCoatingSwatch = (coating: CoatingType) => {
    switch (coating) {
      case 'Классический белый':
        return 'bg-white border-2 border-slate-300';
      case 'Ламинация (Дуб Шеффилд)':
        return 'bg-amber-700 border-2 border-amber-900';
      case 'Антрацит ультраматовый':
        return 'bg-slate-800 border-2 border-slate-950';
      case 'Порошковая окраска RAL':
        return 'bg-gradient-to-tr from-sky-500 via-rose-500 to-amber-500 border-2 border-white';
      case 'Анодирование (Серебро/Бронза)':
        return 'bg-gradient-to-r from-slate-300 via-amber-200 to-slate-400 border-2 border-slate-400';
      default:
        return 'bg-slate-400';
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            key="drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            onClick={onClose}
            className="fixed inset-0 bg-slate-950/40 backdrop-blur-xs z-40 cursor-pointer"
            aria-hidden="true"
          />

          {/* Drawer Panel */}
          <motion.aside
            key="drawer-panel"
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ type: 'spring', damping: 28, stiffness: 260 }}
            className="fixed top-0 left-0 bottom-0 w-full max-w-md bg-white z-50 shadow-2xl flex flex-col overflow-hidden"
            role="dialog"
            aria-modal="true"
            aria-label="Фильтры объектов SCHTANDART"
          >
            {/* Drawer Header with Company Logo on Dark Card */}
            <div className="p-4 border-b border-slate-100 flex items-center justify-between gap-3 bg-white">
              {/* Logo with dark podlozhka per specification */}
              <BrandLogo size="md" />

              <div className="flex items-center gap-1.5">
                {activeFiltersCount > 0 && (
                  <button
                    type="button"
                    onClick={handleResetAll}
                    className="flex items-center gap-1 text-xs font-semibold text-sky-700 hover:text-sky-800 hover:bg-sky-50 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer"
                    title="Сбросить все выбранные фильтры"
                  >
                    <RotateCcw className="w-3.5 h-3.5" />
                    <span>Сбросить</span>
                  </button>
                )}

                <button
                  type="button"
                  onClick={onClose}
                  className="w-9 h-9 rounded-lg hover:bg-slate-100 text-slate-500 hover:text-slate-800 flex items-center justify-center transition-colors cursor-pointer"
                  aria-label="Закрыть меню фильтрации"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Scrollable Filter Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-6 overscroll-contain">
              {/* Quick Search */}
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wider block">
                  Быстрый поиск
                </label>
                <div className="relative">
                  <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                  <input
                    type="text"
                    value={filters.searchQuery}
                    onChange={(e) =>
                      onFiltersChange({ ...filters, searchQuery: e.target.value })
                    }
                    placeholder="Поиск по адресу или названию..."
                    className="w-full bg-slate-50 pl-9 pr-8 py-2 text-sm rounded-lg border border-slate-200 text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white transition-all"
                  />
                  {filters.searchQuery && (
                    <button
                      type="button"
                      onClick={() =>
                        onFiltersChange({ ...filters, searchQuery: '' })
                      }
                      className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* 1. System Filter (Профильная система) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Layers className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Профильная система
                    </span>
                  </div>
                  {filters.systems.length > 0 && (
                    <span className="text-[11px] font-semibold text-sky-600">
                      выбрано {filters.systems.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {SYSTEM_OPTIONS.map((system) => {
                    const isSelected = filters.systems.includes(system);
                    const count = getSystemCount(system);
                    return (
                      <button
                        key={system}
                        type="button"
                        onClick={() => toggleArrayFilter('systems', system)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 text-sky-950 border border-sky-300'
                            : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-sky-600 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold">{system}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-mono">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 2. Coating Filter (Покрытие и цвет) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Palette className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Покрытие и цвет
                    </span>
                  </div>
                  {filters.coatings.length > 0 && (
                    <span className="text-[11px] font-semibold text-sky-600">
                      выбрано {filters.coatings.length}
                    </span>
                  )}
                </div>

                <div className="space-y-1.5">
                  {COATING_OPTIONS.map((coating) => {
                    const isSelected = filters.coatings.includes(coating);
                    const count = getCoatingCount(coating);
                    return (
                      <button
                        key={coating}
                        type="button"
                        onClick={() => toggleArrayFilter('coatings', coating)}
                        className={`w-full flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 text-sky-950 border border-sky-300'
                            : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`w-4 h-4 rounded-full shadow-xs shrink-0 ${getCoatingSwatch(
                              coating
                            )}`}
                          />
                          <span className="font-semibold">{coating}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-[11px] text-slate-600 font-mono">
                            {count}
                          </span>
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-sky-600 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 3. Building Type Filter (Тип здания) */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Тип объекта
                    </span>
                  </div>
                  {filters.buildingTypes.length > 0 && (
                    <span className="text-[11px] font-semibold text-sky-600">
                      выбрано {filters.buildingTypes.length}
                    </span>
                  )}
                </div>

                <div className="grid grid-cols-1 gap-1.5">
                  {BUILDING_TYPE_OPTIONS.map((bType) => {
                    const isSelected = filters.buildingTypes.includes(bType);
                    const count = getBuildingTypeCount(bType);
                    return (
                      <button
                        key={bType}
                        type="button"
                        onClick={() => toggleArrayFilter('buildingTypes', bType)}
                        className={`flex items-center justify-between px-3 py-2 rounded-lg text-xs font-medium transition-all text-left cursor-pointer ${
                          isSelected
                            ? 'bg-sky-50 text-sky-950 border border-sky-300'
                            : 'bg-slate-50/80 hover:bg-slate-100/90 text-slate-700 border border-transparent'
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-4 h-4 rounded flex items-center justify-center transition-colors ${
                              isSelected
                                ? 'bg-sky-600 text-white'
                                : 'border border-slate-300 bg-white'
                            }`}
                          >
                            {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                          </div>
                          <span className="font-semibold">{bType}</span>
                        </div>
                        <span className="text-[11px] text-slate-600 font-mono">
                          {count}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* 4. Optional City selector */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-sky-600" />
                    <span className="text-xs font-bold text-slate-900 uppercase tracking-wider">
                      Город / Регион
                    </span>
                  </div>
                  {filters.selectedCity && (
                    <button
                      type="button"
                      onClick={() =>
                        onFiltersChange({ ...filters, selectedCity: '' })
                      }
                      className="text-[11px] text-slate-500 hover:text-slate-800 underline cursor-pointer"
                    >
                      Любой город
                    </button>
                  )}
                </div>

                <select
                  value={filters.selectedCity}
                  onChange={(e) =>
                    onFiltersChange({ ...filters, selectedCity: e.target.value })
                  }
                  className="w-full bg-slate-50 px-3 py-2 text-xs rounded-lg border border-slate-200 text-slate-800 focus:outline-none focus:ring-2 focus:ring-sky-500 font-medium"
                >
                  <option value="">Все регионы России ({allObjects.length})</option>
                  {CITIES_LIST.map((city) => (
                    <option key={city} value={city}>
                      {city} ({getCityCount(city)})
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Bottom Actions Drawer Footer */}
            <div className="p-4 border-t border-slate-100 bg-slate-50/70 flex items-center gap-3">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 bg-sky-600 hover:bg-sky-700 text-white font-semibold text-sm py-2.5 px-4 rounded-xl shadow-md shadow-sky-600/20 transition-all flex items-center justify-center gap-2 active:scale-[0.98] cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                <span>Показать объекты ({filteredCount})</span>
              </button>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={handleResetAll}
                  className="px-3.5 py-2.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 text-xs font-semibold transition-colors cursor-pointer"
                  title="Очистить фильтры"
                >
                  Сброс
                </button>
              )}
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
};
