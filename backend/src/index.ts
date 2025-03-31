import 'dotenv/config'
import 'reflect-metadata'; 
import express from 'express';
import morgan from 'morgan'; 
import { AppDataSource, testConnection } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

const app = express();

// Configuração do CORS
app.use(corsMiddleware);

app.use(express.json());
app.use(morgan('dev'));

// Rota de teste
app.get('/', (req, res) => {
    res.json({ message: 'API is running!' });
});

// Rotas
app.use(routes);

// Middleware de erro (mantém por último)
app.use(errorMiddleware);

// Inicializa o banco de dados
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

// Middleware para verificar conexão com o banco
app.use(async (req, res, next) => {
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