'use client'

import { useState, useEffect } from 'react'
import { FaShoppingCart, FaUsers, FaBox, FaDollarSign } from 'react-icons/fa'
import { endpoints } from '@/config/api'
import styles from '@/styles/dashboard.module.css'

interface DashboardStats {
  totalOrders: number
  totalCustomers: number
  totalProducts: number
  totalRevenue: number
}

export default function DashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    totalOrders: 0,
    totalCustomers: 0,
    totalProducts: 0,
    totalRevenue: 0,
  })

  useEffect(() => {
    fetchDashboardStats()
  }, [])

  const fetchDashboardStats = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.dashboard.stats, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao buscar estatísticas')
      }

      const data = await response.json()
      setStats(data)
    } catch (error) {
      console.error('Erro:', error)
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Dashboard</h1>
      </div>

      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total de Vendas</div>
          <div className="flex items-center justify-between">
            <div className={styles.statValue}>{stats.totalOrders}</div>
            <FaShoppingCart className="w-8 h-8 text-blue-500" />
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total de Clientes</div>
          <div className="flex items-center justify-between">
            <div className={styles.statValue}>{stats.totalCustomers}</div>
            <FaUsers className="w-8 h-8 text-green-500" />
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Total de Produtos</div>
          <div className="flex items-center justify-between">
            <div className={styles.statValue}>{stats.totalProducts}</div>
            <FaBox className="w-8 h-8 text-yellow-500" />
          </div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statTitle}>Receita Total</div>
          <div className="flex items-center justify-between">
            <div className={styles.statValue}>
              R$ {stats.totalRevenue.toFixed(2)}
            </div>
            <FaDollarSign className="w-8 h-8 text-purple-500" />
          </div>
        </div>
      </div>
    </div>
  )
} 