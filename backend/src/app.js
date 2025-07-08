import express from 'express';
import cors from 'cors';
import morgan from 'morgan';
import passport from 'passport';
import session from 'express-session';
import connectDB from './config/database.js';
import Route from './routes/index.js'
import notFound from './middleware/notFound.js';
import passportAuth from './authentication/passportAuth.js';
import { apilimiterMiddleware } from './middleware/apilimiter.js';
const app = express();


// Connect to database
connectDB();


passportAuth.initializePassport(passport);


app.use(morgan('dev'));
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Session middleware (required for Passport)
app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false
}));

app.use(apilimiterMiddleware);
app.use(passport.initialize());
app.use(passport.session());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));



app.use('/api/any', Route);

app.use(notFound);

export default app;