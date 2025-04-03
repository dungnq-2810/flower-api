import express, { Application } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import cors from 'cors';
import routes from './routes/v1';
import { errorMiddleware } from './middlewares/error.middleware';
import { connectDB } from './config/db';

class App {
  public app: Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeRoutes();
    this.initializeErrorHandling();
    this.initializeDatabase();
  }

  private initializeMiddlewares() {
    this.app.use(helmet());
    this.app.use(cors());
    this.app.use(morgan('dev'));
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
  }

  private initializeRoutes() {
    // Root route for API health check
    this.app.get('/', (req, res) => {
      res.json({ 
        status: 'success', 
        message: 'Flower Shop API is running',
        version: '1.0.0',
        timestamp: new Date().toISOString()
      });
    });
    
    this.app.use('/api/v1', routes);
  }

  private initializeErrorHandling() {
    this.app.use(errorMiddleware);
  }

  private initializeDatabase() {
    connectDB();
  }
}

export default new App().app;
