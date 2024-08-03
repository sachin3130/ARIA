import React, { useState, useEffect, useRef } from 'react'
import classes from './TopNav.module.css';
import user from '../../assests/non-user.png';
import { Link } from 'react-router-dom';
import { useProfileContext } from '../../Context/ProfileContext';
import { useUserContext } from '../../Context/UserContext';
import { useSideBarToggleContext } from '../../Context/SideBarToggleContext';
import Cookies from 'js-cookie';


const TopNav = (props) => {
  const [showDropDown, setShowDropDown] = useState(false);
  const { profileName, profileImage, handleProfileChange, handleShowProfile } = useProfileContext();
  const { isLogin, handleLogout, handleSessionCard } = useUserContext();
  const { setShowSideBar } = useSideBarToggleContext();
  const containerRef1 = useRef(null);
  const containerRef2 = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Close the PlaylistForm only if it's currently shown and the click occurred outside of it
      if (showDropDown && containerRef1.current && containerRef2.current && !containerRef1.current.contains(event.target) && !containerRef2.current.contains(event.target)) {
        setShowDropDown(!showDropDown);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showDropDown, setShowDropDown]);


  useEffect(()=>{
    const getProfile = async ()=>{
      try{
        const value = Cookies.get('session-token');
        let token = '';
        if(value) token = JSON.parse(value).value;
  
        const response = await fetch('http://localhost:8080/profile', {
          method: "GET",
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if(response.ok){
          const data = await response.json();
          handleProfileChange(data.fullname,data.imageUrl);
        } else{
          if(response.status === 402){
              handleSessionCard(true);
          }
      }
      }catch(error){
        console.log("Profile is not fetched");
      }
    }
    if(isLogin) getProfile();
  },[]);
  if(!isLogin) handleProfileChange("","");

  const getImage = (image) => {
    if(image) return `http://localhost:8080/default/${image}`;
    return user;
  }
  return (
    <div className={classes.stickynav} style={{backgroundColor: props.backgroundColor}}>
      <div className={classes.navbartoggle} id="menu">
        <button id="menutoggle" onClick={() => setShowSideBar(prevState => !prevState)}><i class="bi bi-toggles"></i></button>
      </div>
      <div className={classes.navbaruser} onClick={() => setShowDropDown(!showDropDown)} title={profileName} ref={containerRef2}>
        <img src={getImage(profileImage)} alt="user"></img>
      </div>
      {
        showDropDown && 
        <div id="myDropdown" className={classes.dropdowncontent} ref={containerRef1}>
            {isLogin && <button onClick={()=>{handleShowProfile();setShowDropDown(false)}}>Profile</button>}
            {!isLogin && <Link to="/login" className={classes.link}>Login</Link>}
            {!isLogin && <Link to="/signup" className={classes.link}>Signup</Link>}
            {isLogin && <button onClick={()=>{handleLogout(); setShowDropDown(false)}}>Logout</button>}
      </div> 
      }
    </div>
  )
}

export default TopNav
