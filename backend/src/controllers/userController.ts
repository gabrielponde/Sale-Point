import { Request, Response } from 'express'
import prisma from '../lib/prisma'
import bcrypt from 'bcrypt'

export class UserController {
  async updateProfile(req: Request, res: Response) {
    try {
      const { name, email } = req.body
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado' })
      }

      // Verificar se o email já está em uso por outro usuário
      const existingUser = await prisma.user.findFirst({
        where: {
          email,
          NOT: {
            id: userId,
          },
        },
      })

      if (existingUser) {
        return res.status(400).json({ message: 'Email já está em uso' })
      }

      const updatedUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          name,
          email,
        },
        select: {
          id: true,
          name: true,
          email: true,
        },
      })

      return res.json(updatedUser)
    } catch (error) {
      console.error('Erro ao atualizar perfil:', error)
      return res.status(500).json({ message: 'Erro ao atualizar perfil' })
    }
  }

  async changePassword(req: Request, res: Response) {
    try {
      const { currentPassword, newPassword } = req.body
      const userId = req.user?.id

      if (!userId) {
        return res.status(401).json({ message: 'Usuário não autenticado' })
      }

      // Buscar usuário
      const user = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      })

      if (!user) {
        return res.status(404).json({ message: 'Usuário não encontrado' })
      }

      // Verificar senha atual
      const isPasswordValid = await bcrypt.compare(currentPassword, user.password)

      if (!isPasswordValid) {
        return res.status(400).json({ message: 'Senha atual incorreta' })
      }

      // Criptografar nova senha
      const hashedPassword = await bcrypt.hash(newPassword, 10)

      // Atualizar senha
      await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          password: hashedPassword,
        },
      })

      return res.json({ message: 'Senha alterada com sucesso' })
    } catch (error) {
      console.error('Erro ao alterar senha:', error)
      return res.status(500).json({ message: 'Erro ao alterar senha' })
    }
  }
} 