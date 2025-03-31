import 'dotenv/config'
import 'reflect-metadata'; 
import express, { Request, Response } from 'express';
import morgan from 'morgan'; 
import { AppDataSource } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';
import { corsMiddleware } from './config/cors';

const app = express();

// Configuração do CORS
app.use(corsMiddleware);

app.use(express.json());
app.use(morgan('dev'));

// Rota de teste
app.get('/', (req: Request, res: Response) => {
    res.json({ message: 'API is running!' });
});

// Inicializa o banco de dados
const initializeDatabase = async () => {
    try {
        if (!AppDataSource.isInitialized) {
            await AppDataSource.initialize();
            console.log('Database connected successfully');
            console.log('Registered entities:', 
                AppDataSource.entityMetadatas.map(m => m.name));
        }
    } catch (error) {
        console.error('Error during Data Source initialization:', error);
        process.exit(1); // Encerra o processo se não conseguir conectar ao banco
    }
};

// Inicializa o banco de dados antes de configurar as rotas
initializeDatabase().then(() => {
    // Rotas
    app.use(routes);

    // Middleware de erro (mantém por último)
    app.use(errorMiddleware);

    // Inicia o servidor apenas se não estiver rodando no Vercel
    if (process.env.NODE_ENV !== 'production') {
        const port = process.env.PORT || 3333;
        app.listen(port, () => {
            console.log(`Server is running on port ${port}`);
        });
    }
});

// Exporta o app para o Vercel
export default app; 