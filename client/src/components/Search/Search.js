import React, { useState, useEffect } from 'react'
import TopNav from '../TopNav/TopNav';
import SearchBar from '../SearchBar/SearchBar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import classes from './Search.module.css';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';


const Search = () => {
  const [isFWRS, setIsFWRS] = useState(false);
  const [browseCategories, setBrowseCategories] = useState([]);
  const [searchedTracks, setSearchedTracks] = useState([]);
  const navigate = useNavigate();
  const { isLogin, handleSessionCard, handleAuthorization } = useUserContext();

  useEffect(() => {
    const getBrowseCategories = async()=>{
      const response = await axios.get(`https://api.spotify.com/v1/browse/categories`,{
          headers: {
              Authorization: `Bearer ${Cookies.get('token')}`,
          "Content-Type":"application/json"
        }
      })
      const data = response.data.categories.items.map((item) => {
          return {
            id: item.id,
            imageUrl: item.icons[0] ? item.icons[0].url : '',
            title: item.name,
            info: '',
          };
        });
      setBrowseCategories(data);
    }
    if(Cookies.get('token')) getBrowseCategories();
    else handleAuthorization(true);
  },[]);

  const handleFormSubmit = (input)=>{
    if(input) navigate(`/search/${input}`);
  }

  const getTrackDetails = async(trackId)=>{
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
        // setPlaylistTracks(...playlistTracks, data);
        setSearchedTracks(prevSearchedTracks => [...prevSearchedTracks, data]);
    //   console.log(data);
    }

  const getTracks = async (trackIds) => {
    // console.log(trackIds);
    setSearchedTracks([]);
    trackIds.map(trackId => {
      if(Cookies.get('token')) getTrackDetails(trackId);
      else handleAuthorization(true);
    });

  }
  useEffect(()=>{
    setSearchedTracks([]);
    const getSearchedTracks = async() => {
        try{
          const value = Cookies.get('session-token');
          let token = '';
          if(value) token = JSON.parse(value).value;
    
          const response = await fetch('http://localhost:8080/searchedTracks', {
            method: "GET",
            headers: {
              'Authorization': `Bearer ${token}`,
            }
          });
          if(response.ok){
            // console.log("Playlists fetched");
            const data = await response.json();
            // console.log(data.searchedTracks);
            // console.log(data.playlist.playlist.items);
            // setPlaylistName(data.playlist.playlist.name);
            // if(data.playlist.playlist.image) setPlaylistImageUrl(`http://localhost:8080/default/${data.playlist.playlist.image}`);
            getTracks(data.searchedTracks);
          } else{
            if(response.status === 402){
                handleSessionCard(true);
            }
        }
        }catch(error){
          console.log("Searched tracks is not fetched");
        }
      }
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;
      if(token) getSearchedTracks();
  },[]);      
  return (
    <div>
      <TopNav backgroundColor={'#121212'}/>
      <SearchBar onSubmit={handleFormSubmit}/>
      {
        isLogin && searchedTracks.length > 0 && 
        <>
          <h2>Recently Searched<button onClick={()=> {setIsFWRS(!isFWRS)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWRS ? 'classes.flexwrap':''}`}>
            {searchedTracks.map((track) => (
              <Link to={`/track/${track.id}`} >
                <Card key={track.id} data={track}/>
              </Link>
            ))}
          </div>
        </>
      }
      {
        browseCategories.length > 0 && 
        <>
          <h2>Browse All</h2>
          <div className={`${classes.cardcontainer}${'classes.flexwrap'}`}>
            {browseCategories.map((category) => (
              <Link to={`/search/${category.title} songs`} >
                <Card key={category.id} data={category} isCategory={true}/>
              </Link>
            ))}
          </div>
        </>
      }
      
    </div>
  )
}

export default Search
