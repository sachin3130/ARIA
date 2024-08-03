import React, { useState, useEffect } from 'react'
import TopNav from '../TopNav/TopNav';
import SearchBar from '../SearchBar/SearchBar';
import axios from 'axios';
import Cookies from 'js-cookie';
import { Link } from 'react-router-dom';
import Card from '../Card/Card';
import classes from './SearchResult.module.css';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';

const SearchResult = () => {
  const [searchTrack, setSearchTrack] = useState([]);
  const [searchAlbum, setSearchAlbum] = useState([]);
  const [searchArtist, setSearchArtist] = useState([]);
  const [searchPlaylist, setSearchPlaylist] = useState([]);
  const [isFWTr, setIsFWTr] = useState(false); // isFlexWrapTracks
  const [isFWAl, setIsFWAl] = useState(false); // isFlexWrapAlbums
  const [isFWPl, setIsFWPl] = useState(false); // isFlexWrapPlaylists
  const [isFWAr, setIsFWAr] = useState(false); // isFlexWrapArtists
  const navigate = useNavigate();
  const { handleSessionCard, handleAuthorization } = useUserContext();

  const handleAddSongToSearched = async (trackId) => {
    try{
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;

      const response = await fetch('http://localhost:8080/searchedTracks', {
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
      console.log("Track not added to searched tracks");
    }
  }

  const getSearchResult = async(query)=>{
    const response = await axios.get(`https://api.spotify.com/v1/search?q=${query}&type=track,album,artist,playlist&limit=12`,{
        headers: {
            Authorization: `Bearer ${Cookies.get('token')}`,
        "Content-Type":"application/json"
      }
    })
    const data1 = response.data.tracks.items.map((track) => {
        return {
          id: track.id,
          imageUrl: track.album.images[0] ? track.album.images[0].url : '',
          title: track.album.name,
          info: track.artists.map((artist) => artist.name).join(','),
        };
      });
    const data2 = response.data.playlists.items.map((playlist) => {
        return {
          id: playlist.id,
          imageUrl: playlist.images[0] ? playlist.images[0].url : '',
          title: playlist.name,
          info: playlist.description,
        };
      });
    const data4 = response.data.artists.items.map((artist) => {
      return {
        id: artist.id,
        imageUrl: artist.images[0] ? artist.images[0].url : '',
        title: artist.name,
        info: artist.genres.join(','),
      };
    });    
    const data3 = response.data.albums.items.map((album) => {
      return {
        id: album.id,
        imageUrl: album.images[0] ? album.images[0].url : '',
        title: album.name,
        info: album.artists.map((artist) => artist.name).join(','),
      };
    });    
    // console.log(data4);
    setSearchTrack(data1);
    setSearchPlaylist(data2);
    setSearchAlbum(data3);
    setSearchArtist(data4);
  }
  const {query} = useParams();
  useEffect(()=>{
    if(Cookies.get('token')) getSearchResult(query);
    else handleAuthorization(true);
  },[query])

  useEffect(()=>{
    const value = Cookies.get('session-token');
    let token = '';
    if(value) token = JSON.parse(value).value;
    if(searchTrack.length > 0 && token) handleAddSongToSearched(searchTrack[0].id);
  },[searchTrack])

  const handleFormSubmit = (input)=>{
    if(input) navigate(`/search/${input}`);
  }
  
  return (
    <div>
      <TopNav/>
      <SearchBar onSubmit={handleFormSubmit}/>
      {
        searchTrack.length > 0 &&
        <>
          <h2>Tracks<button onClick={()=> {setIsFWTr(!isFWTr)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWTr ? 'classes.flexwrap':''}`}>
            {searchTrack.map((track) => (
              <Link to={`/track/${track.id}`} >
                <Card key={track.id} data={track}/>
              </Link>
            ))}
          </div>
        </>
      }
      {
        searchAlbum.length > 0 &&
        <>
          <h2>Albums<button onClick={()=> {setIsFWAl(!isFWAl)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWAl ? 'classes.flexwrap':''}`}>
            {searchAlbum.map((album) => (
              <Link to={`/album/${album.id}`} >
                <Card key={album.id} data={album}/>
              </Link>
            ))}
          </div>
        </>
      }
      {
        searchPlaylist.length > 0 &&
        <>
          <h2>Playlists<button onClick={()=> {setIsFWPl(!isFWPl)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWPl ? 'classes.flexwrap':''}`}>
            {searchPlaylist.map((playlist) => (
              <Link to={`/playlist/${playlist.id}`} >
                <Card key={playlist.id} data={playlist}/>
              </Link>
            ))}
          </div>
        </>
      }
      {
        searchArtist.length > 0 &&
        <>
          <h2>Artists<button onClick={()=> {setIsFWAr(!isFWAr)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWAr ? 'classes.flexwrap':''}`}>
            {searchArtist.map((artist) => (
              <Link to={`/artist/${artist.id}`} >
                <Card key={artist.id} data={artist} isArtist={true}/>
              </Link>
            ))}
          </div>
        </>
      }
    </div>
  )
}

export default SearchResult
