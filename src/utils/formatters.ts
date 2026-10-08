/**
 * The user object model defines:
 * coordinates: [number, number]; // [longitude, latitude]
 *
 * Yandex Maps JS API 2.1 expects coordinates in [latitude, longitude] order.
 * This helper guarantees clean conversion.
 */
export function toYandexCoords(coordinates: [number, number]): [number, number] {
  const [longitude, latitude] = coordinates;
  return [latitude, longitude];
}

/**
 * Format raw phone number string to a tel: link
 */
export function formatTelLink(phone: string): string {
  const digits = phone.replace(/[^\d+]/g, '');
  return `tel:${digits}`;
}
