import express from 'express';
import securityController from '../controllers/securityController.js';
import passport from 'passport';

const router = express.Router();

router.get('/', (req, res) => {
  res.status(200).json({
    message: 'Security routes are working',
    status: 200,
  });
})
  .post('/login', passport.authenticate('local'), securityController.login)

  .get('/isLoggedIn', (req, res, next) => {
    return res.status(200).send(req.isAuthenticated());
  })
  .get('/logout', securityController.logout)
  .get('/forgotpassword', securityController.forgotPassword)
  .get('/validatePasswordResetToken/:token', securityController.isPasswordResetTokenValid)
  .post('/resetPassword', securityController.resetPassword)

export default router;