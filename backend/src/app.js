
import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import connectDB from './config/database.js';
import Route from './routes/index.js'
import notFound from './middleware/notFound.js';

import { apilimiterMiddleware } from './middleware/apilimiter.js';

const app = express();

// Connect to database
connectDB();

// Middleware
app.use(morgan('dev'));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(apilimiterMiddleware);

// Routes
app.use('/api/any', Route);

// Error handling middleware
app.use(notFound);




export default app;