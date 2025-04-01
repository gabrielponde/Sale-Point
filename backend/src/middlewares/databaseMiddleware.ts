import { Request, Response, NextFunction } from 'express';
import { testConnection } from '../config/data-source';

let isInitialized = false; // Flag para saber se a conexão foi estabelecida
let initializationPromise: Promise<boolean> | null = null; // Promise que armazena a tentativa de conexão

// Função para inicializar o banco de dados uma vez
async function initializeDatabase(): Promise<boolean> {
    try {
        console.log('Starting database initialization...');
        const success = await testConnection();
        if (!success) {
            console.error('Failed to connect to the database');
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

// Middleware para garantir que o banco esteja disponível antes de processar a requisição
export const databaseMiddleware = async (req: Request, res: Response, next: NextFunction) => {
    // Se a conexão ainda não foi inicializada
    if (!isInitialized) {
        // Caso haja uma promessa de inicialização pendente, aguarda ela
        if (!initializationPromise) {
            initializationPromise = initializeDatabase();
        }

        try {
            // Aguarda a promessa de inicialização
            const success = await initializationPromise;
            if (!success) {
                return res.status(503).json({ 
                    error: 'Service temporarily unavailable',
                    message: 'Database connection failed'
                });
            }
        } catch (error) {
            return res.status(503).json({ 
                error: 'Service temporarily unavailable',
                message: 'Database initialization failed'
            });
        }
    }
    // Chama o próximo middleware ou a rota
    next();
};
