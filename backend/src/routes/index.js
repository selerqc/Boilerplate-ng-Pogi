// import UserRoute from './user.routes.js';
// import AuthRoute from './auth.routes.js';

import logger from '../../logs/logger.js';
import express from 'express';
const router = express.Router();
import { StatusCodes } from 'http-status-codes';

router.get('/', (req, res) => {
  logger.info('GET / endpoint hit');
  res.status(StatusCodes.OK).json({
    message: 'Welcome to the Test',
    status: StatusCodes.OK,
  });
});

router.get('/health', (req, res) => {
  logger.info('GET /health endpoint hit');
  res.status(StatusCodes.OK).json({
    status: 'ok',
  });
});

// router.use('/users', UserRoute);
// router.use('/products', ProductRoute);


export default router