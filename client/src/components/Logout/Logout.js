import React from 'react'
import classes from './Logout.module.css';
import { Link } from 'react-router-dom';
import { useUserContext } from '../../Context/UserContext';

const Logout = () => {
  const { handleSessionCard } = useUserContext();
  return (
    <div className={classes.logoutcontainer}>
      <h1>Your session has expired</h1>
      <p>Please log in again to continue using the app.</p>
      <div className={classes.btn}>
        <Link to="/login" className={classes.link} onClick={()=>handleSessionCard(false)}>Login</Link>
      </div>
    </div>
  )
}

export default Logout
