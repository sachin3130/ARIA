const express = require('express')
const router = express.Router();
const passport = require('passport');
const userController = require('../controllers/user');

router.get('/profile',userController.getProfile);

router.get('/playlists',userController.getPlaylists);
router.post('/createPlaylist',userController.createPlaylist);

router.get('/savedTracks',userController.getSavedTracks);
router.get('/searchedTracks',userController.getSearchedTracks);
router.get('/exploredTracks',userController.getExploredTracks);
router.delete('/removeSavedTrack', userController.removeSavedTrack);
router.delete('/removeTrackFromPlaylist', userController.removePlaylistTrack);

router.get('/:playlistId',userController.getPlaylist);
router.delete('/:playlistId',userController.removePlaylist);

router.put('/profile',userController.editProfile);
router.post('/addTrackToPlaylist',userController.addTrackToPlaylist);
router.post('/saveTrack',userController.saveTrack);
router.post('/searchedTracks', userController.addToSearchedTracks);
router.post('/exploredTracks',userController.addToExploredTracks);
module.exports = router;