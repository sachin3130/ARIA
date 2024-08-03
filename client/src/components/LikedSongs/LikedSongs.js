import React, { useState, useEffect } from 'react'
import classes from './LikedSongs.module.css';
import likedSongImage from '../../assests/liked_song.jpeg';
import TopNav from '../TopNav/TopNav';
import Header from '../Card/Header';
import TrackCard from '../Card/TrackCard';
import { Link } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserContext } from '../../Context/UserContext';

const LikedSongs = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [savedTracks, setSavedTracks] = useState([]);
  const { isLogin, handleSessionCard, handleAuthorization } = useUserContext();
  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };

  const getTrackDetails = async(trackId)=>{
    const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`,{
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
        "Content-Type":"application/json"
      }
    })
    // if(response.status === 401) navigate('/');
      const data = {
          id: response.data.id,
          imageUrl: response.data.album.images[0] ? response.data.album.images[0].url : '',
          title: response.data.name,
          info: response.data.artists.map((artist) => artist.name).join(','),
        };
        // setPlaylistTracks(...playlistTracks, data);
        setSavedTracks(prevSavedTracks => [...prevSavedTracks, data]);
    //   console.log(data);
    }

  const getTracks = async (trackIds) => {
    // console.log(trackIds);
    setSavedTracks([]);
    trackIds.map(trackId => {
      if(Cookies.get('token')) getTrackDetails(trackId);
      else handleAuthorization(true);
    });

  }
  useEffect(()=>{
    setSavedTracks([]);
    const getSavedTracks = async() => {
        try{
          const value = Cookies.get('session-token');
          let token = '';
          if(value) token = JSON.parse(value).value;
    
          const response = await fetch('http://localhost:8080/savedTracks', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          if(response.ok){
            // console.log("Playlists fetched");
            const data = await response.json();
            // console.log(data.savedTracks.items);
            // console.log(data.playlist.playlist.items);
            // setPlaylistName(data.playlist.playlist.name);
            // if(data.playlist.playlist.image) setPlaylistImageUrl(`http://localhost:8080/default/${data.playlist.playlist.image}`);
            getTracks(data.savedTracks.items);
          } else{
            if(response.status === 402){
                handleSessionCard(true);
            }
        }
        }catch(error){
          console.log("Saved tracks is not fetched");
        }
      }
      getSavedTracks();
  },[]);

  const handleRemoveSongFromSaved = async (trackId) => {
    try{
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;

      const response = await fetch('http://localhost:8080/removeSavedTrack', {
        method: "DELETE",
        body: JSON.stringify({trackId}),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if(response.ok){
        const data = await response.json();
        setSavedTracks(savedTracks.filter(track => track.id !== trackId));
      } else{
        if(response.status === 402){
            handleSessionCard(true);
        }
    }
    }catch(error){
      console.log("Track not removed from saved");
    }
  };

  return (
    <div className={classes.likedSongs}>
        <TopNav/>
        <Header name={"Liked Songs"} imageUrl={likedSongImage}/>
        <div className={classes.trackcardcontainer}>
        {isLogin && savedTracks.map((track,index) => (
            // <Link to={`/track/${track.id}`} style={{textDecoration:'none'}}>
                <TrackCard
                key={track.id}
                isOpen={index === openDropdownIndex}
                onToggle={() => handleToggleDropdown(index)}
                data={track}
                isLikedTrack = {true}
                onRemoveTrack={() => handleRemoveSongFromSaved(track.id)} // Pass the callback to TrackCard
                />
            // </Link>
            ))}
        </div>
    </div>
  )
}

export default LikedSongs
