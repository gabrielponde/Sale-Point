import cors from 'cors'

export const corsOptions = {
  origin: [
    'http://localhost:3000',
    'https://sale-point-system.vercel.app',
    'https://sale-point-system.vercel.app/',
    'https://sale-point-system.vercel.app/api',
    'https://sale-point-system.vercel.app/api/',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
}

export const corsMiddleware = cors(corsOptions) 