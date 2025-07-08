
import { StatusCodes } from "http-status-codes";

export const notFound = (req, res, next) => {
  res.status(StatusCodes.NOT_FOUND).json({
    success: false,
    message: `Not found - ${req.originalUrl}`,
  });
  next();
};

export default notFound;
