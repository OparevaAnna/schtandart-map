import { useMemo } from 'react';
import { ObjectItem, FilterState } from '../types/object';

export function useFilteredObjects(
  objects: ObjectItem[] | undefined,
  filters: FilterState
): ObjectItem[] {
  return useMemo(() => {
    if (!objects) return [];

    return objects.filter((item) => {
      // 1. Filter by System
      if (filters.systems.length > 0 && !filters.systems.includes(item.system)) {
        return false;
      }

      // 2. Filter by Coating
      if (filters.coatings.length > 0 && !filters.coatings.includes(item.coating)) {
        return false;
      }

      // 3. Filter by Building Type
      if (filters.buildingTypes.length > 0 && !filters.buildingTypes.includes(item.buildingType)) {
        return false;
      }

      // 4. Optional City Filter
      if (filters.selectedCity && filters.selectedCity !== 'all' && item.city !== filters.selectedCity) {
        return false;
      }

      // 5. Search query (name, address, city, description)
      if (filters.searchQuery.trim()) {
        const query = filters.searchQuery.toLowerCase().trim();
        const inName = item.name.toLowerCase().includes(query);
        const inAddress = item.address.toLowerCase().includes(query);
        const inCity = item.city.toLowerCase().includes(query);
        const inDesc = item.description.toLowerCase().includes(query);
        const inSystem = item.system.toLowerCase().includes(query);
        if (!inName && !inAddress && !inCity && !inDesc && !inSystem) {
          return false;
        }
      }

      return true;
    });
  }, [objects, filters]);
}
