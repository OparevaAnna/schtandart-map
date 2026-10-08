export type SystemType =
  | 'SCHTANDART 70'
  | 'SCHTANDART 82'
  | 'SCHTANDART Slide'
  | 'SCHTANDART Thermo 75'
  | 'ALUMIL Smartia M11000'
  | 'ALUMIL Supreme S77';

export type CoatingType =
  | 'Классический белый'
  | 'Ламинация (Дуб Шеффилд)'
  | 'Антрацит ультраматовый'
  | 'Порошковая окраска RAL'
  | 'Анодирование (Серебро/Бронза)';

export type BuildingType =
  | 'Частный дом / Коттедж'
  | 'Жилой комплекс (ЖК)'
  | 'Коммерческое здание / Офис'
  | 'Таунхаус'
  | 'Гостиница / Отель';

export interface ObjectItem {
  id: string;
  coordinates: [number, number]; // [longitude, latitude]
  name: string;
  city: string;
  address: string;
  description: string;
  system: SystemType;
  coating: CoatingType;
  buildingType: BuildingType;
  photo: string;
  phone: string;
}

export interface FilterState {
  searchQuery: string;
  systems: SystemType[];
  coatings: CoatingType[];
  buildingTypes: BuildingType[];
  selectedCity: string;
}
