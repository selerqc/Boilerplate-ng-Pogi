import { Strategy as LocalStrategy } from 'passport-local';
import bCrypt from 'bcrypt';
import logger from '../../logs/logger.js';
import UserModel from '../models/userModel.js';
import { StatusCodes } from 'http-status-codes'

const checkPermissions = (req, res, validPermission, done) => {
    const found = req.user.permissions.some(permission => validPermission.includes(permission));
    if (found) {
        done();
    } else {
        logger.verbose(`User ${req.user.username} attempted unauthorized access to ${req.originalUrl}`);
        res.status(StatusCodes.FORBIDDEN).json({ message: 'Forbidden' });
    }
}


export default {
    initializePassport(passport) {
        passport.serializeUser((user, done) => {
            done(null, user._id);
        });
        passport.deserializeUser(async (id, done) => {
            UserModel.findById(id, (err, user) => {
                if (err) {
                    logger.error(`Error deserializing user: ${err}`);
                    return done(err);
                }
                if (!user) {
                    logger.warn(`User not found for ID: ${id}`);
                    return done(null, false);
                }
                done(null, user);
            });
        });

        passport.use('login', new LocalStrategy({
            usernameField: 'email',
            passwordField: 'password'
        },
            function (email, password, done) {
                UserModel.findOne({ email: email }, (err, user) => {
                    if (err) {
                        return done(err);
                    }
                    if (!user) {
                        logger.verbose(`User not found with email: ${email}`, { meta: { email } });
                        return done(null, false, { message: 'User not found' });
                    }
                    if (!isValidPassword(user, password)) {
                        logger.verbose(`Invalid password for user: ${email}`, { meta: { email } });
                        return done(null, false, { message: 'Invalid password' });
                    }
                    if (!user.approved) {
                        logger.verbose("Account not approved for access")
                        return done(null, false);
                    }
                    logger.info(`User ${user.username} logged in successfully`);
                    return done(null, user);
                });
            }
        )
        )
        var isValidPassword = (user, password) => {
            return bCrypt.compare(password, user.password)
        }
    },

    isAuthenticated(req, res, done) {
        if (req.isAuthenticated()) {
            return done();
        } else {
            return res.status(StatusCodes.UNAUTHORIZED).json({ message: 'Unauthorized' });
        }
    },

    isAdmin(req, res, done) {
        return checkPermissions(req, res, ['Admin'], done);
    }
    //Permissions for other roles can be added here

}