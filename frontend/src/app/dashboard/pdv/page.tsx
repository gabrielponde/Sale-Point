'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaTrash, FaSearch, FaShoppingCart } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { endpoints } from '@/config/api'
import { Product, Client } from '@/types'
import styles from '@/styles/pdv.module.css'

export default function PDVPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClient, setSelectedClient] = useState<number | null>(null)
  const [cartItems, setCartItems] = useState<{
    product_id: number
    quantity_product: number
    product_value: number
    description: string
  }[]>([])

  const fetchProducts = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.products.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar produtos')
      }

      const data = await response.json()
      setProducts(data)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao carregar produtos')
    }
  }

  const fetchClients = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.customers.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar clientes')
      }

      const data = await response.json()
      setClients(data)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao carregar clientes')
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchClients()
  }, [])

  const filteredProducts = products.filter(product =>
    product.description.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const handleAddToCart = (product: Product) => {
    const existingItem = cartItems.find(item => item.product_id === product.id)
    
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.product_id === product.id
          ? { ...item, quantity_product: item.quantity_product + 1 }
          : item
      ))
    } else {
      setCartItems([...cartItems, {
        product_id: product.id,
        quantity_product: 1,
        product_value: parseFloat(product.value),
        description: product.description
      }])
    }
  }

  const handleRemoveFromCart = (productId: number) => {
    setCartItems(cartItems.filter(item => item.product_id !== productId))
  }

  const handleUpdateQuantity = (productId: number, quantity: number) => {
    if (quantity < 1) return
    setCartItems(cartItems.map(item =>
      item.product_id === productId
        ? { ...item, quantity_product: quantity }
        : item
    ))
  }

  const calculateTotal = () => {
    return cartItems.reduce((total, item) => {
      return total + (item.product_value * item.quantity_product)
    }, 0)
  }

  const handleFinishSale = async () => {
    if (!selectedClient) {
      toast.error('Selecione um cliente')
      return
    }

    if (cartItems.length === 0) {
      toast.error('Adicione produtos ao carrinho')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const orderData = {
        client_id: selectedClient,
        observation: 'Venda realizada no PDV',
        product: cartItems.map(item => ({
          product_id: item.product_id,
          quantity_product: item.quantity_product
        }))
      }

      const response = await fetch(endpoints.orders.create, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        throw new Error('Erro ao finalizar venda')
      }

      toast.success('Venda finalizada com sucesso!')
      setCartItems([])
      setSelectedClient(null)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao finalizar venda')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>PDV - Ponto de Venda</h1>
      </div>

      <div className={styles.mainContent}>
        {/* Lista de Produtos */}
        <div className={styles.productsSection}>
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="mb-4">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Buscar produto..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className={styles.searchInput}
                />
                <FaSearch className="absolute right-3 top-3 text-gray-400" />
              </div>
            </div>

            <div className={styles.productsGrid}>
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className={styles.productCard}
                >
                  <h3 className={styles.productName}>{product.description}</h3>
                  <p className="text-sm text-gray-500">Estoque: {product.quantity_stock}</p>
                  <p className={styles.productPrice}>
                    {new Intl.NumberFormat('pt-BR', {
                      style: 'currency',
                      currency: 'BRL',
                    }).format(parseFloat(product.value) / 100)}
                  </p>
                  <button
                    onClick={() => handleAddToCart(product)}
                    className={styles.buttonPrimary}
                  >
                    <FaPlus className="inline mr-2" />
                    Adicionar
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Carrinho e Finalização */}
        <div className={styles.cartSection}>
          <div className={styles.cartCard}>
            <div className="flex items-center gap-2 mb-4">
              <FaShoppingCart className="text-primary" />
              <h2 className={styles.cartTitle}>Carrinho</h2>
            </div>

            <div className="mb-4">
              <label className={styles.formLabel}>
                Cliente
              </label>
              <select
                value={selectedClient || ''}
                onChange={(e) => setSelectedClient(Number(e.target.value))}
                className={styles.formInput}
              >
                <option value="">Selecione um cliente</option>
                {clients.map((client) => (
                  <option key={client.id} value={client.id}>
                    {client.name}
                  </option>
                ))}
              </select>
            </div>

            <div className={styles.cartItems}>
              {cartItems.map((item) => (
                <div key={item.product_id} className={styles.cartItem}>
                  <div className={styles.itemInfo}>
                    <h4 className={styles.itemName}>{item.description}</h4>
                    <p className={styles.itemPrice}>
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(item.product_value / 100)}
                    </p>
                  </div>
                  <div className={styles.itemQuantity}>
                    <input
                      type="number"
                      value={item.quantity_product}
                      onChange={(e) => handleUpdateQuantity(item.product_id, Number(e.target.value))}
                      min="1"
                      className={styles.quantityInput}
                    />
                    <button
                      onClick={() => handleRemoveFromCart(item.product_id)}
                      className={styles.removeButton}
                    >
                      <FaTrash />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.cartSummary}>
              <div className={styles.summaryRow}>
                <span className={styles.summaryLabel}>Subtotal</span>
                <span className={styles.summaryValue}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(calculateTotal() / 100)}
                </span>
              </div>
              <div className={styles.totalRow}>
                <span>Total</span>
                <span>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(calculateTotal() / 100)}
                </span>
              </div>
            </div>

            <button
              onClick={handleFinishSale}
              className={styles.checkoutButton}
            >
              Finalizar Venda
            </button>
          </div>
        </div>
      </div>
    </div>
  )
} 