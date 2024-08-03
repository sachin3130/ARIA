import React from 'react'
import classes from './TrackCard.module.css';
import image from '../../assests/blank_image.png';
import { usePlaylistFormContext } from '../../Context/PlaylistFormContext';
import { useUserContext } from '../../Context/UserContext';
import { Link, useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';


const TrackCard = ({ isOpen, onToggle, data , isTrackPage = false, isLikedTrack = false, onRemoveTrack = () => {}, currentPlaylistId = ''}) => {

  const { playlists, handleShowPlaylistForm } = usePlaylistFormContext();
  const { isLogin, handleSessionCard } = useUserContext();
  const navigate = useNavigate();
  
  const handleTrackLink = (trackId) => {
    if(!isTrackPage) navigate(`/track/${trackId}`);
    // else console.log("Hellohi");
  }
  const handleIconClick = (event) => {
    event.stopPropagation();
    onToggle();
  }
  const handleNewPlaylistClick = () => {
    if (isLogin) {
      handleShowPlaylistForm();
    } else {
      navigate('/login');
    }
  };
  const handleAddSongToPlaylist = async (trackId, playlistId) => {
    // console.log("trackid "+trackId);
    // console.log("playlistId "+playlistId);
    try{
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;

      const response = await fetch('http://localhost:8080/addTrackToPlaylist', {
        method: "POST",
        body: JSON.stringify({trackId, playlistId}),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if(response.ok){
        const data = await response.json();
        console.log("Track added");
      } else{
        if(response.status === 402){
            handleSessionCard(true);
        }
    }
    }catch(error){
      console.log("Track not added to playlist");
    }
  }
  const handleAddSongToSaved = async (trackId) => {
    try{
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;

      const response = await fetch('http://localhost:8080/saveTrack', {
        method: "POST",
        body: JSON.stringify({trackId}),
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        }
      });
      if(response.ok){
        const data = await response.json();
        console.log("Track added");
      } else{
        if(response.status === 402){
            handleSessionCard(true);
        }
    }
    }catch(error){
      console.log("Track not added to saved");
    }
  }
  
  
  return (
    <>
    <div className={classes.trackcard}>
        <div className={classes.image} onClick={()=>handleTrackLink(data.id)}><img className={classes.cardimg} src={data.imageUrl || image}></img></div>
        <div className={classes.name} onClick={()=>handleTrackLink(data.id)}>
            <p className={classes.cardtitle}>{data.title}</p>
            <p className={classes.cardinfo}>{data.info}</p>
        </div>
        {
            isOpen &&
            <div className={classes.dropdown}>
                {isLikedTrack && <button onClick={onRemoveTrack}><i class="bi bi-heart-fill" style={{color: 'red'}}></i>Remove from your liked songs</button>}
                {!isLikedTrack && <button onClick={()=>handleAddSongToSaved(data.id)}><i class="bi bi-heart-fill"></i>Save to liked songs</button>}
                <button onClick={handleNewPlaylistClick}><i class="bi bi-plus-lg add_icon"></i>New Playlist</button>
                {playlists.length > 0 && 
                  <>
                    {playlists.map((p) => (
                      // if(p._id.toString() === currentPlaylistId) {
                      //   <button onClick={onRemoveTrack}><i class="bi bi-music-note-beamed"></i>Remove from {p.playlist.name}</button>
                      // }
                      // else <button onClick={()=>handleAddSongToPlaylist(data.id, p._id)}><i class="bi bi-music-note-beamed"></i>{p.playlist.name}</button>
                      p._id.toString() === currentPlaylistId ?
                      (<button key={p._id} onClick={onRemoveTrack}><i className="bi bi-music-note-beamed"></i> Remove from {p.playlist.name}</button>) :
                      (<button key={p._id} onClick={() => handleAddSongToPlaylist(data.id, p._id)}><i className="bi bi-music-note-beamed"></i> Add to {p.playlist.name}</button>)
                    ))}
                  </>
                }
            </div>
        }
        <div className={classes.icon}>
            <i class="bi bi-three-dots-vertical dropdown-icon" onClick={handleIconClick}></i>
        </div>
    </div>
    
  </>
  )
}

export default TrackCard
