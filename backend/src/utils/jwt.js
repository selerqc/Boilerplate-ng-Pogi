import jsonwebtoken from 'jsonwebtoken';
import config from './config.js';

const { JWT_SECRET, JWT_EXPIRATION, JWT_REFRESH_SECRET, JWT_REFRESH_EXPIRATION } = config;

const generateToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jsonwebtoken.sign(payload, JWT_SECRET, { expiresIn: JWT_EXPIRATION });
};

const verifyToken = (token) => {
  try {
    return jsonwebtoken.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

const generateRefreshToken = (user) => {
  const payload = { id: user.id, email: user.email };
  return jsonwebtoken.sign(payload, JWT_REFRESH_SECRET, { expiresIn: JWT_REFRESH_EXPIRATION });
};

export { generateToken, verifyToken, generateRefreshToken };