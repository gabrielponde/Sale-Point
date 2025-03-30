'use client'

import { useState, useEffect } from 'react'
import { FaPlus, FaEdit, FaTrash, FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { endpoints } from '@/config/api'
import { Category } from '@/types'
import styles from '../../../styles/categories.module.css'

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

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
    fetchCategories()
  }, [])

  const handleCreate = () => {
    setSelectedCategory(null)
    setIsModalOpen(true)
  }

  const handleEdit = (category: Category) => {
    setSelectedCategory(category)
    setIsModalOpen(true)
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Tem certeza que deseja excluir esta categoria?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.categories.delete(id), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir categoria')
      }

      toast.success('Categoria excluída com sucesso!')
      fetchCategories()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao excluir categoria')
    }
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const formData = new FormData(e.currentTarget)
    const description = formData.get('description') as string

    try {
      const token = localStorage.getItem('token')
      const url = selectedCategory ? endpoints.categories.update(selectedCategory.id) : endpoints.categories.create

      const response = await fetch(url, {
        method: selectedCategory ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ description }),
      })

      if (!response.ok) {
        throw new Error('Erro ao salvar categoria')
      }

      toast.success(`Categoria ${selectedCategory ? 'atualizada' : 'criada'} com sucesso!`)
      setIsModalOpen(false)
      fetchCategories()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao salvar categoria')
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Categorias</h1>
        <button
          onClick={handleCreate}
          className={styles.buttonPrimary}
        >
          <FaPlus />
          Nova Categoria
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Descrição</th>
              <th className={styles.tableHeaderCell} style={{ textAlign: 'right' }}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((category) => (
              <tr key={category.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{category.description}</td>
                <td className={styles.tableCell} style={{ textAlign: 'right' }}>
                  <button
                    onClick={() => handleEdit(category)}
                    className="text-blue-600 hover:text-blue-900 mr-4"
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(category.id)}
                    className="text-red-600 hover:text-red-900"
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <div className={styles.modalHeader}>
              <h2 className={styles.modalTitle}>
                {selectedCategory ? 'Editar Categoria' : 'Nova Categoria'}
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className={styles.modalCloseButton}
              >
                <FaTimes />
              </button>
            </div>

            <form onSubmit={handleSubmit} className={styles.form}>
              <div className={styles.formGroup}>
                <label htmlFor="description" className={styles.formLabel}>
                  Descrição
                </label>
                <input
                  type="text"
                  id="description"
                  name="description"
                  defaultValue={selectedCategory?.description || ''}
                  required
                  className={styles.formInput}
                />
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
                  {selectedCategory ? 'Atualizar' : 'Criar'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}