import { Order } from '../models/Order';

export class OrderFormatter {
    static formatOrders(orders: Order[]): any[] {
        return orders.map(order => ({
            order: {
                id: order.id,
                total_value: order.total_value,
                observation: order.observation,
                client_id: order.client.id
            },
            order_products: order.product.map(product => ({
                id: product.id,
                quantity_product: product.quantity_product,
                product_value: product.product_value,
                order_id: order.id,
                product_id: product.product.id
            }))
        }));
    }
}
