import UserModel from "../models/userModel";
import cryptoGen from '../authentication/cryptoGen.js';
import { StatusCodes } from 'http-status-codes';
import { ErrorHandler } from '../middleware/errorHandler.js';
import logger from "../../logs/logger.js";


export default {
  async forgotPassword(email) {
    try {
      const user = await UserModel.findOne({ email: email }).exec();
      const token = cryptoGen.generateRandomToken();

      if (!(user && token)) {
        logger.warn(`User not found or token generation failed for email:`, { meta: email });
        return next(new ErrorHandler('User not found or token generation failed', StatusCodes.NOT_FOUND));
      }

      user.passwordResetToken = token;
      user.passwordResetExpires = Date.now() + 3600000;
      user = await user.save();

      if (!user) {
        logger.warn(`Failed to save user with password reset token:`, { meta: user });
        return new ErrorHandler('Failed to save user with password reset token', StatusCodes.INTERNAL_SERVER_ERROR);
      }

      // Send password reset email
      // send email function
      return {
        message: 'Password reset email sent successfully',
        status: StatusCodes.OK,
        token: token
      }
    } catch (error) {
      logger.error(`Error in forgotPassword:`, { meta: error });
      next(error);
    }
  },

  async isPasswordResetTokenValid(token) {
    try {
      const user = await UserModel.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } }).exec();
      return user ? { message: 'Token is valid', status: StatusCodes.OK, isValid: true } : false
    } catch (error) {
      logger.error(`Error in isPasswordResetTokenValid:`, { meta: error });
      throw new ErrorHandler('Invalid token', StatusCodes.UNAUTHORIZED);

    }
  },

  async resetPassword(token, newPassword) {
    try {
      const user = await UserModel.findOne({ passwordResetToken: token, passwordResetExpires: { $gt: Date.now() } }).exec();

      if (!user) {
        logger.warn(`Invalid or expired token:`, { meta: token });
        throw new ErrorHandler('Invalid or expired token', StatusCodes.UNAUTHORIZED);
      }

      user.password = cryptoGen.createPasswordHash(newPassword);
      user.passwordResetToken = undefined;
      user.passwordResetExpires = undefined;
      user = await user.save();

      if (!user) {
        logger.warn(`Failed to save user with new password:`, { meta: user });
        throw new ErrorHandler('Failed to save user with new password', StatusCodes.INTERNAL_SERVER_ERROR);
      }

      //send email function to notify user of password change
      return { message: 'Password reset successfully', status: StatusCodes.OK };
    } catch (error) {
      logger.error(`Error in resetPassword:`, { meta: error });
      throw new ErrorHandler('Error resetting password', StatusCodes.INTERNAL_SERVER_ERROR);
    }
  },


}