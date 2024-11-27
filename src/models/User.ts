import { Entity, PrimaryGeneratedColumn, Column } from 'typeorm';

@Entity('users')
export class User {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ nullable: false }) 
    name: string;

    @Column({ unique: true, nullable: false }) 
    email: string;

    @Column({ nullable: false }) 
    password: string;
}
