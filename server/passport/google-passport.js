const GoogleStrategy = require('passport-google-oauth20');
const passport = require('passport');
const {User} = require('../models/User');
const jwt = require('jsonwebtoken')
const secret = 'asdfe45we45w345wegw345werjktjwertkj';
require("dotenv").config();

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID, 
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
            scope: ["profile","email"]
        },
        async (accessToken, refreshToken, profile, done) => {
            // try {
                // console.log(profile);
                // console.log("details are below : ");
                // console.log(profile.emails[0].value);
                // console.log(profile.displayName);
                    //     user = new User({
                    //     userid:profile.emails[0].value,
                    //     fullname:profile.displayName,
                    //     password:'',
                    // })
                    // await user.save();
                // req.session = {
                    // email: profile.emails[0].value,
                    // displayName: profile.displayName
                // };
                // }catch(err){
                        // console.log("Inside google  stretegy error block !", err);
                        // return done(err, null);
            // }
            try{
            let user = await User.findOne({userid: profile.emails[0].value});
                if(!user){
                    user = new User({
                        userid:profile.emails[0].value,
                        fullname:profile.displayName,
                        password:'',
                    })
                    await user.save();
                }
                // const payload = {
                //     _id: user._id,
                //     userId: user.userId,
                //     fullname: user.fullName,
                // }
                
            //     // Generate JWT token with 1-hour expiration
            // const token = jwt.sign(payload, secret, { expiresIn: '1h' });
            // // Setting maxAge to 3600000 milliseconds (1 hour)
            // res.cookie('token', token, { maxAge: 3600000, httpOnly: true });
            
            // req.user = payload;
            return done(null, user);
            }
            catch(error){
                return done(error,null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user);
});
passport.deserializeUser((user, done) => {
    done(null, user);
});

