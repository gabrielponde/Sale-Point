import 'reflect-metadata'; 
import express from 'express';
import cors from 'cors'; 
import morgan from 'morgan'; 
import { AppDataSource } from './data-source';
import routes from '../routes/app-routes';
import { errorMiddleware } from '../middlewares/errorMiddleware';

AppDataSource.initialize()
    .then(() => {
        const app = express();

        app.use(cors());
        app.use(express.json());

        app.use(morgan('dev')); 

        app.use(routes);
        app.use(errorMiddleware);

        app.listen(process.env.PORT, () => {
            console.log(`Server is running on port ${process.env.PORT}`);
        });
    })
    .catch(error => {
        console.error('Error during Data Source initialization:', error);
    });
