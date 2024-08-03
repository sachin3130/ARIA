import React, { useState, useEffect } from 'react'
import classes from './UserPlaylist.module.css';
import playlistImage from '../../assests/playlist_image.png';
import TopNav from '../TopNav/TopNav';
import Header from '../Card/Header';
import TrackCard from '../Card/TrackCard';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserContext } from '../../Context/UserContext';

const UserPlaylist = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistImageUrl, setPlaylistImageUrl] = useState(playlistImage);
  const { handleSessionCard, handleAuthorization } = useUserContext();
  
  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };
  const {playlistId} = useParams();

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
        setPlaylistTracks(prevPlaylistTracks => [...prevPlaylistTracks, data]);
    //   console.log(data);
    }

  const getTracks = async (trackIds) => {
    // console.log(trackIds);
    setPlaylistTracks([]);
    trackIds.map(trackId => {
      if(Cookies.get('token')) getTrackDetails(trackId);
      else handleAuthorization(true);
    });

  }
  useEffect(()=>{
    setPlaylistName("");
    setPlaylistImageUrl(playlistImage);
    const getPlaylist = async() => {
        try{
          const value = Cookies.get('session-token');
          let token = '';
          if(value) token = JSON.parse(value).value;
    
          const response = await fetch(`http://localhost:8080/${playlistId}`, {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          if(response.ok){
            // console.log("Playlists fetched");
            const data = await response.json();
            // console.log(data.playlist.playlist.items);
            setPlaylistName(data.playlist.playlist.name);
            if(data.playlist.playlist.image) setPlaylistImageUrl(`http://localhost:8080/default/${data.playlist.playlist.image}`);
            getTracks(data.playlist.playlist.items);
          } else{
            if(response.status === 402){
                handleSessionCard(true);
            }
        }
        }catch(error){
          console.log("Playlist is not fetched");
        }
      }
      getPlaylist();
  },[playlistId]);

  const handleRemoveSongFromPlaylist = async (trackId) => {
    try{
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;

      const response = await fetch('http://localhost:8080/removeTrackFromPlaylist', {
        method: "DELETE",
        body: JSON.stringify({trackId, playlistId}),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if(response.ok){
        const data = await response.json();
        setPlaylistTracks(playlistTracks.filter(track => track.id !== trackId));
      } else{
        if(response.status === 402){
            handleSessionCard(true);
        }
    }
    }catch(error){
      console.log("Track not removed from playlist");
    }
  };
  return (
    <div className={classes.playlist}>
        <TopNav/>
        <Header name={playlistName} imageUrl={playlistImageUrl}/>
        <div className={classes.trackcardcontainer}>
        {playlistTracks.map((track,index) => (
            // <Link to={`/track/${track.id}`} style={{textDecoration:'none'}}>
                <TrackCard
                key={track.id}
                isOpen={index === openDropdownIndex}
                onToggle={() => handleToggleDropdown(index)}
                data={track}
                onRemoveTrack={() => handleRemoveSongFromPlaylist(track.id)}
                currentPlaylistId = {playlistId}
                />
            // </Link>
            ))}
        </div>
    </div>
  )
}

export default UserPlaylist
