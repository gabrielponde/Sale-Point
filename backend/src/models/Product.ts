import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { Category } from './Category';

@Entity('products') 
export class Product {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ name: 'description' }) 
    description: string;

    @Column({ name: 'quantity_stock' })
    quantity_stock: number;

    @Column('decimal', { precision: 10, scale: 2, name: 'value' }) 
    value: string;

    @Column({ name: 'image_url', nullable: true }) 
    image_url?: string; 

    @ManyToOne(() => Category, (category) => category.products)
    @JoinColumn({ name: 'category_id' }) 
    category: Category;
}
