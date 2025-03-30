'use client'

import { useState, useEffect } from 'react'
import { FaTimes } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { endpoints } from '@/config/api'
import { Product, Category } from '@/types'
import styles from '@/styles/productModal.module.css'

interface ProductModalProps {
  product: Product | null
  categories: Category[]
  onClose: () => void
  onSave: () => void
}

export default function ProductModal({ product, categories, onClose, onSave }: ProductModalProps) {
  const [formData, setFormData] = useState({
    description: '',
    quantity_stock: '',
    value: '',
    category_id: '',
  })
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)

  useEffect(() => {
    if (product) {
      setFormData({
        description: product.description,
        quantity_stock: product.quantity_stock,
        value: (parseFloat(product.value) / 100).toFixed(2),
        category_id: product.category_id.toString(),
      })
      setPreviewUrl(product.image_url || null)
    }
  }, [product])

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string)
      }
      reader.readAsDataURL(file)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      // Primeiro, criar o produto
      const productData = {
        description: formData.description,
        quantity_stock: Number(formData.quantity_stock),
        value: (parseFloat(formData.value) * 100).toString(),
        category_id: Number(formData.category_id)
      }

      const response = await fetch(
        product ? endpoints.products.update(product.id) : endpoints.products.create,
        {
          method: product ? 'PUT' : 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: JSON.stringify(productData),
        }
      )

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.message || 'Erro ao salvar produto')
      }

      const responseData = await response.json()
      const productId = responseData.product.id

      // Se houver uma imagem selecionada, fazer o upload
      if (selectedImage) {
        const formDataImage = new FormData()
        formDataImage.append('image', selectedImage)

        const imageResponse = await fetch(`${endpoints.products.update(productId)}/image`, {
          method: 'PATCH',
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
          body: formDataImage,
        })

        if (!imageResponse.ok) {
          console.error('Erro ao fazer upload da imagem')
        }
      }

      toast.success(product ? 'Produto atualizado com sucesso!' : 'Produto criado com sucesso!')
      onSave()
      onClose()
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao salvar produto')
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>
            {product ? 'Editar Produto' : 'Novo Produto'}
          </h2>
          <button
            type="button"
            onClick={onClose}
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
              value={formData.description}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="quantity_stock" className={styles.formLabel}>
              Quantidade em Estoque
            </label>
            <input
              type="number"
              id="quantity_stock"
              name="quantity_stock"
              value={formData.quantity_stock}
              onChange={handleChange}
              className={styles.formInput}
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="value" className={styles.formLabel}>
              Valor
            </label>
            <input
              type="number"
              id="value"
              name="value"
              value={formData.value}
              onChange={handleChange}
              className={styles.formInput}
              step="0.01"
              required
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="category_id" className={styles.formLabel}>
              Categoria
            </label>
            <select
              id="category_id"
              name="category_id"
              value={formData.category_id}
              onChange={handleChange}
              className={styles.formInput}
              required
            >
              <option value="">Selecione uma categoria</option>
              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.description}
                </option>
              ))}
            </select>
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="image" className={styles.formLabel}>
              Imagem
            </label>
            <input
              type="file"
              id="image"
              name="image"
              onChange={handleImageChange}
              className={styles.formInput}
              accept="image/*"
            />
            {previewUrl && (
              <img
                src={previewUrl}
                alt="Preview"
                className="mt-2 w-32 h-32 object-cover rounded-lg"
              />
            )}
          </div>

          <div className={styles.formActions}>
            <button
              type="button"
              onClick={onClose}
              className={styles.buttonSecondary}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className={styles.buttonPrimary}
            >
              {product ? 'Atualizar' : 'Criar'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
} 