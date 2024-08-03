import React from 'react'
import classes from './SpotifyToken.module.css';
import { useUserContext } from '../../Context/UserContext';

const SpotifyToken = () => {
  const { handleAuthorization } = useUserContext();

    const handleClick = () => {
        handleAuthorization(false);
        window.location.href = `${process.env.REACT_APP_API}?client_id=${process.env.REACT_APP_CLIENT_ID}&redirect_uri=${process.env.REACT_APP_REDIRECT_URI}&scopes=${process.env.REACT_APP_SCOPE}&response_type=token&show_dialog=true`;
        }
  return (
    <div>
      <div className={classes.tokencontainer}>
      <h1>Your spotify token has expired</h1>
      <p>Please authorise again to continue using the app.</p>
      <div className={classes.btn}>
        <button onClick={handleClick}>Continue</button>
      </div>
    </div>
    </div>
  )
}

export default SpotifyToken
