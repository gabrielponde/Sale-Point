import { UserRepository } from '../repositories/usersRepository';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import 'dotenv/config';
import { ApiError } from '../helpers/api-error';

export class UserService {
    private readonly userRepository: UserRepository;

    constructor() {
        this.userRepository = new UserRepository();
    }

    async registerUser(name: string, email: string, password: string) {
        try {
            console.log('Iniciando registro de usuário:', { name, email });
            
            const existingUser = await this.userRepository.findUserByEmail(email);
            if (existingUser) {
                console.log('Email já existe:', email);
                throw new ApiError('O email já existe.', 400);
            }

            console.log('Criando hash da senha');
            const hashedPassword = await bcrypt.hash(password, 10);
            
            console.log('Criando usuário no banco de dados');
            const user = await this.userRepository.createUser({ 
                name, 
                email, 
                password: hashedPassword 
            });

            console.log('Usuário registrado com sucesso:', { id: user.id, name: user.name, email: user.email });
            return user;
        } catch (error) {
            console.error('Erro no serviço de registro:', error);
            if (error instanceof ApiError) {
                throw error;
            }
            throw new ApiError('Erro ao registrar usuário.', 500);
        }
    }

    async loginUser(email: string, password: string) {
        const user = await this.userRepository.findUserByEmail(email);
        if (!user) {
            throw new ApiError('O usuário não foi encontrado.', 404);
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            throw new ApiError('Email ou senha não conferem.', 400);
        }

        const secret = process.env.JWT_SECRET as string;
        const token = jwt.sign({ id: user.id }, secret, { expiresIn: '8h' });
        return { user, token };
    }

    async resetPassword(id: number, oldPassword: string, newPassword: string) {
        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new ApiError('Usuário não encontrado.', 404);
        }

        const isOldPasswordCorrect = await bcrypt.compare(oldPassword, user.password);
        if (!isOldPasswordCorrect) {
            throw new ApiError('Senha antiga incorreta.', 401);
        }

        const newHashedPassword = await bcrypt.hash(newPassword, 10);
        await this.userRepository.updateUserPassword(user.id, newHashedPassword);
        return user.name;
    }

    async editUser(id: number, name: string, email: string) {
        const existingEmail = await this.userRepository.findUserByEmail(email);
        if (existingEmail && existingEmail.id !== id) {
            throw new ApiError('O e-mail informado já está sendo utilizado por outro usuário.', 400);
        }

        const user = await this.userRepository.findUserById(id);
        if (!user) {
            throw new ApiError('Usuário não encontrado.', 404);
        }

        user.name = name;
        user.email = email;

        await this.userRepository.updateUser(user);
    }
}
