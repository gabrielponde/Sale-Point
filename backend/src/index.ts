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

// Conecta ao banco de dados
AppDataSource.initialize()
    .then(() => {
        console.log('Database connected successfully');
        
        // Configura as rotas após conectar ao banco
        app.use(routes);
        app.use(errorMiddleware);

        // Inicia o servidor apenas se não estiver rodando no Vercel
        if (process.env.NODE_ENV !== 'production') {
            const port = process.env.PORT || 3333;
            app.listen(port, () => {
                console.log(`Server is running on port ${port}`);
            });
        }
    })
    .catch(error => {
        console.error('Error connecting to database:', error);
        process.exit(1);
    });

// Exporta o app para o Vercel
export default app; 