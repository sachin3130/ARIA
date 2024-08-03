import React, { useState, useEffect } from 'react'
import TopNav from '../TopNav/TopNav'
import Header from '../Card/Header';
import classes from './Artist.module.css';
import TrackCard from '../Card/TrackCard';
import { Link, useParams } from 'react-router-dom';
import axios from 'axios';
import Cookies from 'js-cookie';
import { useUserContext } from '../../Context/UserContext';


const Artist = () => {
  const [openDropdownIndex, setOpenDropdownIndex] = useState(null);
  const [artistTopTracks, setArtistTopTracks] = useState([]);
  const [artistName, setArtistName] = useState("");
  const [artistImageUrl, setArtistImageUrl] = useState("");
  const { handleAuthorization } = useUserContext();

  const handleToggleDropdown = (index) => {
    // event.stopPropogation();
    setOpenDropdownIndex(index === openDropdownIndex ? null : index);
  };

  const {artistId} = useParams();
  useEffect(() => {
    // console.log(albumId);
    const getArtistDetails = async(firstArtistId)=>{
        const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}`,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            "Content-Type":"application/json"
        }
    })
    setArtistName(response.data.name);
    setArtistImageUrl(response.data.images[0] ? response.data.images[0].url : '');
    }
    const getArtistTopTracks = async(firstArtistId)=>{
        const response = await axios.get(`https://api.spotify.com/v1/artists/${artistId}/top-tracks`,{
            headers: {
                Authorization: `Bearer ${Cookies.get('token')}`,
            "Content-Type":"application/json"
        }
    })
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
      if(Cookies.get('token')){
        getArtistDetails();
        getArtistTopTracks();
      }
      else handleAuthorization(true);
  },[])
  return (
    <div>
      <TopNav/>
      <Header name={artistName} imageUrl={artistImageUrl}/>
      <div className={classes.trackcardcontainer}>
      {artistTopTracks.map((track,index) => (
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

export default Artist
