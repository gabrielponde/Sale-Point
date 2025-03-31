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
    res.setTimeout(30000, () => {
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
            console.log('Attempting to connect to database...');
            console.log('Database configuration:', {
                host: process.env.DB_HOST,
                port: process.env.DB_PORT,
                database: process.env.DB_NAME,
                user: process.env.DB_USER
            });
            await AppDataSource.initialize();
            console.log('Database connected successfully');
            console.log('Registered entities:', 
                AppDataSource.entityMetadatas.map(m => m.name));
        }
        next();
    } catch (error) {
        console.error('Database connection error:', error);
        res.status(503).json({ 
            error: 'Service temporarily unavailable',
            message: 'Database connection failed'
        });
    }
};

app.use(dbMiddleware);

// Rotas
app.use(routes);

// Middleware de erro (mantém por último)
app.use(errorMiddleware);

// Exporta o app para o Vercel
export default app;

// Inicia o servidor apenas se não estiver rodando no Vercel
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
} 