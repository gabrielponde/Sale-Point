'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { endpoints } from '@/config/api'
import { Order, Client, Product } from '@/types'
import styles from '@/styles/orders.module.css'

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([])
  const [clients, setClients] = useState<Client[]>([])
  const [products, setProducts] = useState<Product[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null)
  const [orderProducts, setOrderProducts] = useState<{ product_id: number; quantity_product: number; product_value: number }[]>([])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.orders.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar pedidos')
      }

      const data = await response.json()
      setOrders(data)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao carregar pedidos')
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

  useEffect(() => {
    const loadData = async () => {
      await fetchClients()
      await fetchOrders()
      await fetchProducts()
    }
    loadData()
  }, [])

  useEffect(() => {
    if (clients.length > 0 && orders.length > 0) {
      const updatedOrders = orders.map(order => {
        const client = clients.find(c => c.id === order.client_id)
        return {
          ...order,
          client: client || { id: order.client_id, name: 'Cliente não encontrado' }
        }
      })
      setOrders(updatedOrders)
    }
  }, [clients])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este pedido?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.orders.delete(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao excluir pedido')
      }

      toast.success('Pedido excluído com sucesso!')
      fetchOrders()
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir pedido')
    }
  }

  const handleEdit = (order: Order) => {
    setSelectedOrder(order)
    setOrderProducts(order.product?.map(item => ({
      product_id: item.product_id,
      quantity_product: item.quantity_product,
      product_value: item.product_value
    })) || [])
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedOrder(null)
    setOrderProducts([])
    setIsModalOpen(true)
  }

  const handleAddProduct = () => {
    setOrderProducts([...orderProducts, { product_id: 0, quantity_product: 1, product_value: 0 }])
  }

  const handleRemoveProduct = (index: number) => {
    setOrderProducts(orderProducts.filter((_, i) => i !== index))
  }

  const handleProductChange = (index: number, field: 'product_id' | 'quantity_product' | 'product_value', value: number) => {
    const newOrderProducts = [...orderProducts]
    
    if (field === 'product_id') {
      // Quando um produto é selecionado, busca seu valor unitário
      const selectedProduct = products.find(p => p.id === value)
      if (selectedProduct) {
        newOrderProducts[index] = {
          ...newOrderProducts[index],
          product_id: value,
          product_value: Number(selectedProduct.value)
        }
      }
    } else {
      newOrderProducts[index] = {
        ...newOrderProducts[index],
        [field]: value
      }
    }
    
    setOrderProducts(newOrderProducts)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)

    // Valida se há produtos no pedido
    if (orderProducts.length === 0) {
      toast.error('Adicione pelo menos um produto ao pedido')
      return
    }

    // Valida se todos os produtos foram selecionados
    const hasInvalidProducts = orderProducts.some(item => !item.product_id || item.quantity_product <= 0)
    if (hasInvalidProducts) {
      toast.error('Preencha todos os produtos corretamente')
      return
    }

    const orderData = {
      client_id: Number(formData.get('client_id')),
      observation: formData.get('observation') as string,
      order_products: orderProducts.map(item => ({
        product_id: item.product_id,
        quantity_product: item.quantity_product,
        product_value: item.product_value
      }))
    }

    try {
      const token = localStorage.getItem('token')
      const url = selectedOrder ? endpoints.orders.update(selectedOrder.id) : endpoints.orders.create

      const response = await fetch(url, {
        method: selectedOrder ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(orderData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao salvar pedido')
      }

      toast.success(`Pedido ${selectedOrder ? 'atualizado' : 'criado'} com sucesso!`)
      setIsModalOpen(false)
      fetchOrders()
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar pedido')
    }
  }

  const handleShowDetails = (order: Order) => {
    setSelectedOrder(order)
    setIsDetailsModalOpen(true)
  }

  const getStatusBadgeClass = (status: string) => {
    switch (status.toLowerCase()) {
      case 'pending':
        return `${styles.statusBadge} ${styles.statusPending}`
      case 'completed':
        return `${styles.statusBadge} ${styles.statusCompleted}`
      case 'cancelled':
        return `${styles.statusBadge} ${styles.statusCancelled}`
      default:
        return styles.statusBadge
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Pedidos</h1>
        <button onClick={handleCreate} className={styles.buttonPrimary}>
          <FaPlus />
          Novo Pedido
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>ID</th>
              <th className={styles.tableHeaderCell}>Cliente</th>
              <th className={styles.tableHeaderCell}>Data</th>
              <th className={styles.tableHeaderCell}>Total</th>
              <th className={styles.tableHeaderCellActions}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {orders.map((order) => (
              <tr key={order.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{order.id}</td>
                <td className={styles.tableCell}>
                  <button 
                    onClick={() => handleShowDetails(order)}
                    className={styles.clientNameButton}
                  >
                    {clients.find(c => c.id === order.client_id)?.name || 'Cliente não encontrado'}
                  </button>
                </td>
                <td className={styles.tableCell}>
                  {new Date(order.created_at).toLocaleString('pt-BR', {
                    day: '2-digit',
                    month: '2-digit',
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit',
                    timeZone: 'America/Sao_Paulo',
                    hour12: false
                  })}
                </td>
                <td className={styles.tableCell}>
                  {new Intl.NumberFormat('pt-BR', {
                    style: 'currency',
                    currency: 'BRL',
                  }).format(order.total / 100)}
                </td>
                <td className={styles.tableCellActions}>
                  <button
                    onClick={() => handleEdit(order)}
                    className={styles.actionButton}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(order.id)}
                    className={styles.deleteButton}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de Detalhes do Pedido */}
      {isDetailsModalOpen && selectedOrder && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                Detalhes do Pedido #{selectedOrder.id}
              </h2>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className={styles.modalCloseButton}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <div className="p-6">
              <div className="mb-6">
                <h3 className="text-lg font-medium text-gray-900 mb-2">Informações do Pedido</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Cliente</p>
                    <p className="font-medium">{clients.find(c => c.id === selectedOrder.client_id)?.name}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Data</p>
                    <p className="font-medium">
                      {new Date(selectedOrder.created_at).toLocaleString('pt-BR', {
                        day: '2-digit',
                        month: '2-digit',
                        year: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                        timeZone: 'America/Sao_Paulo',
                        hour12: false
                      })}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Observação</p>
                    <p className="font-medium">{selectedOrder.observation || '-'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Valor Total</p>
                    <p className="font-medium text-primary">
                      {new Intl.NumberFormat('pt-BR', {
                        style: 'currency',
                        currency: 'BRL',
                      }).format(selectedOrder.total_value / 100)}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Produtos do Pedido</h3>
                <div className="overflow-x-auto">
                  <table className={styles.table}>
                    <thead className={styles.tableHeader}>
                      <tr>
                        <th className={styles.tableHeaderCell}>Produto</th>
                        <th className={styles.tableHeaderCell}>Quantidade</th>
                        <th className={styles.tableHeaderCell}>Valor Unitário</th>
                        <th className={styles.tableHeaderCell}>Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedOrder.product.map((item) => {
                        const product = products.find(p => p.id === item.product_id)
                        return (
                          <tr key={item.id} className={styles.tableRow}>
                            <td className={styles.tableCell}>
                              {product?.description || 'Produto não encontrado'}
                            </td>
                            <td className={styles.tableCell}>
                              {item.quantity_product}
                            </td>
                            <td className={styles.tableCell}>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format(item.product_value / 100)}
                            </td>
                            <td className={styles.tableCell}>
                              {new Intl.NumberFormat('pt-BR', {
                                style: 'currency',
                                currency: 'BRL',
                              }).format((item.product_value * item.quantity_product) / 100)}
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className={styles.formActions}>
              <button
                onClick={() => setIsDetailsModalOpen(false)}
                className={styles.buttonSecondary}
              >
                Fechar
              </button>
            </div>
          </div>
        </div>
      )}

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedOrder ? 'Editar Pedido' : 'Novo Pedido'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCloseButton}
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className="grid grid-cols-2 gap-4">
                <div className={styles.formGroup}>
                  <label htmlFor="client_id" className={styles.formLabel}>
                    Cliente
                  </label>
                  <select
                    id="client_id"
                    name="client_id"
                    defaultValue={selectedOrder?.client_id}
                    required
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

                <div className={styles.formGroup}>
                  <label htmlFor="observation" className={styles.formLabel}>
                    Observação
                  </label>
                  <textarea
                    id="observation"
                    name="observation"
                    defaultValue={selectedOrder?.observation}
                    rows={3}
                    className={styles.formInput}
                  />
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-medium text-gray-900">Produtos do Pedido</h3>
                  <button
                    type="button"
                    onClick={handleAddProduct}
                    className={styles.buttonPrimary}
                  >
                    Adicionar Produto
                  </button>
                </div>

                <div className="space-y-4">
                  {orderProducts.map((item, index) => (
                    <div key={index} className="grid grid-cols-4 gap-4">
                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Produto</label>
                        <select
                          value={item.product_id}
                          onChange={(e) => handleProductChange(index, 'product_id', Number(e.target.value))}
                          required
                          className={styles.formInput}
                        >
                          <option value="">Selecione um produto</option>
                          {products.map((product) => (
                            <option key={product.id} value={product.id}>
                              {product.description}
                            </option>
                          ))}
                        </select>
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Quantidade</label>
                        <input
                          type="number"
                          value={item.quantity_product}
                          onChange={(e) => handleProductChange(index, 'quantity_product', Number(e.target.value))}
                          required
                          min="1"
                          className={styles.formInput}
                        />
                      </div>

                      <div className={styles.formGroup}>
                        <label className={styles.formLabel}>Valor Unitário</label>
                        <input
                          type="number"
                          value={item.product_value / 100}
                          onChange={(e) => handleProductChange(index, 'product_value', Number(e.target.value))}
                          required
                          min="0"
                          step="0.01"
                          className={styles.formInput}
                        />
                      </div>

                      <div className="flex items-end">
                        <button
                          type="button"
                          onClick={() => handleRemoveProduct(index)}
                          className={styles.deleteButton}
                        >
                          Remover
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className={styles.formActions}>
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className={styles.buttonSecondary}
                >
                  Cancelar
                </button>
                <button
                  type="submit"
                  className={styles.buttonPrimary}
                >
                  {selectedOrder ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}