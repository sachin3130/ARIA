const musixmatchApi = require('../config/axios.config');

exports.getLyrics = async(req, res, next) => {
    const { trackName, artistName, isrc } = req.body;
    try{
        const { message: { body: { lyrics } } } = await musixmatchApi('matcher.lyrics.get?', {
            q_track: trackName.toLowerCase(),
            q_artist: artistName.toLowerCase(),
            track_isrc: isrc
        });
        res.status(200).json({message: "Lyrics fetched!", lyrics: lyrics.lyrics_body});
    } catch(error){
        console.log(error);
        res.status(500).json({message: "Server error"});
    }
}