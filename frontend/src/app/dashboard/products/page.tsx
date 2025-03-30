'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaBox } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { endpoints } from '@/config/api'
import { Product, Category } from '@/types'
import ProductModal from '@/components/products/ProductModal'
import styles from '@/styles/products.module.css'

export default function ProductsPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null)

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

  const fetchCategories = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.categories.list, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar categorias')
      }

      const data = await response.json()
      setCategories(data)
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao carregar categorias')
    }
  }

  useEffect(() => {
    fetchProducts()
    fetchCategories()
  }, [])

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir este produto?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.products.delete(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao excluir produto')
      }

      toast.success('Produto excluído com sucesso!')
      fetchProducts()
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao excluir produto')
    }
  }

  const handleEdit = (product: Product) => {
    setSelectedProduct(product)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedProduct(null)
    setIsModalOpen(true)
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Produtos</h1>
        <button onClick={handleCreate} className={styles.buttonPrimary}>
          <FaPlus size={16} />
          Novo Produto
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Imagem</th>
              <th className={styles.tableHeaderCell}>Descrição</th>
              <th className={styles.tableHeaderCell}>Categoria</th>
              <th className={styles.tableHeaderCell}>Estoque</th>
              <th className={styles.tableHeaderCell}>Valor</th>
              <th className={styles.tableHeaderCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {products.map((product) => (
              <tr key={product.id} className={styles.tableRow}>
                <td className={styles.tableCell}>
                  {product.image_url ? (
                    <img
                      src={product.image_url}
                      alt={product.description}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      <FaBox className="text-gray-400" size={20} />
                    </div>
                  )}
                </td>
                <td className={styles.tableCell}>
                  <div className="text-sm font-medium text-gray-900">{product.description}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className="text-sm text-gray-900">
                    {categories.find(cat => cat.id === product.category_id)?.description}
                  </div>
                </td>
                <td className={styles.tableCell}>
                  <div className="text-sm text-gray-900">{product.quantity_stock}</div>
                </td>
                <td className={styles.tableCell}>
                  <div className="text-sm text-gray-900">
                    R$ {(parseFloat(product.value) / 100).toFixed(2)}
                  </div>
                </td>
                <td className={styles.tableCellActions}>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleEdit(product)}
                      className={`${styles.editButton} h-6 w-6 flex items-center justify-center`}
                    >
                      <FaEdit size={16} />
                    </button>
                    <button
                      onClick={() => handleDelete(product.id)}
                      className={`${styles.deleteButton} h-6 w-6 flex items-center justify-center`}
                    >
                      <FaTrash size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <ProductModal
          product={selectedProduct}
          categories={categories}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedProduct(null)
          }}
          onSave={fetchProducts}
        />
      )}
    </div>
  )
} 