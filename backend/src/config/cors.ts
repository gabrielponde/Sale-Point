import cors from 'cors'

export const corsOptions = {
  origin: [
    'https://sale-point-app.vercel.app',
    'https://sale-point-app.vercel.app/',
    'https://sale-point-app.vercel.app/api',
    'https://sale-point-app.vercel.app/api/',
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept', 'Origin', 'X-Requested-With'],
  credentials: true,
  preflightContinue: false,
  maxAge: 86400, // 24 horas
}

export const corsMiddleware = cors(corsOptions) 