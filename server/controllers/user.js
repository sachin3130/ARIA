const { User } = require('../models/User');

exports.createPlaylist = async(req, res, next) => {
    const _id = req.user._id;
    const {name } = req.body;
    const image = req.file ? req.file.filename : '';
    try{
        const user = await User.findOne({_id:_id});
        // console.log(user);
        // console.log(name+", "+image);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        if (!user.playlists) {
            user.playlists = [];
        }
        const playlists = user.playlists;
        const updatedPlaylists = [...playlists];
        const newPlaylist = {
            playlist: {
                name: name,
                image: image,
                items: [] 
            }
        };
        updatedPlaylists.push(newPlaylist);
        user.playlists = updatedPlaylists;
        await user.save();
        return res.status(200).json({message: "Playlist created", playlist: user.playlists[user.playlists.length - 1]});
    } catch(error){
        console.log("inside catch of playlist creation !", error);
        res.status(500).json({ message: "Playlist creation failed !" });
    }
}
exports.getPlaylist = async(req, res, next) => {
    const _id = req.user._id;
    const { playlistId } = req.params;
    try{
        const user = await User.findOne({_id:_id});
        // console.log(user);
        // console.log(name+", "+image);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        const [playlist] = user.playlists.filter(playlist => playlist._id.toString() === playlistId.toString());
        if(!playlist){
            return res.status(404).json({message: 'Playlist not found!'});
        }
        return res.status(200).json({message: "Playlists fetched",playlist: playlist});
    } catch(error){
        console.log("inside catch of playlist fetched !", error);
        res.status(500).json({ message: "Playlist fetched failed !" });
    }
}
exports.getPlaylists = async(req, res, next) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id:_id});
        // console.log(user);
        // console.log(name+", "+image);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        const playlists = user.playlists;
        playlists.reverse();
        return res.status(200).json({message: "Playlists fetched",playlists: playlists});
    } catch(error){
        console.log("inside catch of playlists fetched !", error);
        res.status(500).json({ message: "Playlists fetched failed !" });
    }
}
exports.removePlaylist = async(req, res, next) => {
    const _id = req.user._id;
    const { playlistId } = req.params;
    try{
        const user = await User.findOne({_id:_id});
        // console.log(playlistId);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        user.playlists = user.playlists.filter(playlist => playlist._id.toString() !== playlistId.toString());
        await user.save();
        const updatedPlaylists = user.playlists.reverse();
        return res.status(200).json({message: "Playlist created", playlists: updatedPlaylists});
    } catch(error){
        console.log("inside catch of playlist removal !", error);
        res.status(500).json({ message: "Playlist removal failed !" });
    }
}
exports.addTrackToPlaylist = async(req, res, next) => {
    const _id = req.user._id;
    const { trackId, playlistId } = req.body;
    try{
        const user = await User.findOne({_id:_id});
        // console.log(user);
        // console.log(name+", "+image);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        const playlistIndex = user.playlists.findIndex(playlist => playlist._id.toString() === playlistId.toString());
        if(playlistIndex === -1){
            return res.status(404).json({message: 'Playlist not found!'});
        }
        const playlist = user.playlists[playlistIndex];
        const playlistTracks = playlist.playlist.items;
        const updatedPlaylistTracks = [...playlistTracks];
        const trackExists = playlistTracks.includes(trackId);
        if(!trackExists){
            try{
                updatedPlaylistTracks.push(trackId);
                user.playlists[playlistIndex].playlist.items = updatedPlaylistTracks;
                await user.save();
                return res.status(200).json({ message: 'Track added to playlist'});
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update user' });
            }
        } else {
            return res.status(400).json({ message: 'Track already exists in the playlist' });
        }
    } catch(error){
        console.log("inside catch of track add !", error);
        res.status(500).json({ message: "Track add failed !" });
    }
}
exports.saveTrack = async(req, res, next) => {
    const _id = req.user._id;
    const { trackId } = req.body;
    try{
        const user = await User.findOne({_id:_id});
        // console.log(user);
        // console.log(name+", "+image);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }

        if(!user.favourite) user.favourite = {};
        if(!user.favourite.items) user.favourite.items = [];
        const savedTracks = user.favourite.items;
        const updatedSavedTracks = [...savedTracks];

        // const playlistTracks = playlist.playlist.items;
        // const updatedPlaylistTracks = [...playlistTracks];
        const trackExists = savedTracks.includes(trackId);
        if(!trackExists){
            try{
                updatedSavedTracks.push(trackId);
                user.favourite.items = updatedSavedTracks;
                await user.save();
                return res.status(200).json({ message: 'Track added to saved tracks'});
            } catch (error) {
                console.error(error);
                return res.status(500).json({ error: 'Failed to update user' });
            }
        } else {
            return res.status(400).json({ message: 'Track already exists in saved tracks' });
        }
    } catch(error){
        console.log("inside catch of track add !", error);
        res.status(500).json({ message: "Track add failed !" });
    }
}
exports.getSavedTracks = async(req, res, next) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id:_id});
        // console.log(user);
        // console.log(name+", "+image);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        return res.status(200).json({message: "Saved tracks fetched",savedTracks: user.favourite});
    } catch(error){
        console.log("inside catch of saved tracks fetched !", error);
        res.status(500).json({ message: "Saved tracks fetched failed !" });
    }
}
exports.removeSavedTrack = async(req, res, next) => {
    const _id = req.user._id;
    const { trackId } = req.body;
    try{
        const user = await User.findOne({_id:_id});
        // console.log(playlistId);
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        user.favourite = user.favourite.items.filter(id => id !== trackId);
        await user.save();
        return res.status(200).json({message: "Saved track removed"});
    } catch(error){
        console.log("inside catch of saved track removal !", error);
        res.status(500).json({ message: "Saved track removal failed !" });
    }
}
exports.removePlaylistTrack = async(req, res, next) => {
    const _id = req.user._id;
    const { trackId, playlistId } = req.body;
    try{
        const user = await User.findOne({_id:_id});
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        const playlistIndex = user.playlists.findIndex(playlist => playlist._id.toString() === playlistId.toString());
        if(playlistIndex === -1){
            return res.status(404).json({message: 'Playlist not found!'});
        }
        const playlist = user.playlists[playlistIndex];
        // const playlistTracks = playlist.playlist.items;
        // const updatedPlaylistTracks = [...playlistTracks];
        const updatedPlaylistTracks = playlist.playlist.items.filter(id => id !== trackId);
        // await user.save();
        // const trackExists = playlistTracks.includes(trackId);
        // if(!trackExists){
            // try{
                // updatedPlaylistTracks.push(trackId);
                user.playlists[playlistIndex].playlist.items = updatedPlaylistTracks;
                await user.save();
                return res.status(200).json({ message: 'Track removed from playlist'});
            // } catch (error) {
                // console.error(error);
                // return res.status(500).json({ error: 'Failed to update user' });
            // }
        // } else {
            // return res.status(400).json({ message: 'Track already exists in the playlist' });
        // }
    } catch(error){
        console.log("inside catch of track removal !", error);
        res.status(500).json({ message: "Playlist track removal failed !" });
    }
}
exports.addToSearchedTracks = async(req, res, next) => {
    const _id = req.user._id;
    const { trackId } = req.body;
    try{
        const user = await User.findOne({_id:_id});
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        if(!user.search) user.search = {};
        if(!user.search.items) user.search.items = [];
        // const searchedTracks = user.search.items;
        // const updatedSearchedTracks = [...searchedTracks];

        // const trackExists = searchedTracks.includes(trackId);
        user.search.items = user.search.items.filter(id => id !== trackId);
        user.search.items.push(trackId);
        if (user.search.items.length > 12) {
            user.search.items.shift(); // Remove the first element if array length exceeds 12
        }
        await user.save();
        return res.status(200).json({ message: 'Track added to searched tracks'});
        // if(!trackExists){
        //     try{
        //         updatedSearchedTracks.push(trackId);
        //         user.search.items = updatedSearchedTracks;
        //         await user.save();
        //         return res.status(200).json({ message: 'Track added to searched tracks'});
        //     } catch (error) {
        //         console.error(error);
        //         return res.status(500).json({ error: 'Failed to update user' });
        //     }
        // } else {
        //     return res.status(400).json({ message: 'Track already exists in saved tracks' });
        // }
    } catch(error){
        console.log("inside catch of track add !", error);
        res.status(500).json({ message: "Track add failed !" });
    }
}
exports.getSearchedTracks = async(req, res, next) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id:_id});
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        const searchedTracks = user.search.items.reverse();
        return res.status(200).json({message: "Searched tracks fetched",searchedTracks: searchedTracks});
    } catch(error){
        console.log("inside catch of searched tracks fetched !", error);
        res.status(500).json({ message: "Searched tracks fetched failed !" });
    }
}

exports.addToExploredTracks = async(req, res, next) => {
    const _id = req.user._id;
    const { trackId } = req.body;
    try{
        const user = await User.findOne({_id:_id});
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        if(!user.explore) user.explore = {};
        if(!user.explore.items) user.explore.items = [];
        user.explore.items = user.explore.items.filter(id => id !== trackId);
        user.explore.items.push(trackId);
        if (user.explore.items.length > 12) {
            user.explore.items.shift(); // Remove the first element if array length exceeds 12
        }
        await user.save();
        return res.status(200).json({ message: 'Track added to exlplored tracks'});
    } catch(error){
        console.log("inside catch of track add !", error);
        res.status(500).json({ message: "Track add failed !" });
    }
}
exports.getExploredTracks = async(req, res, next) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id:_id});
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        const exploredTracks = user.explore.items.reverse();
        return res.status(200).json({message: "Explored tracks fetched",exploredTracks: exploredTracks});
    } catch(error){
        console.log("inside catch of explored tracks fetched !", error);
        res.status(500).json({ message: "Explored tracks fetched failed !" });
    }
}

exports.getProfile = async(req, res, next) => {
    const _id = req.user._id;
    try{
        const user = await User.findOne({_id:_id});
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        return res.status(200).json({message: "Profile fetched",fullname: user.fullname, imageUrl: user.image?user.image:""});
    } catch(error){
        console.log("inside catch of profile fetched !", error);
        res.status(500).json({ message: "Profile fetched failed !" });
    }
}
exports.editProfile = async(req, res, next) => {
    const _id = req.user._id;
    const { name, isRemovePhoto } = req.body;
    try{
        const user = await User.findOne({_id:_id});
        if(!user){ 
            return res.status(404).json({message: 'User not found!'});
        }
        user.fullname = name;
        if(isRemovePhoto === "true") user.image = ''; // user remove photo
        else{
            if(req.file) user.image = req.file.filename; // if user update photo
        }
        await user.save(); 
        return res.status(200).json({message: "Profile edited",fullname: user.fullname, imageUrl: user.image?user.image:""});
    } catch(error){
        console.log("inside catch of profile edit !", error);
        res.status(500).json({ message: "Profile edit failed !" });
    }
}