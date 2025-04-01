import 'dotenv/config'
import 'reflect-metadata'; 
import express, { Request, Response, NextFunction, RequestHandler } from 'express';
import morgan from 'morgan'; 
import { AppDataSource } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

// Log das variáveis de ambiente (remover em produção)
console.log('Environment variables:', {
    DB_HOST: process.env.DB_HOST,
    DB_PORT: process.env.DB_PORT,
    DB_NAME: process.env.DB_NAME,
    DB_USER: process.env.DB_USER,
    NODE_ENV: process.env.NODE_ENV
});

const app = express();

// Configuração do CORS
app.use(corsMiddleware);

// Configuração do timeout
app.use((req, res, next) => {
    res.setTimeout(15000, () => {
        res.status(504).json({ 
            error: 'Gateway Timeout',
            message: 'Request took too long to process'
        });
    });
    next();
});

app.use(express.json());
app.use(morgan('dev'));

// Rota de teste
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running!' });
});

// Middleware para garantir que o banco está conectado
const dbMiddleware: RequestHandler = async (req, res, next) => {
    try {
        if (!AppDataSource.isInitialized) {
            console.log('[Database] Attempting to initialize connection...');
            await AppDataSource.initialize();
            console.log('[Database] Connection initialized successfully');
        }
        next();
    } catch (error) {
        console.error('[Database] Connection error:', error);
        if (error instanceof Error) {
            console.error('[Database] Error details:', {
                message: error.message,
                name: error.name,
                stack: error.stack
            });
        }
        res.status(503).json({ 
            error: 'Service temporarily unavailable',
            message: 'Database connection failed',
            details: error instanceof Error ? error.message : 'Unknown error'
        });
    }
};

// Função para tentar estabelecer a conexão inicial
async function initializeDatabase() {
    let retries = 5;
    while (retries > 0) {
        try {
            console.log(`[Database] Attempting to connect... (${retries} retries left)`);
            await AppDataSource.initialize();
            console.log('[Database] Initial connection successful');
            return true;
        } catch (error) {
            console.error(`[Database] Connection attempt failed (${retries} retries left):`, error);
            retries--;
            if (retries > 0) {
                console.log('[Database] Waiting 2 seconds before retrying...');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }
    return false;
}

// Inicializa o banco e configura as rotas
initializeDatabase().then(success => {
    if (success) {
        console.log('[Server] Database initialized, setting up routes...');
        app.use(dbMiddleware);
        app.use(routes);
        app.use(errorMiddleware);
        console.log('[Server] Routes configured successfully');
    } else {
        console.error('[Server] Failed to initialize database after all retries');
    }
}).catch(error => {
    console.error('[Server] Fatal error during initialization:', error);
});

// Exporta o app para o Vercel
export default app;

// Inicia o servidor apenas se não estiver rodando no Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} 