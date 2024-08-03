// GENERAL IMPORTS
const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser');
require("dotenv").config();
const passport = require('passport');
const bodyParser = require('body-parser');
const cors = require('cors');
const session = require('express-session');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const { authenticateUser } = require('./middleware/auth');

// importing routes and other files
const googlePassport = require('./passport/google-passport');
const facebookPassport = require('./passport/facebook-passport');
const authRoutes = require('./routes/auth');
const userRoutes = require('./routes/user');
const trackRoutes = require('./routes/track');
const authMiddleware = require('./middleware/auth');

// general app routes 
const app = express();
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(cookieParser());




app.post('/api/saveImage', (req, res) => {
    const { imageDataURL } = req.body;

    // Extract base64 data from data URL
    const base64Data = imageDataURL.replace(/^data:image\/jpeg;base64,/, '');

    // Generate unique filename (e.g., using current timestamp)
    const fileName = `image_${Date.now()}.jpeg`;

    // Save image data to the backend (server)
    fs.writeFile(path.join(__dirname, fileName), base64Data, 'base64', (err) => {
        if (err) {
            console.error('Error saving image:', err);
            res.status(500).send('Error saving image');
        } else {
            console.log('Image saved successfully.');
            res.status(200).send('Image saved successfully');
        }
    });
});





// making a session 
app.use(session({
    secret: "152fdhkq7irlpt0rjriouipq",
    resave: false,
    saveUninitialized: true,
}))
app.use(passport.initialize());
app.use(passport.session());
app.use(express.static('public'));

// defining destination for image storage
let USERID = "default";
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // const userId = req.user.userId; // Assuming userId is available in the request object
        const userDir = path.join(__dirname, `./public/${USERID}`);
        fs.mkdirSync(userDir, { recursive: true });
        cb(null, userDir); // Adjust the destination folder
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);    
    },
});
const upload = multer({storage: storage});
app.use(upload.single("image"));


// defining routes path
app.use('/auth',authRoutes);
app.use('/track',trackRoutes);
app.use(authenticateUser, userRoutes);

// connecting to database
const mongoURL = 'mongodb+srv://sachingarg:sachingarg@cluster0.tsnzw44.mongodb.net/shop?retryWrites=true&w=majority';
mongoose.connect(mongoURL)
    .then(() => {
        console.log("connected to database !");
    }).catch(err => {
        console.log("error occured while connecting to database !");
    })

app.listen(8080, () => {
    console.log('Server is running on port 3000');
});