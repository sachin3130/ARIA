import React from 'react'
import classes from './SidebarNav.module.css';
import { Link } from 'react-router-dom';

const SidebarNav = () => {
  return (
    <div className={classes.nav}>
      <div className={classes.navoption}>
      <i class="bi bi-house-door-fill"></i>
        <Link className={classes.link} to="/">Home</Link>
      </div>
      <div className={classes.navoption} id="search">
        <i class="bi bi-search"></i>
        <Link className={classes.link} to="/search">Search</Link>
      </div>
    </div>
  )
}

export default SidebarNav
