/**
 * Placeholder image utilities for offline/local development
 * Generates SVG-based placeholder images that don't require external network access
 */

// Generate a simple SVG placeholder image as data URL
export const generatePlaceholderImage = (width = 400, height = 300, text = 'Land Property', bgColor = '#f0f0f0', textColor = '#666') => {
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${bgColor}" stroke="#ddd" stroke-width="2"/>
      <text x="50%" y="45%" font-family="Arial, sans-serif" font-size="16" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${text}
      </text>
      <text x="50%" y="60%" font-family="Arial, sans-serif" font-size="12" fill="${textColor}" text-anchor="middle" dominant-baseline="middle">
        ${width} × ${height}
      </text>
    </svg>
  `;
  
  return `data:image/svg+xml;base64,${btoa(svg)}`;
};

// Predefined placeholder images for different land types
export const placeholderImages = {
  default: generatePlaceholderImage(400, 300, 'Land Property'),
  residential: generatePlaceholderImage(400, 300, 'Residential Land', '#e8f5e8', '#2d5a2d'),
  commercial: generatePlaceholderImage(400, 300, 'Commercial Land', '#e8f0ff', '#1a365d'),
  industrial: generatePlaceholderImage(400, 300, 'Industrial Land', '#fff5e8', '#744210'),
  agricultural: generatePlaceholderImage(400, 300, 'Agricultural Land', '#f0fff0', '#0f4f0f')
};

// Get appropriate placeholder based on land type
export const getPlaceholderForLandType = (landType = 'residential') => {
  return placeholderImages[landType] || placeholderImages.default;
};

// Create multiple placeholder images for a property (simulating multiple angles)
export const generateMultiplePlaceholders = (landType = 'residential', count = 3) => {
  const base = placeholderImages[landType] || placeholderImages.default;
  const placeholders = [];
  
  for (let i = 0; i < count; i++) {
    const texts = [
      `${landType.charAt(0).toUpperCase() + landType.slice(1)} Land`,
      `Property View ${i + 1}`,
      `Land Plot ${i + 1}`
    ];
    placeholders.push(generatePlaceholderImage(400, 300, texts[i] || `View ${i + 1}`));
  }
  
  return placeholders;
};
