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

// Log connection attempt
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
    ssl: {
        rejectUnauthorized: false
    },
    // Configurações otimizadas para melhor TTFB
    extra: {
        max: 20, // Máximo de conexões no pool
        connectionTimeoutMillis: 5000,
        idleTimeoutMillis: 30000, // Tempo que uma conexão pode ficar ociosa
        ssl: true
    },
    poolSize: 20, // Tamanho do pool
    connectTimeoutMS: 5000,
    cache: {
        duration: 1000 * 60 * 5 // Cache de 5 minutos
    },
    logging: false
});

// Função para obter conexão existente ou criar nova
export async function getConnection(): Promise<DataSource> {
    if (!connectionInstance) {
        connectionInstance = AppDataSource;
    }

    if (!connectionInstance.isInitialized) {
        await connectionInstance.initialize();
    }

    return connectionInstance;
}

// Função para verificar saúde da conexão
export async function checkConnection(): Promise<boolean> {
    try {
        const connection = await getConnection();
        await connection.query('SELECT 1'); // Query simples para testar conexão
        return true;
    } catch (error) {
        console.error('Database health check failed:', error);
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
      // Log migrations info
      console.log('Migrations directory:', path.join(__dirname, '..', '..', 'migrations'));
      const migrations = await AppDataSource.runMigrations();
      console.log('Migrations applied:', migrations.map(m => m.name));
    } else {
      console.log('Database connection already initialized');
    }
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
    if (error instanceof Error) {
      console.error('Error details:', {
        message: error.message,
        stack: error.stack,
        name: error.name
      });
    }
    return false;
  }
}

// For TypeScript projects, you might want to add:
declare global {
  namespace NodeJS {
    interface ProcessEnv {
      DB_HOST: string;
      DB_USER: string;
      DB_PASS: string;
      DB_NAME: string;
      DB_PORT: string;
      JWT_SECRET: string;
      // Add other environment variables you use
    }
  }
}