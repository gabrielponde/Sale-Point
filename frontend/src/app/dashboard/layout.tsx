'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { FaHome, FaBox, FaUsers, FaShoppingCart, FaUser, FaSignOutAlt, FaTags } from 'react-icons/fa'
import { useRouter } from 'next/navigation'
import styles from '@/styles/dashboard.module.css'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const router = useRouter()

  const handleLogout = () => {
    localStorage.removeItem('token')
    router.push('/login')
  }

  const menuItems = [
    { href: '/dashboard', label: 'Dashboard', icon: FaHome },
    { href: '/dashboard/products', label: 'Produtos', icon: FaBox },
    { href: '/dashboard/categories', label: 'Categorias', icon: FaTags },  
    { href: '/dashboard/customers', label: 'Clientes', icon: FaUsers },
    { href: '/dashboard/orders', label: 'Pedidos', icon: FaShoppingCart },
  ]

  return (
    <div className={styles.layout}>
      <aside className={styles.sidebar}>
        <div className={styles.sidebarHeader}>
          <h1 className={styles.sidebarTitle}>PontoVendas</h1>
        </div>
        <nav className={styles.sidebarNav}>
          {menuItems.map((item) => {
            const Icon = item.icon
            const isActive = pathname === item.href
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
        <div className={styles.sidebarFooter}>
          <Link href="/dashboard/profile" className={styles.sidebarUserInfo}>
            <div className={styles.sidebarUserAvatar}>P</div>
            <div className={styles.sidebarUserDetails}>
              <div className={styles.sidebarUserName}>Perfil</div>
            </div>
          </Link>
          <button onClick={handleLogout} className={styles.sidebarLogoutButton}>
            <FaSignOutAlt className="w-5 h-5" />
            Sair
          </button>
        </div>
      </aside>
      <main className={styles.mainContent}>
        {children}
      </main>
    </div>
  )
} 