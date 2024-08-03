const express = require('express')
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/auth');

router.post('/login',authController.login);
router.post('/signup',authController.signup);

// login using google
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'] }));
router.get('/google/callback', passport.authenticate('google', {
    // successRedirect: process.env.CLIENT_URL,
    failureRedirect: "http://localhost:3000"
}),authController.googleLogin);

// login using facebook
router.get('/facebook', passport.authenticate('facebook', { scope: ['email'] }));
router.get('/facebook/callback', passport.authenticate('facebook', {
    failureRedirect: 'http://localhost:3000',
    successRedirect: process.env.CLIENT_URL,
}));
module.exports = router;