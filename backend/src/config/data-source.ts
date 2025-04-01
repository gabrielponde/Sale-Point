import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../models/User';
import { Product } from '../models/Product';
import { Order } from '../models/Order';
import { OrderProduct } from '../models/OrderProducts';
import { Client } from '../models/Client';
import { Category } from '../models/Category';

const port = parseInt(process.env.DB_PORT || '5432');

// Singleton para a conexão do banco
let connectionInstance: DataSource | null = null;

console.log('Initializing database configuration...');

export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Product, Order, OrderProduct, Client, Category],
    synchronize: false,
    ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    extra: {
        max: 10, // Máximo de conexões simultâneas no pool
        connectionTimeoutMillis: 5000,
        query_timeout: 5000,
        statement_timeout: 5000,
        idle_in_transaction_session_timeout: 5000,
        application_name: 'sale-point-api',
        keepalive: true,
        keepaliveInitialDelayMillis: 1000,
    },
    logging: false,
});

export async function getConnection(): Promise<DataSource> {
    if (connectionInstance && connectionInstance.isInitialized) {
        return connectionInstance;
    }

    try {
        console.log('Attempting to initialize database connection...');
        await AppDataSource.initialize();
        console.log('Database connected successfully');
        connectionInstance = AppDataSource;
    } catch (error) {
        console.error('Database connection error:', error);
        throw error;
    }

    return connectionInstance;
}

export async function checkConnection(): Promise<boolean> {
    try {
        const connection = await getConnection();
        await connection.query('SELECT 1');
        return true;
    } catch (error) {
        console.error('Health check failed:', error);
        return false;
    }
}

export async function testConnection() {
    try {
        if (!AppDataSource.isInitialized) {
            console.log('Initializing database connection...');
            await AppDataSource.initialize();
            console.log('Database connected successfully');
            console.log('Registered entities:', 
                AppDataSource.entityMetadatas.map(m => m.name));
            console.log('Migrations directory:', path.join(__dirname, '..', '..', 'migrations'));
            const migrations = await AppDataSource.runMigrations();
            console.log('Migrations applied:', migrations.map(m => m.name));
        } else {
            console.log('Database connection already initialized');
        }
        return true;
    } catch (error) {
        console.error('Database connection error:', error);
        return false;
    }
}

declare global {
    namespace NodeJS {
        interface ProcessEnv {
            PORT: string;
            JWT_SECRET: string;
            HOST_EMAIL: string;
            PORT_EMAIL: string;
            USER_EMAIL: string;
            PASS_EMAIL: string;
            DB_HOST: string;
            DB_USER: string;
            DB_PASS: string;
            DB_NAME: string;
            DB_PORT: string;
            KEY_ID: string;
            APP_KEY: string;
            ENDPOINT_S3: string;
            SUPABASE_BUCKET: string;
            SUPABASE_URL: string;
        }
    }
}
