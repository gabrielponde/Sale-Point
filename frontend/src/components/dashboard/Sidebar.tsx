'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  FaShoppingCart,
  FaBox,
  FaTags,
  FaUsers,
  FaUser,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from 'react-icons/fa'
import styles from '@/styles/sidebar.module.css'

const menuItems = [
  { name: 'Pedidos', href: '/dashboard/orders', icon: FaShoppingCart },
  { name: 'Produtos', href: '/dashboard/products', icon: FaBox },
  { name: 'Categorias', href: '/dashboard/categories', icon: FaTags },
  { name: 'Clientes', href: '/dashboard/customers', icon: FaUsers },
]

export default function Sidebar() {
  const [isOpen, setIsOpen] = useState(true)
  const pathname = usePathname()

  const handleLogout = () => {
    localStorage.removeItem('token')
    window.location.href = '/login'
  }

  return (
    <>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={styles.toggleButton}
      >
        {isOpen ? <FaTimes size={20} /> : <FaBars size={20} />}
      </button>

      {isOpen && (
        <div
          className={styles.overlay}
          onClick={() => setIsOpen(false)}
        />
      )}

      <div
        className={`${styles.sidebar} ${!isOpen ? styles.sidebarClosed : ''}`}
      >
        <div className={styles.sidebarContainer}>
          <div className={styles.sidebarHeader}>
            <h1 className={styles.sidebarTitle}>PontoVendas</h1>
          </div>

          <nav className={styles.nav}>
            {menuItems.map((item) => {
              const Icon = item.icon
              const isActive = pathname === item.href

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={`${styles.navLink} ${isActive ? styles.navLinkActive : ''}`}
                  onClick={() => setIsOpen(false)}
                >
                  <Icon className={styles.navIcon} />
                  <span>{item.name}</span>
                </Link>
              )
            })}
          </nav>

          <div className={styles.userMenu}>
            <Link
              href="/dashboard/profile"
              className={`${styles.navLink} ${pathname === '/dashboard/profile' ? styles.navLinkActive : ''}`}
              onClick={() => setIsOpen(false)}
            >
              <FaUser className={styles.navIcon} />
              <span>Perfil</span>
            </Link>
          </div>

          <div className={styles.userMenu}>
            <button
              onClick={handleLogout}
              className={styles.logoutButton}
            >
              <FaSignOutAlt className={styles.navIcon} />
              <span>Sair</span>
            </button>
          </div>
        </div>
      </div>
    </>
  )
} 