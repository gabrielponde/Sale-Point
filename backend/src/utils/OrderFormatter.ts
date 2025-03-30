import { Order } from '../models/Order';

export class OrderFormatter {
    static formatOrders(orders: Order[]): any[] {
        return orders.map(order => ({
            id: order.id,
            client_id: order.client.id,
            observation: order.observation,
            total_value: order.total_value,
            created_at: order.created_at,
            updated_at: order.updated_at,
            client: {
                id: order.client.id,
                name: order.client.name
            },
            product: order.product.map(product => ({
                id: product.id,
                product_id: product.product.id,
                quantity_product: product.quantity_product,
                product_value: product.product_value,
                order_id: order.id
            })),
            total: order.total_value
        }));
    }
}
