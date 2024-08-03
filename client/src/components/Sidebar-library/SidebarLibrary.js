import React, { useState, useEffect } from 'react'
import classes from './SidebarLibrary.module.css';
import likedsong from '../../assests/liked_song.jpeg';
import playlistImage from '../../assests/playlist_image.png';
import { usePlaylistFormContext } from '../../Context/PlaylistFormContext';
import { useSideBarToggleContext } from '../../Context/SideBarToggleContext';
import { useUserContext } from '../../Context/UserContext';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';

const SidebarLibrary = () => {
  const { playlists, setPlaylists, handleShowPlaylistForm } = usePlaylistFormContext();
  const { isLogin, handleSessionCard } = useUserContext();
  const { setShowSideBar } = useSideBarToggleContext();
  const navigate = useNavigate();

  useEffect(()=>{
    const getUserPlaylists = async () => {
      try{
        const value = Cookies.get('session-token');
        let token = '';
        if(value) token = JSON.parse(value).value;

        const response = await fetch('http://localhost:8080/playlists', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if(response.ok){
          // console.log("Playlists fetched");
          const data = await response.json();
          // console.log(data.playlists);
          setPlaylists(data.playlists);
          // console.log(playlists);
        } else{
          if(response.status === 402){
              handleSessionCard(true);
          }
      }
      }catch(error){
        console.log("Playlists are not fetched");
      }
    }
    const value = Cookies.get('session-token');
    let token = '';
    if(value) token = JSON.parse(value).value;
    if(token) getUserPlaylists();
  },[]);

  const handleLikedSongClick = () => {
    if (isLogin) {
      navigate('/likedSongs')
    } else {
      navigate('/login');
    }
  }
  const handleClick = () => {
    setShowSideBar(false);
    if (isLogin) {
      handleShowPlaylistForm();
    } else {
      navigate('/login');
    }
  };
  const getImage = (image) => {
    if(image) return `http://localhost:8080/default/${image}`;
    return playlistImage;
  }
  const handleRemovePlaylist = async (event, playlistId) => {
    event.stopPropagation();
    console.log("removePlaylist "+playlistId);
    try{
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;

      const response = await fetch(`http://localhost:8080/${playlistId}`, {
        method: "DELETE",
        headers: {
          'Authorization': `Bearer ${token}`,
        }
      });
      if(response.ok){
        // console.log("Playlists fetched");
        const data = await response.json();
        // console.log(data.playlists);
        setPlaylists(data.playlists); // set updated playlists
        // console.log(playlists);
      } else{
        if(response.status === 402){
            handleSessionCard(true);
        }
    }
    }catch(error){
      console.log("Playlist is not removed");
    }
  }
  
  return (
    <div className={classes.library}>
      <div className={classes.option}>
        <div className={classes.liboption}>
          <i class="bi bi-collection-fill"></i>
          <span>Your library</span>
        </div>
        <div className={classes.icons}>
            <i class="bi bi-plus-lg" onClick={handleClick}></i>
            {/* <i class="fa-sharp fa-solid fa-plus"></i> */}
        </div>
      </div>
      <div className={classes.libbox}>
        <div className={classes.box} onClick={()=>handleLikedSongClick()}>
            <div className={classes.image}><img src={likedsong}></img></div>
            <div className={classes.name}>Liked Songs</div>
        </div>
        {/* <div className={classes.box}>
            <div className={classes.image}><img src={playlistImage}></img></div>
            <div className={classes.name}>Playlist<i class="bi bi-trash"></i></div>
        </div> */}
        {isLogin && playlists.length > 0 && 
          <>
            {playlists.map((p) => (
              <div className={classes.box} key={p._id} onClick={()=>navigate(`/userPlaylist/${p._id}`)}>
                <div className={classes.image}><img src={getImage(p.playlist.image)}></img></div>
                <div className={classes.name}>{p.playlist.name}<i class="bi bi-trash" onClick={(e)=>handleRemovePlaylist(e,p._id)}></i></div>
              </div>
            ))}
          </>
        }
      </div>
    </div>
  )
}

export default SidebarLibrary
