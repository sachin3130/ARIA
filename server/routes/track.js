const express = require('express')
const router = express.Router();
const trackController = require('../controllers/track');

router.post('/getTrackLyrics',trackController.getLyrics);

module.exports = router;