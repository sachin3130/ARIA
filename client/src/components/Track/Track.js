import React, { useState, useEffect, useRef } from 'react'
import TopNav from '../TopNav/TopNav';
import Header from '../Card/Header';
import TrackCard from '../Card/TrackCard';
import classes from './Track.module.css';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import Card from '../Card/Card';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';
import { usePlayerContext } from '../../Context/PlayerContext';

const Track = () => {
    const [isATT, setIsATT] = useState(false);
    const [openDropdown, setOpenDropdown] = useState(false);
    const [track, setTrack] = useState("");
    const [artistTopTracks, setArtistTopTracks] = useState([]);
    const [lyrics, setLyrics] = useState("");
    const [previewUrl, setPreviewUrl] = useState("");
    const {trackId} = useParams();
    const navigate = useNavigate();
    const { handleSessionCard, handleAuthorization } = useUserContext();
    const { handleShowPlayer } = usePlayerContext();

    const handleToggleDropdown = () => {
        setOpenDropdown(!openDropdown);
      };
      const handleAddSongToExplored = async () => {
        try{
          const value = Cookies.get('session-token');
          let token = '';
          if(value) token = JSON.parse(value).value;
    
          const response = await fetch('http://localhost:8080/exploredTracks', {
            method: "POST",
            body: JSON.stringify({trackId}),
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            }
          });
          if(response.ok){
            const data = await response.json();
            // console.log("Track added");
          } else{
            if(response.status === 402){
                handleSessionCard(true);
            }
        }
        }catch(error){
          console.log("Track not added to explored tracks");
        }
      }
      const getArtistTopTracks = async(firstArtistId)=>{
        const response = await axios.get(`https://api.spotify.com/v1/artists/${firstArtistId}/top-tracks`,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            "Content-Type":"application/json"
          }
        })
        // if(response.status === 401) navigate('/');
        const data = response.data.tracks.map((track) => {
            return {
              id: track.id,
              imageUrl: track.album.images[0] ? track.album.images[0].url : '',
              title: track.name,
              info: track.artists.map((artist) => artist.name).join(','),
            };
          });
        setArtistTopTracks(data);
      }
      const getTrackLyrics = async(trackName, artistName, isrc)=>{
        setLyrics("");
        const response = await fetch('http://localhost:8080/track/getTrackLyrics', {
          method: 'POST',
          body: JSON.stringify({trackName: trackName, artistName: artistName, isrc: isrc}),
          headers: { 
            'Content-Type' : 'application/json'
          },
          credentials: 'include',
        })
        const data = await response.json();
        if(response.ok){
          // console.log(data.lyrics);
          setLyrics(data.lyrics.split("...")[0].trim());
        }
      }

    useEffect(() => {
      // console.log(playlistId);
      const getTrackDetails = async()=>{
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
        if(response.data.preview_url) setPreviewUrl(response.data.preview_url);
        getArtistTopTracks(response.data.artists[0].id);
        getTrackLyrics(response.data.name, response.data.artists[0].name,response.data.external_ids.isrc);
        setTrack(data);
        }
        if(Cookies.get('token')) getTrackDetails();
        else handleAuthorization(true);
    },[trackId])          
    useEffect(()=>{
      if(Cookies.get('session-token')) handleAddSongToExplored();
    },[trackId]
  )

  return (
    <div>
      <TopNav/>
      <Header name={track.title} imageUrl={track.imageUrl}/>
      {track && <TrackCard isOpen={openDropdown} onToggle={() => handleToggleDropdown()} data={track} isTrackPage={true}/>}
      {track && previewUrl && handleShowPlayer({imageUrl: track.imageUrl, title: track.title, info: track.info, lyrics: lyrics? lyrics:'', previewUrl: previewUrl})}
      {/* {lyrics && 
        <>
          <h2>Lyrics</h2>
          <pre className={classes.lyrics}>{lyrics}</pre>                                     
        </>
      } */}
      {
        artistTopTracks.length > 0 && <h2>More From {track.info.split(',')[0].trim()}<button onClick={()=> {setIsATT(!isATT)}}>SEE ALL</button></h2>
      }
      <div className={`${classes.cardcontainer}${isATT ? 'classes.flexwrap':''}`}>
        {artistTopTracks.map((track) => (
            <Link to={`/track/${track.id}`}>
                <Card key={track.id} data={track}/>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default Track
