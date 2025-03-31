import cors from 'cors'

export const corsOptions = {
  origin: true, // Permite todas as origens
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
  optionsSuccessStatus: 204
}

export const corsMiddleware = cors(corsOptions) 