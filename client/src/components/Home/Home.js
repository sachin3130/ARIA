import React, { useState,useEffect, useSyncExternalStore } from 'react'
import TopNav from '../TopNav/TopNav';
import classes from './Home.module.css';
import Card from '../Card/Card';
import axios from 'axios'
import { Link } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUserContext } from '../../Context/UserContext';

const Home = () => {
  const [isFWNRA, setIsFWNRA] = useState(false);
  const [isFWFP, setIsFWFP] = useState(false);
  const [isFWRE, setIsFWRE] = useState(false);
  const [isFWRT, setIsFWRT] = useState(false);
  const [isFWRA, setIsFWRA] = useState(false);
  const [newReleaseAlbums, setNewReleaseAlbums] = useState([]);
  const [featuredPlaylist, setFeaturedPlaylist] = useState([]);
  const [exploredTracks, setExploredTracks] = useState([]);
  const [recommendedTracks, setRecommendedTracks] = useState([]);
  const [recommendedArtists, setRecommendedArtists] = useState([]);
  const { isLogin, handleSessionCard, handleAuthorization } = useUserContext();

  
  useEffect(()=> {
    const getNewReleaseAlbums = async()=>{
      const response = await axios.get('https://api.spotify.com/v1/browse/new-releases?offset=0&limit=12',{
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          "Content-Type":"application/json"
        }
      })
        const data1 = response.data.albums.items.map((album) => {
          return {
            id: album.id,
            imageUrl: album.images[0] ? album.images[0].url : '',
            title: album.name,
            info: album.artists.map((artist) => artist.name).join(','),
          };
        });
        setNewReleaseAlbums(data1);
        
    }

    const getFeaturedPlaylists = async()=>{
      const response = await axios.get('https://api.spotify.com/v1/browse/featured-playlists?limit=12&offset=0',{
        headers: {
          Authorization: `Bearer ${Cookies.get('token')}`,
          "Content-Type":"application/json"
        }
      })
      // console.log(response.data.playlists.items);
        const data2 = response.data.playlists.items.map((playlist) => {
          return {
            id: playlist.id,
            imageUrl: playlist.images[0] ? playlist.images[0].url : '',
            title: playlist.name,
            info: playlist.description,
          };
        });
        // console.log(data);
        setFeaturedPlaylist(data2);
    }

    if(Cookies.get('token')){
      getNewReleaseAlbums();
      getFeaturedPlaylists();
    }
    else handleAuthorization(true);
  },[])

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
        setExploredTracks(prevExploredTracks => [...prevExploredTracks, data]);
    //   console.log(data);
    }

  const getTracks = async (trackIds) => {
    // console.log(trackIds);
    setExploredTracks([]);
    trackIds.map(trackId => {
      if(Cookies.get('token')) getTrackDetails(trackId);
      else handleAuthorization(true);
    });

  }
  useEffect(()=>{
    setExploredTracks([]);
    const getExploredTracks = async() => {
        try{
          const value = Cookies.get('session-token');
          let token = '';
          if(value) token = JSON.parse(value).value;
    
          const response = await fetch('http://localhost:8080/exploredTracks', {
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
            getTracks(data.exploredTracks);
          } else{
            if(response.status === 402){
                handleSessionCard(true);
            }
        }
        }catch(error){
          console.log("Explored tracks is not fetched");
        }
      }
      const value = Cookies.get('session-token');
        let token = '';
       if(value) token = JSON.parse(value).value;
      if (token) getExploredTracks();
  },[]);  
  const getRecommendedTracks = async(trackSeed)=>{
    const response = await axios.get(`https://api.spotify.com/v1/recommendations?seed_tracks=${trackSeed}&limit=12`,{
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
      const artistIdEntries = response.data.tracks.map((track) => track.artists.map(artist => artist.id));
      const uniqueArtistIds = [...new Set(artistIdEntries.flat(1))].slice(0,12).join(',');
      setRecommendedTracks(data);
      if(Cookies.get('token')) getRecommendedArtists(uniqueArtistIds);
      else handleAuthorization(true);
  }
  const getRecommendedArtists = async(artistIds)=>{
    const response = await axios.get(`https://api.spotify.com/v1/artists?ids=${artistIds}`,{
      headers: {
        Authorization: `Bearer ${Cookies.get('token')}`,
        "Content-Type":"application/json"
      }
    })
    const data = response.data.artists.map((artist) => {
        return {
          id: artist.id,
          imageUrl: artist.images[0] ? artist.images[0].url : '',
          title: artist.name,
          info: 'Artist',
        };
      });
      setRecommendedArtists(data);
  }
  
  useEffect(()=>{
    setRecommendedTracks([]);
    const getSearchedTracksIds = async() => {
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
            const data = await response.json();
            const trackSeed = data.searchedTracks.slice(0,5).join(',');
            if(trackSeed) {
              if(Cookies.get('token')) getRecommendedTracks(trackSeed);
              else handleAuthorization(true);
            }
          } else{
            if(response.status === 402){
                handleSessionCard(true);
            }
        }
        }catch(error){
          console.log("Searched tracks ids is not fetched");
        }
      }
      const value = Cookies.get('session-token');
      let token = '';
      if(value) token = JSON.parse(value).value;
      if(token) getSearchedTracksIds();
  },[]);
  return (
    <div>
      <TopNav/>
      {
        isLogin && exploredTracks.length > 0 && 
        <>
          <h2>Recently Explored<button onClick={()=> {setIsFWRE(!isFWRE)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWRE ? 'classes.flexwrap':''}`}>
            {exploredTracks.map((track) => (
              <Link to={`/track/${track.id}`}>
                <Card key={track.id} data={track}/>
              </Link>
            ))}
        </div>
        </>
      }
      
      {
        isLogin && recommendedTracks.length > 0 && 
        <>
          <h2>Recommended Tracks<button onClick={()=> {setIsFWRT(!isFWRT)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWRT ? 'classes.flexwrap':''}`}>
            {recommendedTracks.map((track) => (
              <Link to={`/track/${track.id}`}>
                <Card key={track.id} data={track}/>
              </Link>
            ))}
          </div>
        </>
      }
      {
        isLogin && recommendedArtists.length > 0 && 
        <>
          <h2>Artists For You<button onClick={()=> {setIsFWRA(!isFWRA)}}>SEE ALL</button></h2>
          <div className={`${classes.cardcontainer}${isFWRA ? 'classes.flexwrap':''}`}>
            {recommendedArtists.map((artist) => (
              <Link to={`/artist/${artist.id}`}>
                <Card key={artist.id} data={artist} isArtist={true}/>
              </Link>
            ))}
          </div>
        </>
      }
      {
        newReleaseAlbums.length > 0 && <h2>New Released Albums<button onClick={()=> {setIsFWNRA(!isFWNRA)}}>SEE ALL</button></h2>
      }
      <div className={`${classes.cardcontainer}${isFWNRA ? 'classes.flexwrap':''}`}>
        {newReleaseAlbums.map((album) => (
          <Link to={`/album/${album.id}`}>
            <Card key={album.id} data={album}/>
          </Link>
        ))}
      </div>
      {
        featuredPlaylist.length > 0 && <h2>Featured Playlists<button onClick={()=> {setIsFWFP(!isFWFP)}}>SEE ALL</button></h2>
      }
      <div className={`${classes.cardcontainer}${isFWFP ? 'classes.flexwrap':''}`}>
        {featuredPlaylist.map((playlist) => (
          <Link 
            to={{
              pathname: `/playlist/${playlist.id}`,
              state: {playlistname: playlist.title, playlistimageurl: playlist.imageUrl}
            }}>
            <Card key={playlist.id} data={playlist}/>
          </Link>
        ))}
      </div>
    </div>
  )
}

export default Home
