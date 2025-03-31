import cors from 'cors'

export const corsOptions = {
  origin: [
    'https://sale-point-app.vercel.app',
    'https://sale-point-app.vercel.app/',
    'http://localhost:3000',
    'http://localhost:3000/'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'Accept',
    'Origin',
    'X-Requested-With',
    'Access-Control-Allow-Origin',
    'Access-Control-Allow-Headers',
    'Access-Control-Allow-Methods',
    'Access-Control-Allow-Credentials'
  ],
  credentials: true,
  preflightContinue: false,
  maxAge: 86400, // 24 horas
  exposedHeaders: ['Content-Range', 'X-Content-Range'],
  optionsSuccessStatus: 204
}

export const corsMiddleware = cors(corsOptions) 