// Utility for handling image URLs with Cloudinary integration

/**
 * Get optimized image URL from Cloudinary
 * @param {string} imageId - The public ID of the image in Cloudinary
 * @param {Object} options - Transformation options
 * @returns {string} - Cloudinary URL with transformations
 */
export function getCloudinaryUrl(imageId: string, options: {
  width?: number;
  height?: number;
  quality?: string | number;
  format?: string;
  crop?: string;
} = {}): string {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || 'tejon-tech';
  const baseUrl = `https://res.cloudinary.com/${cloudName}/image/upload`;

  // Build transformation string
  const transformations = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.format) transformations.push(`f_${options.format}`);
  if (options.crop) transformations.push(`c_${options.crop}`);

  // Auto optimization
  transformations.push('f_auto', 'q_auto');

  const transformationString = transformations.join(',');
  return `${baseUrl}/${transformationString}/e-commerce/${imageId}`;
}

/**
 * Get product image with fallback
 * @param {string} productName - Name of the product
 * @param {Object} options - Image options
 * @returns {string} - Image URL
 */
export function getProductImage(productName: string | undefined, options = {}): string {
  if (!productName) return getCloudinaryUrl('logo', options);

  const productLower = productName.toLowerCase();

  // Map product names to Cloudinary image IDs
  const productImageMap: Record<string, string> = {
    'iphone 14': 'Iphone-14-pro-purple',
    'iphone': 'Iphone-14-pro-purple',
    'airpods': 'Apple-airPods',
    'apple watch': 'Apple-Watch',
    'macbook': 'Macbook',
    'ipad': 'Apple-iPad',
    'samsung': 'Galaxy-Z-Mobile',
    'galaxy': 'Galaxy-Z-Mobile'
  };

  // Find matching product
  for (const [key, imageId] of Object.entries(productImageMap)) {
    if (productLower.includes(key)) {
      return getCloudinaryUrl(imageId, options);
    }
  }

  return getCloudinaryUrl('logo', options);
}

/**
 * Get category image
 * @param {string} category - Category name
 * @param {Object} options - Image options
 * @returns {string} - Image URL
 */
export function getCategoryImage(category: string, options = {}): string {
  const categoryMap: Record<string, string> = {
    smartphones: 'categories-smartphones',
    phones: 'categories-smartphones',
    tablets: 'categories-tablets',
    computers: 'categories-computers',
    laptops: 'categories-computers',
    audio: 'categories-audio',
    headphones: 'categories-headphones',
    cameras: 'categories-cameras',
    gaming: 'categories-gaming',
    accessories: 'categories-accessories',
    smartwatches: 'categories-smartwatches',
    mice: 'categories-mice',
    keyboards: 'categories-keyboards',
    controllers: 'categories-controllers',
    handhelds: 'categories-handhelds',
    'handheld consoles': 'categories-handhelds',
    'gaming controllers': 'categories-controllers',
    smarthome: 'categories-smarthome'
  };

  const imageId = categoryMap[category.toLowerCase()] || 'logo';
  return getCloudinaryUrl(imageId, options);
}

/**
 * Get avatar image with fallback
 * @param {string} avatarUrl - Original avatar URL
 * @param {Object} options - Image options
 * @returns {string} - Image URL
 */
export function getAvatarImage(avatarUrl: string | undefined, options = {}): string {
  if (avatarUrl && !avatarUrl.includes('alicia.png')) {
    return avatarUrl;
  }
  return getCloudinaryUrl('User', options);
}

/**
 * Get logo image based on theme
 * @param {boolean} isDark - Whether dark theme is active
 * @param {Object} options - Image options
 * @returns {string} - Image URL
 */
export function getLogoImage(isDark: boolean = false, options = {}): string {
  const imageId = isDark ? 'logo-full-white' : 'logo-full';
  return getCloudinaryUrl(imageId, options);
}
