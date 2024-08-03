import React from 'react'
import classes from './SideBar.module.css';
import SidebarNav from '../Sidebar-nav/SidebarNav';
import SidebarLibrary from '../Sidebar-library/SidebarLibrary';
import { useSideBarToggleContext } from '../../Context/SideBarToggleContext';

const SideBar = () => {
  const { showSideBar } = useSideBarToggleContext();
  return (
    <div className={`${classes.sidebar} ${showSideBar ? classes.active : ''}`}>
        <SidebarNav/>
        <SidebarLibrary/>
    </div>
  )
}

export default SideBar
