import React, { useEffect, useRef } from 'react'
import classes from './Maincontent.module.css';
import { Outlet } from 'react-router-dom';
import Profile from '../Profile/Profile';
import PlaylistForm from '../PlaylistForm/PlaylistForm';
import { useProfileContext } from '../../Context/ProfileContext';
import { usePlaylistFormContext } from '../../Context/PlaylistFormContext';
import { useUserContext } from '../../Context/UserContext';
import Logout from '../Logout/Logout';
import SpotifyToken from '../Logout/SpotifyToken';

const Maincontent = () => {
  const { showProfile, handleCloseProfile } = useProfileContext();
  const { showPlaylistForm, handleClosePlaylistForm } = usePlaylistFormContext();
  const { showSessionCard, showAuthorizationCard } = useUserContext(); 
  const containerStyle = (showProfile || showPlaylistForm || showSessionCard || showAuthorizationCard) ? { opacity:0.2 } : {};
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the PlaylistForm only if it's currently shown and the click occurred outside of it
      if ((showPlaylistForm || showProfile) && containerRef.current && containerRef.current.contains(event.target)) {
        handleClosePlaylistForm();
        handleCloseProfile();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showPlaylistForm, handleClosePlaylistForm, showProfile, handleCloseProfile]);

  return (
    <div className={classes.maincontent}>
      <div style={containerStyle} ref={containerRef}>
        <Outlet/>
      </div>
      {showProfile && <Profile/>}
      {showPlaylistForm && <PlaylistForm/>}
      {showSessionCard && <Logout/>}
      {showAuthorizationCard && <SpotifyToken/>}
    </div>
  )
}

export default Maincontent
