import 'reflect-metadata';
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import swaggerUi from 'swagger-ui-express';
import swaggerJsdoc from 'swagger-jsdoc';
import { initializeDatabase } from './data-source';
import authRoutes from './routes/auth';
import progressRoutes from './routes/progress';
import leaderboardRoutes from './routes/leaderboard';
import subscriptionRoutes from './routes/subscription';
import webhookRoutes from './routes/webhook';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());

// Save raw body for webhook verification
app.use(express.json({
  verify: (req: any, res, buf) => {
    if (req.originalUrl.startsWith('/webhook')) {
      req.rawBody = buf.toString();
    }
  }
}));

// Swagger setup
const swaggerOptions = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'GanitQuest API',
      version: '1.0.0',
      description: 'Backend API for GanitQuest - Gamified Mathematics Learning Platform',
    },
    servers: [
      {
        url: `http://localhost:${PORT}`,
        description: 'Development server',
      },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'],
};

const swaggerSpec = swaggerJsdoc(swaggerOptions);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Initialize database and start server
const startServer = async () => {
  try {
    await initializeDatabase();
    
    app.use('/auth', authRoutes);
    app.use('/progress', progressRoutes);
    app.use('/leaderboard', leaderboardRoutes);
    app.use('/subscription', subscriptionRoutes);
    app.use('/webhook', webhookRoutes);

    app.get('/health', (req, res) => {
      res.json({ status: 'ok', message: 'Server is running', orm: 'TypeORM' });
    });

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
      console.log(`Swagger docs available at http://localhost:${PORT}/api-docs`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
