import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import helmet from 'helmet';
import createError from 'http-errors';
import compression from 'compression';
import Route from './routes/index.js'
import notFound from './middleware/notFound.js';
import { errorMiddleware } from './middleware/errorHandler.js';
import passportAuth from './authentication/passportAuth.js';
import { apilimiterMiddleware } from './middleware/apilimiter.js';
import connectDB from './config/database.js';
const app = express();


// Connect to database
connectDB();


passportAuth.initializePassport(passport);


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(helmet())
app.use(morgan('dev'));
app.use(apilimiterMiddleware);
app.use(passport.initialize());
app.use(passport.session());
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

app.use('/api/any', Route);
app.get('/favicon.ico', (req, res) => { res.status(204).end(); });
app.use(function (req, res, next) {
  next(createError(404, 'Not Found'));
});

app.use(notFound);
app.use(errorMiddleware);

export default app;