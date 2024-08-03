import React, { useEffect, useState } from 'react'
import TopNav from '../TopNav/TopNav'
import Header from '../Card/Header';
import classes from './Album.module.css';
import TrackCard from '../Card/TrackCard';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserContext } from '../../Context/UserContext';


const Album = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [albumTracks, setAlbumTracks] = useState([]);
  const [albumName, setAlbumName] = useState("");
  const [albumImageUrl, setAlbumImageUrl] = useState("");
  const { handleAuthorization } = useUserContext();

  const handleToggleDropdown = (index) => {
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };

  const {albumId} = useParams();

  useEffect(() => {
    // console.log(albumId);
    const getAlbumTracks = async()=>{
      const response = await axios.get(`https://api.spotify.com/v1/albums/${albumId}`,{
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          "Content-Type":"application/json"
        }
      })
        const data = response.data.tracks.items.map((track) => {
          return {
            id: track.id,
            imageUrl: response.data.images[0] ? response.data.images[0].url : '',
            title: track.name,
            info: track.artists.map((artist) => artist.name).join(','),
          };
        });
        // console.log(data);
        setAlbumName(response.data.name);
        if (response.data.images[0]) setAlbumImageUrl(response.data.images[0].url);
        setAlbumTracks(data);
      }
      if(Cookies.get('token')) getAlbumTracks();
      else handleAuthorization(true);
  },[])
  return (
    <div>
      <TopNav/>
      <Header name={albumName} imageUrl={albumImageUrl}/>
      <div className={classes.trackcardcontainer}>
      {albumTracks.map((track,index) => (
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

export default Album
