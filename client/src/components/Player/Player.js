import React, { useState, useEffect, useRef } from 'react'
import classes from './Player.module.css';
import image from '../../assests/liked_song.jpeg';
import { usePlayerContext } from '../../Context/PlayerContext';

const Player = () => {
  // const [isPlaying, setIsPlaying] = useState(false);
  const [volume, setVolume] = useState(0.5);
  // const [currentTime, setCurrentTime] = useState(0);
  const audioRef = useRef(null);
  useEffect(()=>{
    if(isPlaying){
      audioRef.current.play();
      audioRef.current.currentTime = currentTime;
    }
  },[]);
  const { isPlaying, currentTime, setIsPlaying, setCurrentTime, imageUrl, title, info, previewUrl, setShowPlayerPage } = usePlayerContext();

  const togglePlay = () => {
    if (isPlaying) {
      audioRef.current.pause();
    } else {
      audioRef.current.play();
    }
    setIsPlaying(prevIsPlaying => !prevIsPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    audioRef.current.volume = newVolume;
  };

  const handleSeek = (e) => {
    const newTime = parseFloat(e.target.value);
    setCurrentTime(newTime);
    audioRef.current.currentTime = newTime;
  };

  const updateTime = () => {
    setCurrentTime(audioRef.current.currentTime);
  };
  function formatTime(time) {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  }
  return (
    <div className={classes.playercomponent}>
      <audio
        ref={audioRef}
        src={previewUrl}
        onTimeUpdate={updateTime}
        onEnded={() => setIsPlaying(false)}
        loop={false}
      ></audio>
            <div className={classes.track}>
              <div className={classes.image} ><img className={classes.cardimg} src={imageUrl}></img></div>
              <div className={classes.name}>
                  <p className={classes.cardtitle}>{title}</p>
                  <p className={classes.cardinfo}>{info}</p>
              </div>
            </div>

            <div className={classes.player}>
                <div className={classes.playercontrols}>
                  {
                    isPlaying ? 
                    <i class="bi bi-pause-circle-fill" onClick={togglePlay}></i> :
                    <i class="bi bi-play-circle-fill" onClick={togglePlay}></i>
                  }
                </div>
                <div className={classes.playbackbar}>
                    <span className={classes.currtime}>{formatTime(currentTime)}</span>
                    <input type="range" min="0" max={audioRef.current ? audioRef.current.duration : 0} step="1" className={classes.progressbar} value={currentTime} onChange={handleSeek}/>
                    <span className={classes.currtime}>{audioRef.current ? formatTime(audioRef.current.duration): "0:00"}</span>
                </div>
            </div>

            <div className={classes.volume}>
                <i class="bi bi-volume-up"></i>
                <input type="range" min="0" max="1" step="0.01" className={classes.volumebar} value={volume} onChange={handleVolumeChange}/>
                <div className={classes.fullscreen}><i class="bi bi-fullscreen" onClick={() => setShowPlayerPage(prev=>!prev)}></i></div>
            </div>
            <div className={classes.fullscreen2}><i class="bi bi-fullscreen" onClick={() => setShowPlayerPage(prev=>!prev)}></i></div>
    </div>
  )
}

export default Player
