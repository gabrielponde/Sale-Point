import { ClientRepository } from '../repositories/clientsRepository';
import { ApiError } from '../helpers/api-error';
import { AppDataSource } from '../config/data-source';
import { IClient } from '../interfaces/IClient'

export class ClientService {
    private clientRepository: ClientRepository;

    constructor() {
        this.clientRepository = new ClientRepository(AppDataSource);
    }

    private convertToUpperCase(data: any): any {
        return {
            ...data,
            name: data.name.toUpperCase(),
            street: data.street?.toUpperCase(),
            district: data.district?.toUpperCase(),
            city: data.city?.toUpperCase(),
            state: data.state?.toUpperCase(),
        };
    }

    async registerClient(clientData: any) {
        const { email, cpf } = clientData;

        const existingEmail = await this.clientRepository.findByEmail(email);
        if (existingEmail) {
            throw new ApiError('O email já está em uso por outro cliente.', 400);
        }

        const existingCpf = await this.clientRepository.findByCpf(cpf);
        if (existingCpf) {
            throw new ApiError('O CPF já está em uso por outro cliente.', 400);
        }

        const formattedData = this.convertToUpperCase(clientData);
        return await this.clientRepository.create(formattedData);
    }

    async updateClient(clientId: number, updateData: IClient): Promise<IClient> {
        const existingEmail = await this.clientRepository.findByEmailAndDifferentId(updateData.email, clientId);
        if (existingEmail) {
            throw new ApiError('O e-mail informado já está em uso por outro cliente.', 400);
        }
    
        const existingCpf = await this.clientRepository.findByCpfAndDifferentId(updateData.cpf, clientId);
        if (existingCpf) {
            throw new ApiError('O CPF informado já está em uso por outro cliente.', 400);
        }
    
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new ApiError('Cliente não encontrado.', 404);
        }
    
        const formattedData = this.convertToUpperCase(updateData);
        Object.assign(client, formattedData);
        await this.clientRepository.update(client);
        return client; 
    }
    
    async getAllClients() {
        return await this.clientRepository.findAll();
    }

    async getClientDetails(clientId: number) {
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new ApiError('Cliente não encontrado.', 404);
        }
        return client;
    }

    async deleteClient(clientId: number) {
        const client = await this.clientRepository.findById(clientId);
        if (!client) {
            throw new ApiError('Cliente não encontrado.', 404);
        }
        await this.clientRepository.delete(clientId);
    }
}
