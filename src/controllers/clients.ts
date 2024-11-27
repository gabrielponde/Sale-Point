import { Request, Response } from 'express';
import { ClientService } from '../services/ClientService';
import { ApiError } from '../helpers/api-error';

export class ClientController {
    private clientService: ClientService;

    constructor() {
        this.clientService = new ClientService();
    }

    async register(req: Request, res: Response): Promise<Response> {
        const { name, email, cpf, cep, street, number, district, city, state } = req.body;

        const client = await this.clientService.registerClient({
            name,
            email,
            cpf,
            cep,
            street,
            number,
            district,
            city,
            state,
        });

        return res.status(201).json(client);
    }

    async edit(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const clientId = Number(id);
    
        const updatedClient = await this.clientService.updateClient(clientId, req.body);
    
        return res.status(200).json({ mensagem: 'Cliente atualizado com sucesso!', updatedClient });
    }
    
    async list(req: Request, res: Response): Promise<Response> {
        const clients = await this.clientService.getAllClients();
        return res.status(200).json(clients);
    }

    async getDetails(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const clientId = Number(id);

        const client = await this.clientService.getClientDetails(clientId);
        if (!client) {
            throw new ApiError('Cliente não encontrado.', 404);
        }

        return res.status(200).json(client);
    }
}
