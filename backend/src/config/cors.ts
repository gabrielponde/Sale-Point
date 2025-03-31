import cors from 'cors'

export const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://sale-point-system.vercel.app',
    'https://sale-point-system.vercel.app/',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}

export const corsMiddleware = cors(corsOptions) 