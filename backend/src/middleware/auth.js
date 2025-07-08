
import { StatusCodes } from 'http-status-codes';
import { verifyToken } from '../utils/jwt.js';



const authMiddleware = async (req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Unauthorized, No token provided' });

  const userData = verifyToken(token);
  if (!userData) return res.status(StatusCodes.UNAUTHORIZED).json({ success: false, message: 'Invalid token' });

  req.user = userData;
  next();
};

export { authMiddleware };