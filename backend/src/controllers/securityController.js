import securityService from "../services/securityService";
import { StatusCodes } from "http-status-codes";
import { ErrorHandler } from "../middleware/errorHandler";
import logger from "../../logs/logger";

export default {
  async forgotPassword(req, res, next) {
    try {
      const { email } = req.body;
      const response = await securityService.forgotPassword(email);
      res.status(response.status).json(response);
    } catch (error) {
      logger.error(`Error in forgotPassword:`, { meta: error });
      next(error);
    }
  },
  async isPasswordResetTokenValid(req, res, next) {
    try {
      const { token } = req.params;
      const response = await securityService.isPasswordResetTokenValid(token);
      res.status(response.status).json(response);
    } catch (error) {
      logger.error(`Error in isPasswordResetTokenValid:`, { meta: error });
      next(error);
    }
  },

  async resetPassword(req, res, next) {
    try {
      const { token } = req.params;
      const { newPassword } = req.body;
      const response = await securityService.resetPassword(token, newPassword);
      res.status(response.status).json(response);
    } catch (error) {
      logger.error(`Error in resetPassword:`, { meta: error });
      next(error);
    }
  },
  login(req, res, next) {
    let temp = req.session.passport;
    res.session.regenerate((err) => {
      req.session.passport = temp;
      req.session.save((err) => {
        res.status(StatusCodes.OK).json({
          email: req.user.email,
          name: req.user.name,
          permissions: req.user.permissions
        });
      });
    });
  },

  logout(req, res, next) {
    req.logout();
    if (req.session) {
      req.session.destroy((err) => {
        if (err) {
          return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("server error - could not log out");
        }
        return res.status(StatusCodes.OK).send("logged out successfully");
      });
    } else {
      if (req.isUnauthenticated()) {
        return res.status(StatusCodes.OK).send("logged out successfully");
      } else {
        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).send("server error - could not log out");
      }
    }
  }
};