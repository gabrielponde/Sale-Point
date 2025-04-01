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

// Configuração otimizada para ambiente serverless
export const AppDataSource = new DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: port,
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User, Product, Order, OrderProduct, Client, Category],
    synchronize: false,
    ssl: true,
    extra: {
        max: 1,
        connectionTimeoutMillis: 2000, // 2 segundos
        query_timeout: 3000, // 3 segundos
        statement_timeout: 3000,
        idle_in_transaction_session_timeout: 3000,
        ssl: {
            rejectUnauthorized: false
        },
        application_name: 'sale-point-api', // Ajuda no monitoramento
        keepalive: true, // Mantém conexão viva
        keepaliveInitialDelayMillis: 500, // Reduzido para 500ms
        // Configurações específicas para região SA
        region: 'sa-east-1',
        // Otimizações para conexões de longa distância
        tcp_keepalive: true,
        tcp_keepalive_idle: 30, // Reduzido para 30s
        tcp_keepalive_interval: 10,
        tcp_keepalive_count: 3
    },
    poolSize: 1,
    connectTimeoutMS: 2000,
    maxQueryExecutionTime: 3000,
    cache: false,
    logging: false
});

// Função para obter conexão existente ou criar nova com retry
export async function getConnection(): Promise<DataSource> {
    try {
        if (!connectionInstance) {
            connectionInstance = AppDataSource;
        }

        if (!connectionInstance.isInitialized) {
            // Tenta inicializar com retry
            for (let attempt = 1; attempt <= 2; attempt++) {
                try {
                    await Promise.race([
                        connectionInstance.initialize(),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Connection timeout')), 2000)
                        )
                    ]);
                    break;
                } catch (error) {
                    if (attempt === 2) throw error;
                    await new Promise(resolve => setTimeout(resolve, 500)); // Espera 500ms antes do retry
                }
            }
        }

        return connectionInstance;
    } catch (error) {
        console.error('Connection error:', error);
        connectionInstance = null;
        throw error;
    }
}

// Função para verificar saúde da conexão
export async function checkConnection(): Promise<boolean> {
    try {
        const connection = await getConnection();
        await Promise.race([
            connection.query('SELECT 1'),
            new Promise((_, reject) => 
                setTimeout(() => reject(new Error('Health check timeout')), 2000)
            )
        ]);
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