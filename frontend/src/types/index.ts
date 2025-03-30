export interface User {
  id: number
  name: string
  email: string
}

export interface Category {
  id: number
  name: string
  description: string
  products?: Product[]
}

export interface Product {
  id: number
  name: string
  description: string
  value: string
  quantity_stock: string
  category_id: number
  category?: Category
  created_at: string
  updated_at: string
  image_url?: string
}

export interface Client {
  id: number
  name: string
  email: string
  phone: string
  cpf: string
  cep: string
  street: string
  number: string
  city: string
  state: string
  district: string
  zipCode: string
  created_at: string
  updated_at: string
}

export interface OrderProduct {
  id: number
  order_id: number
  product_id: number
  quantity_product: number
  product_value: number
  product?: Product
}

export interface Order {
  id: number
  client_id: number
  observation?: string
  total_value: number
  created_at: string
  updated_at: string
  client?: {
    id: number
    name: string | undefined
  }
  product: {
    id: number
    product_id: number
    quantity_product: number
    product_value: number
    order_id: number
  }[]
  total: number
}

export interface OrderItem {
  id: number
  order_id: number
  product_id: number
  quantity: number
  price: number
  created_at: string
  updated_at: string
  product: Product
} 