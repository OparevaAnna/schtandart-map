import { useQuery } from '@tanstack/react-query';
import { objectsApi } from '../services/objectsApi';
import { ObjectItem } from '../types/object';

export const OBJECTS_QUERY_KEY = ['objects'] as const;

export function useObjectsQuery() {
  return useQuery<ObjectItem[], Error>({
    queryKey: OBJECTS_QUERY_KEY,
    queryFn: () => objectsApi.fetchObjects(),
    staleTime: 1000 * 60 * 10, // 10 minutes cache
    gcTime: 1000 * 60 * 30, // 30 minutes garbage collection
    refetchOnWindowFocus: false,
  });
}
