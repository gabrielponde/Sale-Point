'use client'

import Link from 'next/link'
import { FaArrowRight } from 'react-icons/fa'
import styles from '@/styles/app.module.css'

export default function HomePage() {
  return (
    <div className={styles.container}>
      {/* Header */}
      <header className={styles.header}>
        <div className={styles.headerContent}>
          <h1 className={styles.headerTitle}>Sale Point</h1>
          <div className={styles.headerActions}>
            <Link
              href="/login"
              className={styles.headerLink}
            >
              Login
            </Link>
            <Link
              href="/register"
              className={styles.headerButton}
            >
              Criar Conta
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h2 className={styles.heroTitle}>
            Gerencie seu negócio de forma simples e eficiente
          </h2>
          <p className={styles.heroDescription}>
            O Sale Point é uma solução completa para gerenciamento de ponto de venda,
            permitindo controle de estoque, vendas, clientes e muito mais.
          </p>
          <Link
            href="/register"
            className={styles.heroButton}
          >
            Começar Agora
            <FaArrowRight />
          </Link>
        </div>
      </section>

      {/* Features Section */}
      <section className={styles.features}>
        <div className={styles.featuresContent}>
          <h2 className={styles.featuresTitle}>Recursos Principais</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Controle de Estoque</h3>
              <p className={styles.featureDescription}>
                Gerencie seu estoque de forma eficiente, com alertas de baixa quantidade
                e histórico de movimentações.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Vendas</h3>
              <p className={styles.featureDescription}>
                Realize vendas de forma rápida e organizada, com suporte a múltiplas
                formas de pagamento.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Clientes</h3>
              <p className={styles.featureDescription}>
                Cadastre e gerencie seus clientes, com histórico de compras e
                informações de contato.
              </p>
            </div>
            <div className={styles.featureCard}>
              <h3 className={styles.featureTitle}>Relatórios</h3>
              <p className={styles.featureDescription}>
                Acesse relatórios detalhados sobre vendas, estoque e clientes para
                tomar melhores decisões.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className={styles.footer}>
        <div className={styles.footerContent}>
          <p className={styles.footerText}>
            Desenvolvido por Gabriel Avena
          </p>
        </div>
      </footer>
    </div>
  )
} 