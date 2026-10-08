import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  X,
  Phone,
  MapPin,
  Layers,
  Palette,
  Building2,
  Navigation,
  Copy,
  Check,
  Maximize2,
} from 'lucide-react';
import { ObjectItem } from '../../types/object';
import { formatTelLink } from '../../utils/formatters';

interface ObjectDetailPopupProps {
  object: ObjectItem | null;
  onClose: () => void;
}

export const ObjectDetailPopup: React.FC<ObjectDetailPopupProps> = ({
  object,
  onClose,
}) => {
  const [copied, setCopied] = useState(false);
  const [imageError, setImageError] = useState(false);

  if (!object) return null;

  const handleCopyAddress = () => {
    navigator.clipboard.writeText(`${object.city}, ${object.address}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Yandex Maps directions link
  const yandexDirectLink = `https://yandex.ru/maps/?rtext=~${object.coordinates[1]},${object.coordinates[0]}&rtt=auto`;

  return (
    <AnimatePresence>
      <div className="fixed inset-x-0 bottom-0 z-30 pointer-events-none p-3 sm:p-6 flex justify-center">
        {/* Animated Slide-Up Card */}
        <motion.div
          key={object.id}
          initial={{ y: '100%', opacity: 0, scale: 0.96 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: '100%', opacity: 0, scale: 0.96 }}
          transition={{ type: 'spring', damping: 26, stiffness: 280 }}
          className="pointer-events-auto w-full max-w-xl bg-white rounded-2xl shadow-2xl border border-slate-200/90 overflow-hidden flex flex-col max-h-[85vh] sm:max-h-[80vh]"
          role="dialog"
          aria-label={`Информация об объекте ${object.name}`}
        >
          {/* Top image banner with controls */}
          <div className="relative h-44 sm:h-52 bg-slate-900 shrink-0 overflow-hidden">
            {!imageError ? (
              <img
                src={object.photo}
                alt={object.name}
                onError={() => setImageError(true)}
                className="w-full h-full object-cover transition-transform duration-700 hover:scale-105"
                loading="eager"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-400 bg-slate-800">
                <Building2 className="w-10 h-10 mb-2 opacity-50" />
                <span className="text-xs">Фотография объекта</span>
              </div>
            )}

            {/* Gradient overlay for readability */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />

            {/* Close button */}
            <button
              type="button"
              onClick={onClose}
              className="absolute top-3 right-3 w-9 h-9 rounded-full bg-slate-950/60 hover:bg-slate-950/80 text-white backdrop-blur-md flex items-center justify-center transition-all hover:scale-105 cursor-pointer shadow-md"
              aria-label="Закрыть карточку"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Building type badge in top-left */}
            <div className="absolute top-3 left-3 bg-slate-950/60 backdrop-blur-md text-white text-[11px] font-medium px-2.5 py-1 rounded-lg border border-white/10 flex items-center gap-1.5">
              <Building2 className="w-3.5 h-3.5 text-sky-400" />
              <span>{object.buildingType}</span>
            </div>

            {/* Bottom title inside banner */}
            <div className="absolute bottom-3 left-4 right-4">
              <h3 className="text-lg sm:text-xl font-bold text-white leading-tight drop-shadow-sm">
                {object.name}
              </h3>
              <div className="flex items-center gap-1.5 text-slate-200 text-xs mt-1">
                <MapPin className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                <span className="truncate">
                  {object.city}, {object.address}
                </span>
              </div>
            </div>
          </div>

          {/* Body content */}
          <div className="p-4 sm:p-5 overflow-y-auto space-y-4 text-slate-800 overscroll-contain">
            {/* Architectural Specs Grid */}
            <div className="grid grid-cols-2 gap-2.5">
              {/* System */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <Layers className="w-3.5 h-3.5 text-sky-600" />
                  <span>Система</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug">
                  {object.system}
                </span>
              </div>

              {/* Coating */}
              <div className="bg-slate-50 border border-slate-200/80 rounded-xl p-2.5 flex flex-col">
                <div className="flex items-center gap-1.5 text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-1">
                  <Palette className="w-3.5 h-3.5 text-sky-600" />
                  <span>Покрытие</span>
                </div>
                <span className="text-xs sm:text-sm font-bold text-slate-900 leading-snug truncate">
                  {object.coating}
                </span>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-1">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Описание объекта
              </span>
              <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/50 p-3 rounded-xl border border-slate-100">
                {object.description}
              </p>
            </div>

            {/* Contact Box with Phone Call Button */}
            <div className="bg-slate-900 text-white rounded-xl p-3.5 sm:p-4 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 shadow-lg">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold tracking-wider text-slate-400">
                  Контакты объекта
                </span>
                <div className="text-sm sm:text-base font-bold font-mono text-white tracking-wide">
                  {object.phone}
                </div>
              </div>

              <div className="flex items-center gap-2">
                {/* Prominent Call Button */}
                <a
                  href={formatTelLink(object.phone)}
                  className="flex-1 sm:flex-initial inline-flex items-center justify-center gap-2 bg-sky-500 hover:bg-sky-400 text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg transition-all active:scale-95 shadow-md shadow-sky-500/30 cursor-pointer"
                >
                  <Phone className="w-4 h-4 fill-white" />
                  <span>Позвонить</span>
                </a>

                {/* Copy address or direct route */}
                <button
                  type="button"
                  onClick={handleCopyAddress}
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Скопировать адрес"
                  aria-label="Скопировать адрес"
                >
                  {copied ? (
                    <Check className="w-4 h-4 text-emerald-400" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>

                <a
                  href={yandexDirectLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="p-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Маршрут в Яндекс Картах"
                  aria-label="Маршрут в Яндекс Картах"
                >
                  <Navigation className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
