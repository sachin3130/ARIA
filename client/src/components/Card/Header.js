import React, { useState, useEffect } from 'react'
import classes from './Header.module.css';
import image from '../../assests/blank_image.png';
import { ColorExtractor } from 'react-color-extractor';

const Header = ({name, imageUrl}) => {
  const [colors, setColors] = useState([]);
  const [gradient, setGradient] = useState(null);
  useEffect(() => {
    const getColors = (colors) => {
      setColors(colors);
      const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`
      };
      setGradient(gradientStyle);
    };
    // Extract colors only when imageUrl changes
    if (imageUrl) {
      setColors([]); // Reset colors before extraction
      // Perform color extraction
      // You may need to debounce this function if it's being called too frequently
    }

  }, [imageUrl]); // Trigger useEffect whenever imageUrl changes
    const getColors = (colors) => {
      setColors((prevColors) => [...prevColors, ...colors]);
      const gradientStyle = {
        backgroundImage: `linear-gradient(to right, ${colors.join(', ')})`
      };
      setGradient(gradientStyle);
    };
  return (
    <>
      <ColorExtractor getColors={getColors}>
        <img src={imageUrl} style={{display:'none'}}></img>
      </ColorExtractor>
        <div className={classes.header} style={gradient}>
            <div className={classes.image}>
                <img src={imageUrl || image}></img>
            </div>
            <div className={classes.name}><p>{name}</p></div>
        </div>
    </>
  )
}

export default Header
