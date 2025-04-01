import { DataSource, In } from 'typeorm';
import { Order } from '../models/Order';
import { OrderProduct } from '../models/OrderProducts';
import { Client } from '../models/Client';
import { Product } from '../models/Product';

export class OrderRepository {
    private dataSource: DataSource;

    constructor(dataSource: DataSource) {
        this.dataSource = dataSource;
    }

    async findClientById(clientId: number): Promise<Client | null> {
        return this.dataSource.getRepository(Client).findOneBy({ id: clientId });
    }

    async findProductById(productIds: number[]): Promise<Product[]> {
        return this.dataSource.getRepository(Product).findBy({ id: In(productIds) });
    }

    async updateProductStock(product: Product): Promise<void> {
        await this.dataSource.getRepository(Product).save(product);
    }

    async saveOrder(order: Order): Promise<Order> {
        return this.dataSource.getRepository(Order).save(order);
    }

    async saveProductOrder(productOrder: OrderProduct): Promise<OrderProduct> {
        return this.dataSource.getRepository(OrderProduct).save(productOrder);
    }

    async findOrders(clientId?: number): Promise<Order[]> {
        const queryBuilder = this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.client', 'client')
            .leftJoinAndSelect('order.product', 'productOrder')
            .leftJoinAndSelect('productOrder.product', 'product');

        if (clientId) {
            queryBuilder.where('order.client = :clientId', { clientId });
        }

        return queryBuilder.getMany();
    }

    async findOrderById(id: number): Promise<Order | null> {
        return this.dataSource.getRepository(Order)
            .createQueryBuilder('order')
            .leftJoinAndSelect('order.client', 'client')
            .leftJoinAndSelect('order.product', 'productOrder')
            .leftJoinAndSelect('productOrder.product', 'product')
            .where('order.id = :id', { id })
            .getOne();
    }

    async deleteOrder(id: number): Promise<void> {
        const order = await this.findOrderById(id);
        if (!order) {
            throw new Error('Pedido não encontrado');
        }

        // Primeiro, vamos restaurar o estoque dos produtos
        for (const orderProduct of order.product) {
            const product = orderProduct.product;
            if (product) {
                product.quantity_stock += orderProduct.quantity_product;
                await this.updateProductStock(product);
            }
        }

        // Agora podemos excluir o pedido (os produtos do pedido serão excluídos automaticamente devido ao cascade)
        await this.dataSource.getRepository(Order).remove(order);
    }

    async deleteOrderProducts(orderId: number): Promise<void> {
        await this.dataSource
            .createQueryBuilder()
            .delete()
            .from(OrderProduct)
            .where('order_id = :orderId', { orderId })
            .execute();
    }
}
