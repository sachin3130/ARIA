import React, { createContext, useContext, useState } from 'react';

const PlaylistFormContext = createContext();

export const usePlaylistFormContext = () => useContext(PlaylistFormContext);

export const PlaylistFormProvider = ({ children }) => {
  const [showPlaylistForm, setShowPlaylistForm] = useState(false);
  const [playlists, setPlaylists] = useState([]);

  const handleAddPlaylist = (newPlaylist) => {
    setPlaylists([newPlaylist,...playlists]);
  }

  const handleShowPlaylistForm = () => {
    setShowPlaylistForm(true);
  };

  const handleClosePlaylistForm = () => {
    setShowPlaylistForm(false);
  };

  return (
    <PlaylistFormContext.Provider value={{ showPlaylistForm, playlists, setPlaylists, handleShowPlaylistForm, handleClosePlaylistForm, handleAddPlaylist }}>
      {children}
    </PlaylistFormContext.Provider>
  );
};
