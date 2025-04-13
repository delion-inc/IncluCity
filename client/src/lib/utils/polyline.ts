/**
 * Polyline encoding/decoding utility functions
 * Adapted from https://github.com/mapbox/polyline
 */

export const polyline = {
  decode(str: string, precision = 5): number[][] {
    let index = 0;
    let lat = 0;
    let lng = 0;
    const coordinates: number[][] = [];
    let shift = 0;
    let result = 0;
    let byte = null;
    let latitude_change: number;
    let longitude_change: number;
    const factor = Math.pow(10, precision);

    // Coordinates have variable length when encoded, so just keep
    // track of whether we've hit the end of the string. In each
    // loop iteration, a single coordinate is decoded.
    while (index < str.length) {
      // Reset shift, result, and byte
      byte = null;
      shift = 0;
      result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      latitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      shift = result = 0;

      do {
        byte = str.charCodeAt(index++) - 63;
        result |= (byte & 0x1f) << shift;
        shift += 5;
      } while (byte >= 0x20);

      longitude_change = result & 1 ? ~(result >> 1) : result >> 1;

      lat += latitude_change;
      lng += longitude_change;

      // Перевіряємо, чи координати є валідними
      if (this.isValidCoordinate(lat / factor, lng / factor)) {
        coordinates.push([lat / factor, lng / factor]);
      }
    }

    return coordinates;
  },

  // Функція для перевірки валідності координат
  isValidCoordinate(lat: number, lng: number): boolean {
    // Перевіряємо, чи координати в межах допустимого діапазону
    return !isNaN(lat) && !isNaN(lng) && lat >= -90 && lat <= 90 && lng >= -180 && lng <= 180;
  },
};
