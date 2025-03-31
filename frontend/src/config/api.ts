const API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://sale-point-system.vercel.app'

export const endpoints = {
  auth: {
    login: `${API_URL}/user/login`,
    register: `${API_URL}/user/register`,
    resetPassword: `${API_URL}/user/reset`,
    getUserDetails: `${API_URL}/user`,
    updateUser: `${API_URL}/user`,
  },
  products: {
    list: `${API_URL}/product`,
    create: `${API_URL}/product`,
    update: (id: number) => `${API_URL}/product/${id}`,
    delete: (id: number) => `${API_URL}/product/${id}`,
    getById: (id: number) => `${API_URL}/product/${id}`,
  },
  categories: {
    list: `${API_URL}/categories`,
    create: `${API_URL}/categories`,
    update: (id: number) => `${API_URL}/categories/${id}`,
    getById: (id: number) => `${API_URL}/categories/${id}`,
    delete: (id: number) => `${API_URL}/categories/${id}`,
  },
  customers: {
    list: `${API_URL}/client`,
    create: `${API_URL}/client`,
    update: (id: number) => `${API_URL}/client/${id}`,
    getById: (id: number) => `${API_URL}/client/${id}`,
    delete: (id: number) => `${API_URL}/client/${id}`,
  },
  orders: {
    list: `${API_URL}/order`,
    create: `${API_URL}/order`,
    update: (id: number) => `${API_URL}/order/${id}`,
    delete: (id: number) => `${API_URL}/order/${id}`,
    getById: (id: number) => `${API_URL}/order/${id}`,
  },
  dashboard: {
    stats: `${API_URL}/dashboard/stats`,
  },
}

export const apiConfig = {
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
  credentials: 'include',
}

export default endpoints 