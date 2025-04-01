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
    migrations: [path.join(__dirname, '..', '..', 'migrations', '*.{js,ts}')],
    migrationsTableName: 'migrations',
    synchronize: false,
    ssl: {
        rejectUnauthorized: false
    },
    // Configurações otimizadas para Supabase em ambiente serverless
    extra: {
        // Configuração do pool de conexões
        poolSize: 1, // Manter apenas uma conexão por instância
        connectionTimeoutMillis: 5000, // 5 segundos para timeout de conexão
        idleTimeoutMillis: 5000, // Fecha conexões ociosas após 5 segundos
        max: 1, // Máximo de conexões no pool
        ssl: true // Força SSL
    },
    connectTimeoutMS: 5000, // 5 segundos para timeout geral
    maxQueryExecutionTime: 5000, // Alerta para queries lentas
    cache: false, // Desativa cache em ambiente serverless
    logging: ["error", "warn", "info"], // Log mais detalhado
});

// Connection test function
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