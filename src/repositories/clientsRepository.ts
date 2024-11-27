import { DataSource, Not, Repository } from 'typeorm';
import { Client } from '../models/Client'; 

export class ClientRepository {
    private repository: Repository<Client>;

    constructor(dataSource: DataSource) {
        this.repository = dataSource.getRepository(Client);
    }

    async create(clientData: Partial<Client>): Promise<Client> {
        const client = this.repository.create(clientData);
        await this.repository.save(client);
        return client;
    }

    async findByEmail(email: string): Promise<Client | null> {
        return this.repository.findOne({ where: { email } });
    }

    async findByCpf(cpf: string): Promise<Client | null> {
        return this.repository.findOne({ where: { cpf } });
    }

    async findByEmailAndDifferentId(email: string, id: number): Promise<Client | null> {
        return this.repository.findOne({ where: { email, id: Not(id) } });
    }

    async findByCpfAndDifferentId(cpf: string, id: number): Promise<Client | null> {
        return this.repository.findOne({ where: { cpf, id: Not(id) } });
    }

    async findById(id: number): Promise<Client | null> {
        return this.repository.findOne({ where: { id } });
    }

    async update(client: Client): Promise<void> {
        await this.repository.save(client);
    }

    async findAll(): Promise<Client[]> {
        return this.repository.find();
    }
}
