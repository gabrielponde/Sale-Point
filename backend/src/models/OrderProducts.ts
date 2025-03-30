import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Order } from './Order';
import { Product } from './Product'; 

@Entity('order_products') 
export class OrderProduct {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Order, order => order.product)
    @JoinColumn({ name: 'order_id' }) 
    order: Order; 

    @ManyToOne(() => Product, product => product.id)
    @JoinColumn({ name: 'product_id' }) 
    product: Product; 

    @Column('decimal', { precision: 10, scale: 2 })
    product_value: number;

    @Column()
    quantity_product: number;
}
