import cors from 'cors';

export const corsOptions = {
  origin: [
    'https://sale-point-app.vercel.app',   // App hospedado no Vercel
    'http://localhost:3000'                 // Localhost para desenvolvimento
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,                       // Permite enviar cookies entre domínios
  optionsSuccessStatus: 204
}

export const corsMiddleware = cors(corsOptions);
