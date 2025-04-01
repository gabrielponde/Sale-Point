import 'dotenv/config';
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { getConnection, checkConnection } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

const app = express();

// Middleware básico
app.use(corsMiddleware);
app.use(express.json());

// Morgan apenas em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', async (_, res) => {
    try {
        const isHealthy = await Promise.race([
            checkConnection(),
            new Promise<boolean>((resolve) => setTimeout(() => resolve(false), 3000))
        ]);
        
        if (isHealthy) {
            res.json({ status: 'healthy', database: 'connected' });
        } else {
            res.status(503).json({ status: 'unhealthy', database: 'disconnected' });
        }
    } catch (error: unknown) {
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(503).json({ status: 'error', message: errorMessage });
    }
});

// Rota de teste
app.get('/', (_, res) => {
    res.json({ message: 'API is running!' });
});

// Cache de conexão por 5 minutos
let connectionPromise: Promise<void> | null = null;
let lastConnectionTime = 0;
const CONNECTION_TTL = 5 * 60 * 1000; // 5 minutos

// Função para gerenciar conexão com cache
async function getConnectionWithCache(): Promise<void> {
    const now = Date.now();
    
    // Se tiver uma conexão em andamento, usa ela
    if (connectionPromise) {
        await connectionPromise;
        return;
    }
    
    // Se a última conexão foi há menos de 5 minutos, não precisa reconectar
    if (lastConnectionTime && (now - lastConnectionTime) < CONNECTION_TTL) {
        return;
    }
    
    // Cria nova promessa de conexão
    connectionPromise = Promise.race([
        getConnection().then(() => {
            lastConnectionTime = Date.now();
            connectionPromise = null;
        }),
        new Promise<void>((_, reject) => setTimeout(() => reject(new Error('Connection timeout')), 8000))
    ]) as Promise<void>;

    await connectionPromise;
}

// Middleware otimizado para conexão com banco
app.use(async (req, res, next) => {
    // Ignora a verificação de banco para OPTIONS e rotas públicas
    if (req.method === 'OPTIONS' || req.path === '/health' || req.path === '/') {
        return next();
    }

    try {
        await getConnectionWithCache();
        next();
    } catch (error: unknown) {
        console.error('Database connection error:', error);
        const errorMessage = error instanceof Error ? error.message : 'Unknown error';
        res.status(503).json({ 
            error: 'Service temporarily unavailable',
            message: 'Database connection failed',
            details: errorMessage
        });
    }
});

// Rotas da aplicação
app.use(routes);

// Middleware de erro
app.use(errorMiddleware);

// Tenta estabelecer conexão inicial
getConnectionWithCache()
    .then(() => console.log('Initial database connection established'))
    .catch(error => console.error('Initial database connection failed:', error));

// Exporta o app para o Vercel
export default app;

// Inicia o servidor em desenvolvimento
if (process.env.NODE_ENV !== 'production') {
    const port = process.env.PORT || 3333;
    app.listen(port, () => {
        console.log(`Server is running on port ${port}`);
    });
}