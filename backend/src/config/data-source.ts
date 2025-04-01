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
    ssl: {
        rejectUnauthorized: false
    },
    extra: {
        max: 10, // Ajuste para 10 conexões simultâneas no pool
        connectionTimeoutMillis: 5000, // 5 segundos
        query_timeout: 5000, // 5 segundos
        statement_timeout: 5000, // 5 segundos
        idle_in_transaction_session_timeout: 5000,
        ssl: true,
        application_name: 'sale-point-api', // Ajuda no monitoramento
        keepalive: true, // Mantém conexão viva
        keepaliveInitialDelayMillis: 1000, // Aumento do delay inicial para 1s
        region: 'sa-east-1',
        tcp_keepalive: true,
        tcp_keepalive_idle: 60, // Aumentado para 60 segundos
        tcp_keepalive_interval: 30, // Aumento do intervalo para 30 segundos
        tcp_keepalive_count: 5 // Aumento do count para 5 tentativas
    },
    poolSize: 10, // Aumentado o pool de conexões
    connectTimeoutMS: 5000, // Aumentado o tempo de conexão para 5 segundos
    maxQueryExecutionTime: 5000, // Aumentado para 5 segundos
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
            for (let attempt = 1; attempt <= 3; attempt++) { // Aumentando tentativas
                try {
                    await Promise.race([
                        connectionInstance.initialize(),
                        new Promise((_, reject) => 
                            setTimeout(() => reject(new Error('Connection timeout')), 5000) // Aumento do tempo de timeout para 5 segundos
                        )
                    ]);
                    break;
                } catch (error) {
                    if (attempt === 3) throw error; // Tentativa final
                    await new Promise(resolve => setTimeout(resolve, 1000)); // Espera 1s antes do retry
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
                setTimeout(() => reject(new Error('Health check timeout')), 5000) // Aumento para 5 segundos
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
