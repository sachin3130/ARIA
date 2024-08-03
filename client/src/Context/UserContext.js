import React, { createContext, useContext, useState, useEffect } from 'react';
import Cookies from 'js-cookie';

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

export const UserProvider = ({ children }) => {
  // const [isLogin, setIsLogin] = useState(() => {
  //   // Initialize from local storage or default to false if not found
  //   const storedIsLogin = localStorage.getItem('isLogin');
  //   return storedIsLogin ? JSON.parse(storedIsLogin) : false;
  // });
  const [isLogin, setIsLogin] = useState(()=>{
    return Cookies.get('session-token') ? true:false;
  })

  const [isauthorise, setIsAuthorise] = useState(()=>{
    return Cookies.get('token') ? true:false;
  })
  
  const [showSessionCard, setShowSessionCard] = useState(false);

  const [showAuthorizationCard, setShowAuthorizationCard] = useState(false);
  // useEffect(() => {
  //   // Update local storage when isLogin changes
  //   localStorage.setItem('isLogin', JSON.stringify(isLogin));
  // }, [isLogin]);
  
  // useEffect(() => {
  //   // Update isLogin state when local storage changes
  //   const handleStorageChange = () => {
  //     const storedIsLogin = localStorage.getItem('isLogin');
  //     setIsLogin(storedIsLogin ? JSON.parse(storedIsLogin) : false);
  //   };
  
  //   // Add event listener for storage change
  //   window.addEventListener('storage', handleStorageChange);
  
  //   // Cleanup function to remove event listener
  //   return () => {
  //     window.removeEventListener('storage', handleStorageChange);
  //   };
  // }, []);
  useEffect(() => {
    // Update 'isLogin' state when 'session-token' cookie changes
    const handleCookieChange = () => {
      const sessionToken = Cookies.get('session-token');
      setIsLogin(sessionToken ? true : false);
    };

    // Check initially
    handleCookieChange();

    // Add event listener for cookie change
    window.addEventListener('storage', handleCookieChange);

    // Cleanup function to remove event listener
    return () => {
      window.removeEventListener('storage', handleCookieChange);
    };
  }, []);
  const handleLogin = () => {
    setIsLogin(true);
  }
  const handleLogout = () => {
    Cookies.remove('session-token');
    setIsLogin(false);
  }
  const handleSessionCard = (value) => {
    setShowSessionCard(value);
  }

  const handleAuthorization = (value) =>{
    setShowAuthorizationCard(value);
  }

  return (
    <UserContext.Provider value={{ isLogin, showSessionCard, showAuthorizationCard, handleLogin, handleLogout, handleSessionCard, handleAuthorization }}>
      {children}
    </UserContext.Provider>
  );
}