import { Request, Response } from 'express';
import { AppDataSource } from '../config/data-source';
import { Order } from '../models/Order';
import { Client } from '../models/Client';
import { Product } from '../models/Product';
import { OrderRepository } from '../repositories/ordersRepository';

export class DashboardController {
    private orderRepository: OrderRepository;

    constructor() {
        this.orderRepository = new OrderRepository(AppDataSource);
    }

    async getStats(req: Request, res: Response): Promise<void> {
        try {
            const clientRepository = AppDataSource.getRepository(Client);
            const productRepository = AppDataSource.getRepository(Product);

            // Buscar total de pedidos
            const orders = await this.orderRepository.findOrders();
            const totalOrders = orders.length;

            // Buscar total de clientes
            const totalCustomers = await clientRepository.count();

            // Buscar total de produtos
            const totalProducts = await productRepository.count();

            // Calcular receita total (soma dos totais dos pedidos em reais)
            const totalRevenue = orders.reduce((acc, order) => {
                // Converte o valor de centavos para reais antes de somar
                const orderValue = typeof order.total_value === 'string' 
                    ? parseInt(order.total_value) / 100 
                    : order.total_value / 100;
                return acc + orderValue;
            }, 0);

            res.status(200).json({
                totalOrders,
                totalCustomers,
                totalProducts,
                totalRevenue, // Retorna em reais
            });
        } catch (error) {
            console.error('Erro ao buscar estatísticas:', error);
            res.status(500).json({ error: 'Erro ao buscar estatísticas' });
        }
    }
} 