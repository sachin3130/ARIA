import React, { createContext, useContext, useState } from 'react';

const SideBarToggleContext = createContext();

export const useSideBarToggleContext = () => useContext(SideBarToggleContext);

export const SideBarToggleProvider = ({ children }) => {
  const [showSideBar, setShowSideBar] = useState(false);

  return (
    <SideBarToggleContext.Provider value={{ showSideBar, setShowSideBar }}>
      {children}
    </SideBarToggleContext.Provider>
  );
};
