import { Product } from '../models/Product';
import { OrderProduct } from '../models/OrderProducts';
import { OrderRepository } from '../repositories/ordersRepository';
import { Order } from '../models/Order';

export class OrderService {
    private orderRepository: OrderRepository;

    constructor(orderRepository: OrderRepository) {
        this.orderRepository = orderRepository;
    }

    async createOrder(client: any, observation: string, products: Product[], order_products: any[]): Promise<Order> {
        const orderProductsInstances: OrderProduct[] = order_products.map(orderProduct => {
            const product = products.find((p: Product) => p.id === orderProduct.product_id);
            const orderProductInstance = new OrderProduct();
            orderProductInstance.product = product!;
            orderProductInstance.quantity_product = orderProduct.quantity_product;
            orderProductInstance.product_value = parseFloat(product!.value);
            return orderProductInstance;
        });

        const order = new Order();
        order.client = client;
        order.observation = observation;
        order.total_value = orderProductsInstances.reduce((total, item) => {
            return total + (item.product_value * item.quantity_product);
        }, 0);

        const newOrder = await this.orderRepository.saveOrder(order);

        for (const productOrder of orderProductsInstances) {
            productOrder.order = newOrder;
            await this.updateStockAndSaveProductOrder(productOrder);
        }

        return newOrder;
    }

    private async updateStockAndSaveProductOrder(productOrder: OrderProduct): Promise<void> {
        const product = productOrder.product;
        if (product) {
            product.quantity_stock -= productOrder.quantity_product;
            await this.orderRepository.updateProductStock(product);
            await this.orderRepository.saveProductOrder(productOrder);
        }
    }

    async updateOrder(id: number, client: any, observation: string, products: Product[], order_products: any[]): Promise<Order> {
        const order = await this.orderRepository.findOrderById(id);
        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        try {
            // Guarda o cliente original
            const originalClient = order.client;

            // Primeiro, vamos restaurar o estoque dos produtos antigos
            for (const orderProduct of order.product) {
                const product = orderProduct.product;
                if (product) {
                    product.quantity_stock += orderProduct.quantity_product;
                    await this.orderRepository.updateProductStock(product);
                }
            }

            // Remove os produtos antigos do pedido
            await this.orderRepository.deleteOrderProducts(id);
            order.product = [];

            // Agora vamos criar os novos produtos do pedido
            const orderProductsInstances: OrderProduct[] = order_products.map(orderProduct => {
                const product = products.find((p: Product) => p.id === orderProduct.product_id);
                if (!product) {
                    throw new Error(`Produto com ID ${orderProduct.product_id} não encontrado`);
                }
                const orderProductInstance = new OrderProduct();
                orderProductInstance.product = product;
                orderProductInstance.quantity_product = orderProduct.quantity_product;
                orderProductInstance.product_value = parseFloat(product.value);
                return orderProductInstance;
            });

            // Atualiza os dados do pedido mantendo o cliente original
            order.client = originalClient;
            order.observation = observation;
            order.total_value = orderProductsInstances.reduce((total, item) => {
                return total + (item.product_value * item.quantity_product);
            }, 0);

            // Salva o pedido atualizado
            const savedOrder = await this.orderRepository.saveOrder(order);

            // Salva os novos produtos do pedido
            for (const productOrder of orderProductsInstances) {
                productOrder.order = savedOrder;
                await this.updateStockAndSaveProductOrder(productOrder);
            }

            // Busca o pedido atualizado com todos os relacionamentos
            const updatedOrder = await this.orderRepository.findOrderById(id);
            if (!updatedOrder) {
                throw new Error('Erro ao buscar pedido atualizado');
            }

            // Garante que o cliente está presente na resposta
            if (!updatedOrder.client) {
                updatedOrder.client = originalClient;
            }

            return updatedOrder;
        } catch (error) {
            console.error('Erro ao atualizar pedido:', error);
            throw error;
        }
    }
}
