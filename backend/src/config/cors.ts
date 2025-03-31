import cors from 'cors'

export const corsOptions = {
  origin: [
    'https://sale-point-app.vercel.app',
    'http://localhost:3000'
  ],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}

export const corsMiddleware = cors(corsOptions) 