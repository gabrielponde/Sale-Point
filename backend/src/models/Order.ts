import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, OneToMany, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { Client } from './Client'; 
import { OrderProduct } from './OrderProducts'; 

@Entity('orders') 
export class Order {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => Client, client => client.order)
    @JoinColumn({ name: 'client_id' }) 
    client: Client; 

    @Column({ nullable: true })
    observation?: string;

    @Column('decimal', { precision: 10, scale: 2 })
    total_value: number;

    @OneToMany(() => OrderProduct, orderProduct => orderProduct.order)
    product: OrderProduct[]; 

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}

