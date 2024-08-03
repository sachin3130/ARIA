const {User} = require('../models/User');
const bcrypt = require('bcrypt');
const salt = bcrypt.genSaltSync(10);
const jwt = require('jsonwebtoken')
const secret = 'asdfe45we45w345wegw345werjktjwertkj';
const {generateToken} = require('../middleware/auth');

// handling the login route 
exports.login = async (req, res, next) => {
    try {
        const { userid, password } = req.body;
        if(!userid){
            return res.status(400).json({ type: "Whoopsie! Looks like you forgot something.", message: " We're missing mobile number or email"});
        }
        // console.log(userid+"  "+password);
        const user = await User.findOne({ userid: userid });
        if (!user) {
            return res.status(401).json({ type: "Uh-oh! Credentials mismatch.", message: "UserId not found !"});
        }
        if (!bcrypt.compareSync(password, user.password)) {
            return res.status(401).json({ type: "Uh-oh! Credentials mismatch.", message: "Incorrect password"});
          }

        const payload = {
            _id: user._id,
            userid: user.userid,
            fullname: user.fullname,
        }

        const token = generateToken(payload);
        res.status(200).json({type: "Hooray!",  message: "Login successful!", user: user, session_token: token });
        
        // const expirationTime = 3600; 
        // let session_token;
        // jwt.sign(payload, secret, {expiresIn: expirationTime}, (err, token) => {
        //     if (err) {
        //         return res.status(500).json({ error: 'Internal server error' });
        //     }
        //     session_token = token;
        //     // res.cookie('session-token', token, { httpOnly: true, maxAge: expirationTime * 1000 })
        //     req.user = payload;
        //     res.status(200).json({type: "Hooray!",  message: "Login successful!", user: user, session_token: session_token });
        // });
    } catch (err) {
        console.log("inside login api ", err);
        res.status(500).json({type:"Oh no, gremlins in the server!",  message: "We're chasing them away. Please try again soon!"});
    }
}

// handling the singup route 
function isValidUserId(value) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const mobilePattern = /^[0-9]{10}$/;
    return emailPattern.test(value) || mobilePattern.test(value);
}  
exports.signup = async (req, res, next) => {
    try {
        // console.log(req);
        const { userid, fullname, password } = req.body;
        if(!userid){
            return res.status(400).json({type: "Whoopsie! Looks like you forgot something.", message: " We're missing mobile number or email"});
        }
        if(!isValidUserId(userid)){
            return res.status(400).json({type: "Oops, this needs a little sparkle!", message: "Invalid mobile number or email formate"});
        }
        if(!fullname || fullname.trim() === ""){
            return res.status(400).json({type: "Whoopsie! Looks like you forgot something.", message: " We're missing your full name"})
        }
        if (!password || password.length < 6) {
            return res.status(400).json({type: "Oops, this needs a little sparkle!",  message: "Password must be at least 6 characters"});
        }

        const existingUser = await User.findOne({ userid: userid });
        if (existingUser) {
        return res.status(400).json({type: "Oops, Account Exists!" , message: "Mobile number or email already exists."});
        }
        const user = new User({
            userid,
            fullname,
            password: bcrypt.hashSync(password,salt),
        });
        const savedUser = await user.save();

        const payload = {
            _id: user._id,
            userid: user.userid,
            fullname: user.fullname,
        }
        const token = generateToken(payload);
        // console.log(token);
        res.status(200).json({type: "Hooray!",  message: "Submission successful!", session_token: token});
        // const expirationTime = 3600; 
        // let session_token;

        // jwt.sign(payload, secret, {expiresIn: expirationTime}, (err, token) => {
        //     if (err) {
        //         return res.status(500).json({ error: 'Internal server error' });
        //     }
        //     session_token = token;
        //     // console.log("before  "+token);
        //     // res.cookie('session-token', token, { httpOnly: true, maxAge: expirationTime * 1000 })
        //     // console.log("after  "+token);
        //     req.user = payload;
        //     res.status(200).json({type: "Hooray!",  message: "Submission successful!", statusText: "nayan" });
        // });
    } catch (err) {
        // we came to this catch when we get error inside try block
        // even if we send any data in json, that will not a error block but data block 
        // data object that we handle in .then can be passed both from try and catch
        console.log("inside signup api", err);
        res.status(500).json({type:"Oh no, gremlins in the server!",  message: "We're chasing them away. Please try again soon!" });
    }
}

exports.googleLogin = async(req, res, next) => {
    try{   
        const user = req.user;
        if(user){
            const payload = {
                _id: req.user._id,
                userid: req.user.userid,
                fullname: req.user.fullname,
            }
            const token = generateToken(payload);
            // console.log(token);
            const currentTime = new Date();
            const expiryTime = new Date(currentTime.getTime() + 60 * 60 * 1000);
            res.cookie('session-token', JSON.stringify({ value : token , expiryTime : expiryTime.getTime() }), {
                expires : expiryTime,
            }).redirect(process.env.CLIENT_URL);
        }
    }catch(err){
        console.log(err);
        res.redirect(process.env.CLIENT_URL);
    }

    // const payload = {
    //     _id: req.user._id,
    //     userid: req.user.userid,
    //     fullname: req.user.fullname,
    // }
    // // console.log("req.user = "+payload.userid+", "+payload.fullname);

    
    
    // const expireTime = 3600; 
    // const expirationTime = new Date(new Date().getTime() + 20 * 1000); 
    // const currentTime = new Date().getTime();
    // const expirationTime2 = new Date(currentTime + 20000); 
    // jwt.sign(payload, secret, {expiresIn: expireTime}, (err, token) => {
    //     if (err) {
    //         console.error('Error signing JWT token:', err);
    //         // return res.status(500).json({ error: 'Internal server error' });
    //         res.redirect(process.env.CLIENT_URL);
    //     }
    //     res.cookie('session-token', token, { httpOnly: true, expires: expirationTime });
    //     res.cookie('session-token-expiration', expirationTime2.getTime());
    //     res.redirect(process.env.CLIENT_URL);
    // });
        
        // console.log(req.cookies['session-token']);
}