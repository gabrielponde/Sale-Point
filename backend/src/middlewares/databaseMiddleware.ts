import { Request, Response, NextFunction } from 'express';
import { testConnection } from '../config/data-source';

let isInitialized = false;

async function initializeDatabase() {
    try {
        console.log('Starting database initialization...');
        const success = await testConnection();
        if (!success) {
            console.error('Failed to connect to database');
            return false;
        }
        isInitialized = true;
        console.log('Database initialization completed successfully');
        return true;
    } catch (error) {
        console.error('Error during database initialization:', error);
        return false;
    }
}

export const databaseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    if (!isInitialized) {
        const success = await initializeDatabase();
        if (!success) {
            return res.status(503).json({ 
                error: 'Service temporarily unavailable',
                message: 'Database connection failed'
            });
        }
    }
    next();
}; 