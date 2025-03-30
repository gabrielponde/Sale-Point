'use client'

import { useState, useEffect } from 'react'
import { toast } from 'react-toastify'
import { endpoints } from '@/config/api'
import { User } from '@/types'
import styles from '@/styles/profile.module.css'

export default function ProfilePage() {
  const [user, setUser] = useState<User | null>(null)
  const [isEditing, setIsEditing] = useState(false)
  const [isResettingPassword, setIsResettingPassword] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  })
  const [error, setError] = useState('')

  const fetchUserDetails = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.auth.getUserDetails, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar dados do usuário')
      }

      const data = await response.json()
      setUser(data)
      setFormData(prev => ({
        ...prev,
        name: data.name,
        email: data.email,
      }))
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao carregar dados do perfil')
    }
  }

  useEffect(() => {
    fetchUserDetails()
  }, [])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.auth.updateUser, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
        }),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Erro ao atualizar perfil')
      }

      toast.success('Perfil atualizado com sucesso!')
      setIsEditing(false)
      fetchUserDetails()
    } catch (error) {
      console.error('Erro:', error)
      setError(error instanceof Error ? error.message : 'Erro ao atualizar perfil')
    }
  }

  const handleResetPassword = async (e: React.FormEvent) => {
    e.preventDefault()
    if (formData.newPassword !== formData.confirmPassword) {
      toast.error('As senhas não conferem')
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.auth.resetPassword, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          oldPassword: formData.currentPassword,
          newPassword: formData.newPassword,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.mensagem || 'Erro ao redefinir senha')
      }

      toast.success('Senha alterada com sucesso!')
      setIsResettingPassword(false)
      setFormData(prev => ({
        ...prev,
        currentPassword: '',
        newPassword: '',
        confirmPassword: '',
      }))
    } catch (error) {
      console.error('Erro:', error)
      toast.error(error instanceof Error ? error.message : 'Erro ao redefinir senha')
    }
  }

  if (!user) {
    return <div className="p-6">Carregando...</div>
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Meu Perfil</h1>
        {!isEditing && !isResettingPassword && (
          <div className="flex gap-4">
            <button
              onClick={() => setIsEditing(true)}
              className={styles.buttonPrimary}
            >
              Editar Perfil
            </button>
            <button
              onClick={() => setIsResettingPassword(true)}
              className={styles.buttonSecondary}
            >
              Alterar Senha
            </button>
          </div>
        )}
      </div>

      <div className={styles.card}>
        <div className={styles.avatarContainer}>
          <div className={styles.avatar}>
            {user.name.charAt(0).toUpperCase()}
          </div>
          <div className={styles.avatarInfo}>
            <h2 className={styles.avatarName}>{user.name}</h2>
            <p className={styles.avatarEmail}>{user.email}</p>
          </div>
        </div>

        {isEditing ? (
          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="name" className={styles.formLabel}>
                Nome
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className={styles.formInput}
              />
            </div>

            <div className={styles.formGroup}>
              <label htmlFor="email" className={styles.formLabel}>
                E-mail
              </label>
              <input
                type="email"
                id="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className={styles.formInput}
              />
            </div>

            {error && <p className={styles.errorMessage}>{error}</p>}

            <div className={styles.formActions}>
              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className={styles.buttonSecondary}
              >
                Cancelar
              </button>
              <button type="submit" className={styles.buttonPrimary}>
                Salvar Alterações
              </button>
            </div>
          </form>
        ) : isResettingPassword ? (
          <form onSubmit={handleResetPassword} className={styles.form}>
            <div className={styles.formGroup}>
              <label htmlFor="currentPassword" className={styles.formLabel}>
                Senha Atual
              </label>
              <input
                type="password"
                id="currentPassword"
                value={formData.currentPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, currentPassword: e.target.value }))}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="newPassword" className={styles.formLabel}>
                Nova Senha
              </label>
              <input
                type="password"
                id="newPassword"
                value={formData.newPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, newPassword: e.target.value }))}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="confirmPassword" className={styles.formLabel}>
                Confirmar Nova Senha
              </label>
              <input
                type="password"
                id="confirmPassword"
                value={formData.confirmPassword}
                onChange={(e) => setFormData(prev => ({ ...prev, confirmPassword: e.target.value }))}
                className={styles.formInput}
                required
              />
            </div>
            <div className={styles.formActions}>
              <button
                type="submit"
                className={styles.buttonPrimary}
              >
                Alterar Senha
              </button>
              <button
                type="button"
                onClick={() => setIsResettingPassword(false)}
                className={styles.buttonSecondary}
              >
                Cancelar
              </button>
            </div>
          </form>
        ) : (
          <div className={styles.form}>
            <div>
              <h3 className={styles.title}>Informações Pessoais</h3>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>Nome</p>
                <p className={styles.avatarName}>{user.name}</p>
              </div>
              <div className={styles.formGroup}>
                <p className={styles.formLabel}>E-mail</p>
                <p className={styles.avatarEmail}>{user.email}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
} 