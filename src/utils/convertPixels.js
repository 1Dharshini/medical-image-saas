// utils/convertPixels.js

/**
 * Convert the pixel distance to real-world distance based on pixel spacing.
 * @param {number} pixelDistance - The distance in pixels.
 * @param {number} pixelSpacing - The distance in real-world units per pixel.
 * @param {string} unit - The unit for the real-world measurement (e.g., 'mm', 'cm', 'm').
 * @returns {number} - The real-world distance in the specified unit.
 */
export const convertPixelsToRealWorld = (pixelDistance, pixelSpacing, unit = 'mm') => {
  if (pixelDistance <= 0 || pixelSpacing <= 0) {
    return NaN; // Return NaN if input values are invalid
  }

  // Convert the pixel distance to the real-world distance
  let realWorldDistance = pixelDistance * pixelSpacing;

  // Handle unit conversions (optional)
  if (unit === 'cm') {
    realWorldDistance /= 10; // Convert from mm to cm
  } else if (unit === 'm') {
    realWorldDistance /= 1000; // Convert from mm to meters
  }

  return realWorldDistance;
};
