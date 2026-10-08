import React from 'react';
import { Plus, Minus, Compass, Locate } from 'lucide-react';

interface MapControlsProps {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onResetView: () => void;
  onLocateUser: () => void;
  isLocating?: boolean;
}

export const MapControls: React.FC<MapControlsProps> = ({
  onZoomIn,
  onZoomOut,
  onResetView,
  onLocateUser,
  isLocating = false,
}) => {
  return (
    <div className="absolute right-3 sm:right-4 top-20 sm:top-24 z-10 flex flex-col gap-2 pointer-events-auto">
      {/* Zoom In & Out */}
      <div className="flex flex-col bg-white rounded-xl shadow-lg border border-slate-200/80 overflow-hidden">
        <button
          type="button"
          onClick={onZoomIn}
          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-slate-900 border-b border-slate-100 transition-colors cursor-pointer"
          aria-label="Приблизить карту"
          title="Приблизить"
        >
          <Plus className="w-4 h-4" />
        </button>
        <button
          type="button"
          onClick={onZoomOut}
          className="w-10 h-10 flex items-center justify-center text-slate-700 hover:bg-slate-50 hover:text-slate-900 transition-colors cursor-pointer"
          aria-label="Отдалить карту"
          title="Отдалить"
        >
          <Minus className="w-4 h-4" />
        </button>
      </div>

      {/* Reset European Russia View */}
      <button
        type="button"
        onClick={onResetView}
        className="w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer"
        aria-label="Фокус на европейской части России"
        title="Европейская часть России"
      >
        <Compass className="w-4 h-4 text-sky-600" />
      </button>

      {/* Geolocation Button */}
      <button
        type="button"
        onClick={onLocateUser}
        disabled={isLocating}
        className={`w-10 h-10 bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-900 rounded-xl shadow-lg border border-slate-200/80 flex items-center justify-center transition-colors cursor-pointer ${
          isLocating ? 'opacity-60 animate-pulse' : ''
        }`}
        aria-label="Мое местоположение"
        title="Мое местоположение"
      >
        <Locate className="w-4 h-4 text-slate-700" />
      </button>
    </div>
  );
};
