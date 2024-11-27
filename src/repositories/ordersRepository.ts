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
}
