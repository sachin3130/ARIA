import { Profiler, useEffect } from 'react';
import Album from './components/Album/Album';
import Artist from './components/Artist/Artist';
import Home from './components/Home/Home';
import Login from './components/Login/Login';
import Playlist from './components/Playlist/Playlist';
import Search from './components/Search/Search';
import SearchResult from './components/Search/SearchResult';
import Signup from './components/Signup/Signup';
import Track from './components/Track/Track';
import Profile from './components/Profile/Profile';
import Root from './pages/Root';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import Cookies from 'js-cookie';
import UserPlaylist from './components/UserPlaylist/UserPlaylist';
import LikedSongs from './components/LikedSongs/LikedSongs';
import Camera from './components/Camera/Camera';
import CurrentTrack from './components/CurrentTrack/CurrentTrack';


function App() {
  
  const router = createBrowserRouter([
    {
      path: '/',
      element: <Root/>,
      children: [
        { path: '/', element: <Home/>},
        { path: '/search', element: <Search/>},
        { path: '/album/:albumId', element: <Album/>},
        { path: '/playlist/:playlistId', element: <Playlist/>},
        { path: '/track/:trackId', element: <Track/>},
        { path: '/search/:query', element: <SearchResult/>},
        { path: '/artist/:artistId', element: <Artist/>},
        { path: '/login', element: <Login/>},
        { path: '/signup', element: <Signup/>},
        { path: '/profile', element: <Profile/>},
        { path: '/userPlaylist/:playlistId', element: <UserPlaylist/>},
        { path: '/likedSongs', element: <LikedSongs/>},
        { path: '/camera', element: <Camera/>},
      ]
    }
  ])
  console.log("App.js"+new Date().getTime());
  return (
    <RouterProvider router={router} />    
  );
}

export default App;
