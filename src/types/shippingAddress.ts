// TypeScript interfaces for ShippingAddress
export interface ShippingAddress {
  id?: number
  title: string
  addressType: 'HOME' | 'OFFICE' | 'PICKUP'
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  userId: number
}

export interface CreateShippingAddressRequest {
  title: string
  addressType: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  userId: number
}

export interface UpdateShippingAddressRequest extends CreateShippingAddressRequest {
  id: number
}

export interface AssignAddressToOrderRequest {
  orderId: number
  addressId: number
}

export interface ShippingAddressApiResponse {
  id: number
  title: string
  addressType: string
  street: string
  city: string
  state: string
  zipCode: string
  country: string
  userId: number
}
