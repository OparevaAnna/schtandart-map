import mockData from './mockObjects.json';
import { ObjectItem, SystemType, CoatingType, BuildingType } from '../types/object';

export const mockObjects: ObjectItem[] = mockData as ObjectItem[];

export const SYSTEM_OPTIONS: SystemType[] = [
  'SCHTANDART 70',
  'SCHTANDART 82',
  'SCHTANDART Slide',
  'SCHTANDART Thermo 75',
  'ALUMIL Smartia M11000',
  'ALUMIL Supreme S77',
];

export const COATING_OPTIONS: CoatingType[] = [
  'Классический белый',
  'Ламинация (Дуб Шеффилд)',
  'Антрацит ультраматовый',
  'Порошковая окраска RAL',
  'Анодирование (Серебро/Бронза)',
];

export const BUILDING_TYPE_OPTIONS: BuildingType[] = [
  'Частный дом / Коттедж',
  'Жилой комплекс (ЖК)',
  'Коммерческое здание / Офис',
  'Таунхаус',
  'Гостиница / Отель',
];

export const CITIES_LIST: string[] = Array.from(
  new Set(mockObjects.map((item) => item.city))
).sort();
