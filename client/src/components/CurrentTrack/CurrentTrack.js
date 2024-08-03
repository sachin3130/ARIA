import React, { useState, useRef, useEffect } from 'react'
import classes from './CurrentTrack.module.css';
import image from '../../assests/blank_image.png';
import { usePlayerContext } from '../../Context/PlayerContext';
import { ColorExtractor } from 'react-color-extractor';


const CurrentTrack = () => {
    const [showLyrics, setShowLyrics] = useState(false); 
    // const [isPlaying, setIsPlaying] = useState(false);
    // const [currentTime, setCurrentTime] = useState(0);
    const audioRef = useRef(null);
    const { isPlaying, currentTime, setIsPlaying, setCurrentTime, imageUrl, title, info, lyrics, previewUrl, setShowPlayerPage } = usePlayerContext();
    const [colors, setColors] = useState([]);
    const [gradient, setGradient] = useState(null);
  useEffect(() => {
    const getColors = (colors) => {
      setColors(colors);
      const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`
      };
      setGradient(gradientStyle);
    };
    // Extract colors only when imageUrl changes
    if (imageUrl) {
      setColors([]); // Reset colors before extraction
      // Perform color extraction
      // You may need to debounce this function if it's being called too frequently
    }

  }, [imageUrl]); // Trigger useEffect whenever imageUrl changes

    const getColors = (colors) => {
      setColors((prevColors) => [...prevColors, ...colors]);
      const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`
      };
      setGradient(gradientStyle);
    };

    useEffect(()=>{
      if(isPlaying){
        audioRef.current.play();
        audioRef.current.currentTime = currentTime;
      }
    },[]);
    const togglePlay = () => {
        if (isPlaying) {
          audioRef.current.pause();
        } else {
          audioRef.current.play();
        }
        setIsPlaying(prevIsPlaying => !prevIsPlaying);
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
    <>
        <ColorExtractor getColors={getColors}>
          <img src={imageUrl || image} style={{display:'none'}}></img>
        </ColorExtractor>
        <div className={classes.currenttrackcontainer} style={{backgroundColor: `${colors[0]}`}}>
            
            <audio
                ref={audioRef}
                src={previewUrl}
                onTimeUpdate={updateTime}
                onEnded={() => setIsPlaying(false)}
                loop={false}
            ></audio>
            <div className={classes.content}>
            {/* <div className={classes.lyrics}><pre>{lyrics}</pre></div> */}

              {
                showLyrics?
                (<div className={classes.lyrics}><pre>{lyrics}</pre></div>): 
                (<div className={classes.header}>
                    <div className={classes.image}><img src={imageUrl || image}></img></div>
                    <div className={classes.text}>
                      <div className={classes.title}>{title}</div>
                      <div className={classes.info}>{info}</div>
                    </div>
                  </div>)
              }
            </div>
                <div className={classes.player}>
                    <div className={classes.playbackbar}>
                        <span className={classes.currtime}>{formatTime(currentTime)}</span>
                        <input type="range" min="0" max={audioRef.current ? audioRef.current.duration : 0} step="1" className={classes.progressbar} value={currentTime} onChange={handleSeek}/>
                        <span className={classes.currtime}>{audioRef.current ? formatTime(audioRef.current.duration): "0:00"}</span>
                    </div>
                    <div className={classes.playercontrols}>
                        {isPlaying?
                            <i class="bi bi-pause-circle-fill" onClick={togglePlay}></i>:
                            <i class="bi bi-play-circle-fill" onClick={togglePlay}></i>
                        }
                    </div>
                    <div className={classes.exitfullscreen}>
                        {lyrics && <i class="bi bi-music-note-list" title="Lyrics" onClick={()=>setShowLyrics(prev => !prev)}></i>}
                        <i class="bi bi-fullscreen-exit" onClick={()=>setShowPlayerPage(false)}></i>
                    </div>
                </div>
        </div>
    </>
  )
}

export default CurrentTrack
