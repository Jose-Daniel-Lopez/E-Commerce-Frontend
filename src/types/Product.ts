export interface Product {
  id: number
  name: string
  description: string
  brand: string
  isFeatured: boolean
  imageUrl: string | null
  basePrice: number
  totalStock: number
  cpu: string
  memory: string
  camera: string
  createdAt: string
}
