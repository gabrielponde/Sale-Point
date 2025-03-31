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

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
    console.error(`Missing environment variable: ${envVar}`);
    throw new Error(`Missing environment variable: ${envVar}`);
  }
}

const port = parseInt(process.env.DB_PORT || '5432');

// Debug logs (remove in production if sensitive)
console.log('Initializing database connection with config:', {
  host: process.env.DB_HOST,
  port: port,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  ssl: true
});

// Define all entities
const entities = [User, Product, Order, OrderProduct, Client, Category];

// Log all entities being registered
console.log('Registering entities:', entities.map(e => e.name));

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  
  // Entity configuration
  entities: entities,
  
  migrations: [path.join(__dirname, '../migrations/*.{js,ts}')],
  migrationsTableName: 'migrations',
  
  // SSL configuration for Vercel
  ssl: true,
  extra: {
    ssl: {
      rejectUnauthorized: false
    }
  },
  
  // Performance optimizations
  synchronize: false,
  logging: true, // Habilitando logs para debug
  poolSize: 10,
  maxQueryExecutionTime: 1000,
  
  // PostgreSQL specific
  applicationName: 'salepoint',
  useUTC: true
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