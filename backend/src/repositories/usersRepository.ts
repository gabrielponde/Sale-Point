import { AppDataSource } from '../config/data-source'; 
import { User } from '../models/User';
import { Repository } from 'typeorm';

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async createUser(data: Partial<User>): Promise<User> {
        try {
            console.log('Tentando criar usuário com dados:', { ...data, password: '[REDACTED]' });
            const user = this.repository.create(data);
            const savedUser = await this.repository.save(user);
            console.log('Usuário criado com sucesso:', { id: savedUser.id, name: savedUser.name, email: savedUser.email });
            return savedUser;
        } catch (error) {
            console.error('Erro ao criar usuário:', error);
            throw error;
        }
    }

    async findUserByEmail(email: string): Promise<User | null> {
        try {
            console.log('Buscando usuário por email:', email);
            const user = await this.repository.findOne({ where: { email } });
            console.log('Resultado da busca:', user ? 'Usuário encontrado' : 'Usuário não encontrado');
            return user || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por email:', error);
            throw error;
        }
    }

    async updateUserPassword(id: number, newPassword: string): Promise<void> {
        try {
            console.log('Atualizando senha do usuário:', id);
            await this.repository.update(id, { password: newPassword });
            console.log('Senha atualizada com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar senha:', error);
            throw error;
        }
    }
    
    async findUserById(id: number): Promise<User | null> {
        try {
            console.log('Buscando usuário por ID:', id);
            const user = await this.repository.findOne({ where: { id } });
            console.log('Resultado da busca:', user ? 'Usuário encontrado' : 'Usuário não encontrado');
            return user || null;
        } catch (error) {
            console.error('Erro ao buscar usuário por ID:', error);
            throw error;
        }
    }

    async updateUser(user: User): Promise<void> {
        try {
            console.log('Atualizando usuário:', { id: user.id, name: user.name, email: user.email });
            await this.repository.save(user);
            console.log('Usuário atualizado com sucesso');
        } catch (error) {
            console.error('Erro ao atualizar usuário:', error);
            throw error;
        }
    }
}

