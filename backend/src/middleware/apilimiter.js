import rateLimit from "express-rate-limit";
import { StatusCodes } from "http-status-codes";

export const apilimiterMiddleware = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 50,
  message: {
    status: StatusCodes.TOO_MANY_REQUESTS,
    error: "Too many requests, please try again in 15 minutes."
  },
  delayMs: 0,
});

