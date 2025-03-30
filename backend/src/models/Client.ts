import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Order } from './Order';

@Entity('clients')
export class Client {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column({ unique: true })
    email: string;

    @Column({ unique: true })
    cpf: string;

    @Column()
    phone: string;

    @Column({ nullable: true })
    cep?: string;

    @Column({ nullable: true })
    street?: string;

    @Column({ nullable: true })
    number?: string;

    @Column({ nullable: true })
    district?: string;

    @Column({ nullable: true })
    city?: string;

    @Column({ nullable: true })
    state?: string;

    @OneToMany(() => Order, order => order.client)
    order: Order[]; 
}
