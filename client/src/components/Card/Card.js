import React from 'react'
import classes from './Card.module.css';
import image from '../../assests/liked_song.jpeg';
import blank from '../../assests/blank_image.png';

const Card = ({data, isArtist = false, isCategory = false}) => {
  return (
    <div className={classes.card}>
        <img className={classes.cardimg} style={isArtist ? { borderRadius: '50%' } : {}} src={data.imageUrl || blank}></img>
        <p className={classes.cardtitle}>{data.title}</p>
        {!isCategory && <p className={classes.cardinfo}>{data.info}</p>}
    </div>
  )
}

export default Card
