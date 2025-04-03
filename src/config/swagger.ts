import swaggerJSDoc from 'swagger-jsdoc';
import { version } from '../../package.json';

const options: swaggerJSDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Flower Seed E-commerce API',
      version,
      description: 'API Documentation for the Flower Seed E-commerce Platform',
      contact: {
        name: 'API Support',
        email: 'support@flowerseed.com',
        url: 'https://flowerseed.com/support',
      },
    },
    servers: [
      {
        url: '/api/v1',
        description: 'Development Server',
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
    // Global security definition - all endpoints will require auth
    // unless specified otherwise at the route level
    security: [
      {
        bearerAuth: [],
      },
    ],
  },
  // Path to the API docs with swagger annotations
  apis: ['./src/docs/*.ts', './src/routes/v1/*.ts'],
};

export const swaggerSpec = swaggerJSDoc(options);