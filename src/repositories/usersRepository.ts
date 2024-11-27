import { AppDataSource } from '../config/data-source'; 
import { User } from '../models/User';
import { Repository } from 'typeorm';

export class UserRepository {
    private repository: Repository<User>;

    constructor() {
        this.repository = AppDataSource.getRepository(User);
    }

    async createUser(data: Partial<User>): Promise<User> {
        const user = this.repository.create(data);
        await this.repository.save(user);
        return user;
    }

    async findUserByEmail(email: string): Promise<User | null> {
        return this.repository.findOne({ where: { email } }) || null;
    }

    async updateUserPassword(id: number, newPassword: string): Promise<void> {
        await this.repository.update(id, { password: newPassword });
    }
    
    async findUserById(id: number): Promise<User | null> {
        return this.repository.findOne({ where: { id } }) || null;
    }

   async updateUser(user: User): Promise<void> {
    await this.repository.save(user);
   }
}

