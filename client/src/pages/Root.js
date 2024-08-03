import React, { useEffect, useState } from 'react'
import SideBar from '../components/Sidebar/SideBar';
import Maincontent from '../components/Maincontent/Maincontent';
import classes from './Root.module.css';
import { useNavigate } from 'react-router-dom';
import Cookies from 'js-cookie';
import { useUserContext } from '../Context/UserContext';
import { usePlayerContext } from '../Context/PlayerContext';
import Player from '../components/Player/Player';
import CurrentTrack from '../components/CurrentTrack/CurrentTrack';

const Root = () => {
  const [token, setToken] = useState("");
  const navigate = useNavigate();
  const { handleLogout, handleSessionCard, handleAuthorization } = useUserContext();
  const { showPlayer, showPlayerPage } = usePlayerContext();
  const getParamsFromHash = (hash) => {
    const hashContent = hash.substr(1);
    const paramsSplit = hashContent.split('&');
    let params = {};
    let values = [];
    paramsSplit.forEach((param) => {
      values = param.split('=');
      params[values[0]] = values[1];
    });
    return params;
  }
//   useEffect(() => {
//     setToken(localStorage.getItem('token'));
//   },[token]);
  // useEffect(() => {
  //   if(window.location.hash){
  //     const hash = window.location.hash;
  //     const tokens = getParamsFromHash(hash);
  //     localStorage.setItem('token',tokens.access_token);
  //     setToken(tokens.access_token);
  //     window.history.pushState({},null,'/home');
  //   }

  // }, []);
  
  // useEffect(() => {
  //   if(!Cookies.get('isAuthorise')){
  //     // const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000);
  //     const expirationTime = new Date(new Date().getTime() + 20 * 60 * 1000); 
  //     const currentTime = new Date().getTime();
  //     const expirationTime2 = new Date(currentTime + 1200000); // 20 seconds from now
  //     Cookies.set('authoriseexpireTime', expirationTime2.getTime());
  //     Cookies.set('isAuthorise',true,{ expires: expirationTime });
  //     console.log("isAuthorise set");
  //     window.location.href = `${process.env.REACT_APP_API}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scopes=${process.env.REACT_APP_SCOPE}&response_type=token&show_dialog=true`;
  //   }

  //   if(!Cookies.get('token')){
  //     if(window.location.hash){
  //       const hash = window.location.hash;
  //       const tokens = getParamsFromHash(hash);
  //       const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000);
  //       Cookies.set('token',tokens.access_token,{ expires: expirationTime });
  //       setToken(tokens.access_token);
  //       const redirectPath = Cookies.get('redirectPath'); // Retrieve stored path
  //       if (redirectPath) {
  //           window.location.href = redirectPath; // Redirect to stored path
  //       } else {
  //           window.history.pushState({}, null, '/');
  //       }
  //       // window.history.pushState({},null,'/');
  //     }
  //   }
    
  // }, [Cookies.get('isAuthorise')])
//   useEffect(() => {
//     const intervalId = setInterval(() => {
//         const currentTime = new Date().getTime();
//         const expirationTime = parseInt(Cookies.get('authoriseexpireTime'));
//         if (expirationTime - currentTime <= 0) {
//             console.log("isAuthorise expired");
//             clearInterval(intervalId); // Clear the interval
//             Cookies.remove('isAuthorise');
//             Cookies.remove('token');
//             const currentPath = window.location.pathname;
//             console.log(currentPath);
//             Cookies.set('redirectPath', currentPath);
//             navigate('/');
//         }
//     }, 1000);

//     // Clean up the interval when the component unmounts
//     return () => clearInterval(intervalId);
// }, []); // Empty dependency array ensures this effect runs only once

// useEffect(() => {

//   // Function to check cookie expiration
//   function checkCookieExpiration() {
//     const sessionToken = Cookies.get('session-token');
//     const expirationTime = Cookies.get('session-token-expiration');
//     if (sessionToken && expirationTime) {
//         const currentTime = new Date().getTime();
//         const expirationTime2 = parseInt(expirationTime);
//         const remainingTime = expirationTime2 - currentTime;
//         console.log(expirationTime2+" "+currentTime);
//         if (remainingTime > 0) {
//           setTimeout(() => {
//             // Trigger action when cookie expires
//             // console.log("Cookie has expired");
//             Cookies.remove('session-token');
//             Cookies.remove('session-token-expiration');
//             handleLogout();
//           }, remainingTime);
//         } else {
//           // console.log("Cookie has already expired");
//           handleLogout();
//           Cookies.remove('session-token');
//           Cookies.remove('session-token-expiration');
//         }
//       } else{
//         handleLogout();
//         // console.log("Cookie does not exist");
//       }
//   }

//   // Call checkCookieExpiration when the component mounts
//   checkCookieExpiration();

// }, [Cookies.get('session-token')]);


useEffect(() => {
  if(!Cookies.get('token')){
    if(window.location.hash){
      const hash = window.location.hash;
      const tokens = getParamsFromHash(hash);
      const expirationTime = new Date(new Date().getTime() + 50 * 60 * 1000);
      Cookies.set('token',tokens.access_token,{ expires: expirationTime });
      handleAuthorization(false);
      // setToken(tokens.access_token);
      // const redirectPath = Cookies.get('redirectPath'); // Retrieve stored path
      // if (redirectPath) {
          // window.location.href = redirectPath; // Redirect to stored path
      // } else {
          window.history.pushState({}, null, '/');
      // }
      // window.history.pushState({},null,'/');
    }
  }
  
}, [])

const value = Cookies.get('session-token');
if(value){
    const expiryTime = parseInt(JSON.parse(value).expiryTime);
    const currentTime = parseInt(new Date().getTime());
    console.log(expiryTime-currentTime);
    setTimeout(() => {
      console.log("session expired");
      handleLogout();
      handleSessionCard(true);
    }, (expiryTime - currentTime));
} 


console.log("Root.js "+new Date().getTime());
const mainStyle = {
  height: showPlayer ? '90vh' : '100vh',
};

  return (
    <>
      {!showPlayerPage?
        <>
          <div className={classes.main} style={mainStyle}>
            <SideBar/>
            <Maincontent/>
          </div>
          <div className={classes.player}>
            {showPlayer && <Player/>}
          </div>
        </>:
        <CurrentTrack/>
      }
    </>
  )
}

export default Root
