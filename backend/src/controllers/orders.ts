import { Request, Response } from 'express';
import { Validator } from '../utils/Validator';
import { ProductService } from '../services/ProductService';
import { OrderService } from '../services/OrderService';
import { ClientParser } from '../utils/ClientParser';
import { OrderFormatter } from '../utils/OrderFormatter';
import { OrderRepository } from '../repositories/ordersRepository';
import { AppDataSource } from '../config/data-source';
import { ApiError } from '../helpers/api-error';

export class OrderController {
    private orderRepository: OrderRepository;
    private productService: ProductService;
    private orderService: OrderService;

    constructor() {
        this.orderRepository = new OrderRepository(AppDataSource);
        this.productService = new ProductService(this.orderRepository);
        this.orderService = new OrderService(this.orderRepository);
    }

    async register(req: Request, res: Response): Promise<Response> {
        const { client_id, observation, order_products } = req.body;

        Validator.validateRegisterData(client_id, order_products);

        const client = await this.orderRepository.findClientById(client_id);
        if (!client) {
            throw new ApiError('Cliente não encontrado.', 404);
        }

        const products = await this.productService.validateAndFetchProducts(order_products);
        if (!products.length) {
            throw new ApiError('Nenhum produto válido encontrado.', 400);
        }

        const newOrder = await this.orderService.createOrder(client, observation, products, order_products);
        return res.status(201).json(newOrder);
    }

    async list(req: Request, res: Response): Promise<Response> {
        const clientId = ClientParser.parseClientId(req.query);
        
        const orders = await this.orderRepository.findOrders(clientId);
        const formattedOrders = OrderFormatter.formatOrders(orders);
        return res.status(200).json(formattedOrders);
    }

    async delete(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;

        try {
            await this.orderRepository.deleteOrder(Number(id));
            return res.status(204).send();
        } catch (error) {
            if (error instanceof Error) {
                throw new ApiError(error.message, 404);
            }
            throw new ApiError('Erro ao excluir pedido', 500);
        }
    }

    async update(req: Request, res: Response): Promise<Response> {
        const { id } = req.params;
        const { client_id, observation, order_products } = req.body;

        Validator.validateRegisterData(client_id, order_products);

        const client = await this.orderRepository.findClientById(client_id);
        if (!client) {
            throw new ApiError('Cliente não encontrado.', 404);
        }

        const products = await this.productService.validateAndFetchProducts(order_products);
        if (!products.length) {
            throw new ApiError('Nenhum produto válido encontrado.', 400);
        }

        const updatedOrder = await this.orderService.updateOrder(Number(id), client, observation, products, order_products);
        return res.status(200).json(updatedOrder);
    }
}
