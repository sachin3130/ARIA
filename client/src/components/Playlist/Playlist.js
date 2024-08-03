import React, { useState, useEffect } from 'react'
import classes from './Playlist.module.css';
import TopNav from '../TopNav/TopNav';
import Header from '../Card/Header';
import TrackCard from '../Card/TrackCard';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useLocation } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';

const Playlist = ({location}) => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [playlistTracks, setPlaylistTracks] = useState([]);
  const [playlistName, setPlaylistName] = useState("");
  const [playlistImageUrl, setPlaylistImageUrl] = useState("");
  const { handleAuthorization } = useUserContext();
  
  // console.log(location);
//   const {playlistname, playlistimageurl} = location.state;
    // setPlaylistName(playlistname);
    // setPlaylistImageUrl(playlistimageurl);
  
  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };

  const {playlistId} = useParams();
  useEffect(() => {
    // console.log(playlistId);
    const getPlaylistTracks = async()=>{
      const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=12&offset=0`,{
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          "Content-Type":"application/json"
        }
      })
        const data = response.data.items.map((item) => {
          return {
            id: item.track.id,
            imageUrl: item.track.album.images[0] ? item.track.album.images[0].url : '',
            title: item.track.album.name,
            info: item.track.artists.map((artist) => artist.name).join(','),
          };
        });
        // console.log(response.data);
        // setAlbumName(response.data.name);
        // if (response.data.images[0]) setAlbumImageUrl(response.data.images[0].url);
        setPlaylistTracks(data);
      }
      if(Cookies.get('token')) getPlaylistTracks();
      else handleAuthorization(true);
  },[])
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
            />
        // </Link>
        ))}
      </div>
    </div>
  )
}

export default Playlist
