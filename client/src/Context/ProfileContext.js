import React, { createContext, useContext, useState } from 'react';

const ProfileContext = createContext();

export const useProfileContext = () => useContext(ProfileContext);

export const ProfileProvider = ({ children }) => {
  const [showProfile, setShowProfile] = useState(false);
  const [profileName, setProfileName] = useState("");
  const [profileImage, setProfileImage] = useState("");

  const handleProfileChange = (name, image) => {
    setProfileName(name);
    setProfileImage(image);
  }
  const handleShowProfile = () => {
    setShowProfile(true);
  }
  const handleCloseProfile = () => {
    setShowProfile(false);
  }

  return (
    <ProfileContext.Provider value={{ showProfile, profileName, profileImage, handleProfileChange, handleShowProfile, handleCloseProfile }}>
      {children}
    </ProfileContext.Provider>
  );
}