import { ObjectItem } from '../types/object';
import mockData from '../data/mockObjects.json';

/**
 * Service simulating real backend API communication.
 * In a production setting, this would execute:
 * const res = await fetch('/api/objects');
 * return await res.json();
 */
export const objectsApi = {
  async fetchObjects(): Promise<ObjectItem[]> {
    // Simulate real backend latency
    await new Promise((resolve) => setTimeout(resolve, 250));
    // Return objects cloned from JSON
    return JSON.parse(JSON.stringify(mockData)) as ObjectItem[];
  },

  async fetchObjectById(id: string): Promise<ObjectItem | null> {
    await new Promise((resolve) => setTimeout(resolve, 100));
    const item = (mockData as ObjectItem[]).find((obj) => obj.id === id);
    return item ? JSON.parse(JSON.stringify(item)) : null;
  },
};
