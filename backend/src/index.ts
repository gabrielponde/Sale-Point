import 'dotenv/config';
import 'reflect-metadata'; 
import express from 'express';
import { AppDataSource } from './config/data-source';
import routes from './routes/app-routes';
import { errorMiddleware } from './middlewares/errorMiddleware';

// Initialize DB once
AppDataSource.initialize()
  .then(() => console.log('Database connected!'))
  .catch((error) => {
    console.error('Database connection failed:', error);
    process.exit(1);
  });

const app = express();

// Middleware
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://sale-point-app.vercel.app');
  res.setHeader('Access-Control-Allow-Methods', 'GET,POST,PUT,DELETE,PATCH,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  req.method === 'OPTIONS' ? res.sendStatus(200) : next();
});

app.use(express.json());

if (process.env.NODE_ENV !== 'production') {
  const morgan = require('morgan');
  app.use(morgan('dev'));
}

// Routes
app.get('/', (_: express.Request, res: express.Response, next: express.NextFunction) => {
  res.json({ message: 'API is running!' });
  res.end();
});
app.use(routes);
app.use(errorMiddleware);

export default app;

// Dev server
if (process.env.NODE_ENV !== 'production') {
  const port = process.env.PORT || 3333;
  app.listen(port, () => console.log(`Server is running on port ${port}`));
}