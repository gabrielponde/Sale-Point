import 'dotenv/config';
import 'reflect-metadata';
import { DataSource } from 'typeorm';
import path from 'path';
import { User } from '../models/User';

// Validate required environment variables
const requiredEnvVars = ['DB_HOST', 'DB_USER', 'DB_PASS', 'DB_NAME', 'DB_PORT'];

for (const envVar of requiredEnvVars) {
  if (!process.env[envVar]) {
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

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: port,
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  
  // Entity configuration - both explicit and glob pattern
  entities: [
    User, // Explicit reference
    path.join(__dirname, '../models/**/*.entity.{js,ts}') // Glob pattern
  ],
  
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
  logging: process.env.NODE_ENV !== 'production',
  poolSize: 10,
  maxQueryExecutionTime: 1000,
  
  // PostgreSQL specific
  applicationName: 'salepoint',
  useUTC: true
});

// Connection test function
export async function testConnection() {
  try {
    await AppDataSource.initialize();
    console.log('Database connected successfully');
    console.log('Registered entities:', 
      AppDataSource.entityMetadatas.map(m => m.name));
    return true;
  } catch (error) {
    console.error('Database connection error:', error);
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