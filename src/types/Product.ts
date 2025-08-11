/**
 * Represents a product in the e-commerce system.
 *
 * This interface defines the complete frontend model for a product,
 * used across the application (e.g., in listings, details, cart).
 *
 * Note: Some fields (like `rating`) may be optional because they are
 *       not always returned by all backend endpoints (e.g., category-based lists).
 *       In such cases, fallback logic is handled in the store.
 */
export interface Product {
  /**
   * Unique identifier for the product.
   * Required for all operations (display, update, fetch).
   */
  id: number

  /**
   * Name of the product (e.g., "Smartphone X200").
   * Displayed prominently in UI components.
   */
  name: string

  /**
   * Detailed description of the product.
   * May include features, benefits, or technical details.
   */
  description: string

  /**
   * Manufacturer or brand name (e.g., "TechCorp", "PixelTech").
   * Used for filtering and grouping products.
   */
  brand: string

  /**
   * Indicates whether this product is featured on the homepage
   * or in promotional sections.
   */
  isFeatured: boolean

  /**
   * URL to the main product image.
   * Can be null if no image is available; fallback image is used in UI.
   */
  imageUrl: string | null

  /**
   * Base price of the product in the store's currency (e.g., EUR).
   * Used for display and calculations. Does not include taxes or discounts.
   */
  basePrice: number

  /**
   * Current stock level (number of units available).
   * Used to determine availability and display stock status.
   */
  totalStock: number

  /**
   * CPU/processor information (e.g., "Snapdragon 8 Gen 2").
   * Part of the technical specification.
   */
  cpu: string

  /**
   * Memory/RAM capacity (e.g., "8GB", "12GB").
   * Used in filtering and product comparison.
   */
  memory: string

  /**
   * Camera specifications (e.g., "48MP + 12MP Dual Camera").
   * Displayed in product details and specs table.
   */
  camera: string

  /**
   * ISO 8601 timestamp indicating when the product was created.
   * Used for sorting (e.g., "new arrivals") and display.
   */
  createdAt: string

  /**
   * Optional average customer rating (typically 0–5).
   * May be missing from some API responses (e.g., category listings),
   * so it's marked as optional to avoid runtime errors.
   * Fetched separately if needed (see `fetchProductsByCategoryName`).
   */
  rating?: number

  /**
   * Optional category name for the product (e.g., "Smartphones", "Tablets").
   * Added when fetching all products to enable category-based filtering.
   * Not always present in category-specific views where category is implicit.
   */
  categoryName?: string
}
