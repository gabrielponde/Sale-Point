import cors from 'cors'

export const corsOptions = {
  origin: function (origin: string | undefined, callback: (error: Error | null, allow?: boolean) => void) {
    const allowedOrigins = [
      'https://sale-point-app.vercel.app',
      'http://localhost:3000'
    ];
    
    // Permite requisições sem origem (como mobile apps ou curl)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Accept-Version', 'Content-Length', 'Content-MD5', 'Date', 'X-Api-Version'],
  credentials: true,
  optionsSuccessStatus: 204,
  preflightContinue: false
}

export const corsMiddleware = cors(corsOptions) 