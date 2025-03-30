'use client'

import { useState, useEffect } from 'react'
import { FaEdit, FaTrash, FaPlus } from 'react-icons/fa'
import { toast } from 'react-toastify'
import { endpoints } from '@/config/api'
import { Client } from '@/types'
import ClientModal from '@/components/clients/ClientModal'
import styles from '@/styles/customers.module.css'

export default function CustomersPage() {
  const [clients, setClients] = useState<Client[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedClient, setSelectedClient] = useState<Client | null>(null)

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
    fetchClients()
  }, [])

  const handleDelete = async (clientId: number) => {
    if (!confirm('Tem certeza que deseja excluir este cliente?')) {
      return
    }

    try {
      const token = localStorage.getItem('token')
      const response = await fetch(endpoints.customers.delete(clientId), {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })

      if (!response.ok) {
        throw new Error('Erro ao excluir cliente')
      }

      toast.success('Cliente excluído com sucesso!')
      fetchClients()
    } catch (error) {
      console.error('Erro:', error)
      toast.error('Erro ao excluir cliente')
    }
  }

  const handleEdit = (client: Client) => {
    setSelectedClient(client)
    setIsModalOpen(true)
  }

  const handleCreate = () => {
    setSelectedClient(null)
    setIsModalOpen(true)
  }

  const formatCPF = (cpf: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = cpf.replace(/\D/g, '')
    // Aplica a formatação XXX.XXX.XXX-XX
    return numbers.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, '$1.$2.$3-$4')
  }

  const formatPhone = (phone: string) => {
    // Remove todos os caracteres não numéricos
    const numbers = phone.replace(/\D/g, '')
    // Aplica a formatação (XX) XXXXX-XXXX
    return numbers.replace(/(\d{2})(\d{5})(\d{4})/, '($1) $2-$3')
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Clientes</h1>
        <button
          onClick={handleCreate}
          className={styles.buttonPrimary}
        >
          <FaPlus />
          Novo Cliente
        </button>
      </div>

      <div className={styles.tableContainer}>
        <table className={styles.table}>
          <thead className={styles.tableHeader}>
            <tr>
              <th className={styles.tableHeaderCell}>Nome</th>
              <th className={styles.tableHeaderCell}>Email</th>
              <th className={styles.tableHeaderCell}>CPF</th>
              <th className={styles.tableHeaderCell}>Telefone</th>
              <th className={styles.tableHeaderCell}>Endereço</th>
              <th className={styles.tableHeaderCell}>Ações</th>
            </tr>
          </thead>
          <tbody>
            {clients.map((client) => (
              <tr key={client.id} className={styles.tableRow}>
                <td className={styles.tableCell}>{client.name}</td>
                <td className={styles.tableCell}>{client.email}</td>
                <td className={styles.tableCell}>{formatCPF(client.cpf)}</td>
                <td className={styles.tableCell}>{formatPhone(client.phone)}</td>
                <td className={styles.tableCell}>
                  {client.street}, {client.number} - {client.district}, {client.city}/{client.state} - {client.cep}
                </td>
                <td className={styles.tableCellActions}>
                  <button
                    onClick={() => handleEdit(client)}
                    className={styles.editButton}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDelete(client.id)}
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

      {isModalOpen && (
        <ClientModal
          client={selectedClient}
          onClose={() => {
            setIsModalOpen(false)
            setSelectedClient(null)
          }}
          onSave={fetchClients}
        />
      )}
    </div>
  )
} 