const FacebookStrategy = require('passport-facebook').Strategy; 
const passport = require('passport');
require("dotenv").config();

// FACEBOOK
passport.use(new FacebookStrategy({
    clientID: process.env.FACEBOOK_CLIENT_APP_ID,
    clientSecret: process.env.FACEBOOK_CLIENT_SECRET,
    callbackURL: "http://localhost:8080/auth/facebook/callback",
    profileFields: ['id', 'displayName', 'name', 'picture.type(large)', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    // Find or create user in your database based on Facebook profile
    console.log(profile);
    return cb(null, profile);
  }
));

passport.serializeUser(function(user, done) {
    done(null, user);
})

passport.deserializeUser(function(id, done) {
    return done(null, id);
})