import React, { createContext, useContext, useState } from 'react';

const PlayerContext = createContext();

export const usePlayerContext = () => useContext(PlayerContext);

export const PlayerProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [showPlayer, setShowPlayer] = useState(false);
  const [showPlayerPage, setShowPlayerPage] = useState(false);
  const [imageUrl, setImageUrl] = useState("");
  const [title, setTitle] = useState("");
  const [info, setInfo] = useState("");
  const [previewUrl, setPreviewUrl] = useState("");
  const [lyrics, setLyrics] = useState("");

  const handleShowPlayer = ({imageUrl, title, info, lyrics, previewUrl}) => {
    setImageUrl(imageUrl);
    setTitle(title);
    setInfo(info);
    setPreviewUrl(previewUrl);
    setLyrics(lyrics);
    setShowPlayer(true);
  };

  const handleClosePlayer = () => {
    setShowPlayer(false);
  };
  
  return (
    <PlayerContext.Provider value={{ showPlayer, showPlayerPage, isPlaying, currentTime, imageUrl, title, info, lyrics, previewUrl, setShowPlayerPage, setIsPlaying, setCurrentTime, handleShowPlayer, handleClosePlayer}}>
      {children}
    </PlayerContext.Provider>
  );
};
