import React, { useState } from 'react'
import classes from './PlaylistForm.module.css';
import logo from '../../assests/playlist_image.png';
import { usePlaylistFormContext } from '../../Context/PlaylistFormContext';
import { useUserContext } from '../../Context/UserContext';
import Cookies from 'js-cookie';

const PlaylistForm = () => {
    const { handleClosePlaylistForm, handleAddPlaylist } = usePlaylistFormContext();
    const [playlistName, setPlaylistName] = useState("Playlist")
    const [playlistImage, setPlaylistImage] = useState("");
    const [selectedImage, setSelectedImage] = useState(logo);
    const { handleSessionCard } = useUserContext();

    const handleImageChange = (event) => {
      const file = event.target.files[0];
      if (file) {
        setPlaylistImage(file);
        const reader = new FileReader();
        reader.onloadend = () => {
          setSelectedImage(reader.result);
        };
        reader.readAsDataURL(file);
      }
    };

    const handleSubmit = async (event) => {
      event.preventDefault();
      const formData = new FormData();
      formData.append("name",playlistName);
      formData.append("image",playlistImage);
      try{
        const value = Cookies.get('session-token');
        let token = '';
        if(value) token = JSON.parse(value).value;

        const response = await fetch('http://localhost:8080/createPlaylist', {
          method: "POST",
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if(response.ok){
          const data = await response.json();
          console.log("Playlist created");
          setPlaylistName("Playlist");
          setPlaylistImage("");
          setSelectedImage(logo);
          // console.log(data.playlist);
          handleAddPlaylist(data.playlist)
          handleClosePlaylistForm();
        } else{
          if(response.status === 402){
              handleSessionCard(true);
          }
      }
      }catch(error){
        console.log("Playlist is not created");
      }
    }
  return (
    <div className={classes.playlistformcontainer}>
        <div className={classes.heading}>Create Playlist<i class="bi bi-x" onClick={handleClosePlaylistForm}></i></div>
        <div className={classes.playlist}>
            <div className={classes.image}>
                <img src={selectedImage}></img>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={classes.icon}>
                    <div><i class="bi bi-pencil-square"></i></div>
                    <div><label htmlFor="image">Choose photo</label></div>
                    <input type='file' id="image" name="image" style={{display:'none'}} onChange={handleImageChange}></input>
                </div>
                <div className={classes.form}>
                    <div className={classes.field}>
                        <div><input type="text" name="name" value={playlistName} onChange={(event)=>setPlaylistName(event.target.value)}/></div>
                    </div>
                    <div className={classes.btn}>
                        <button type="submit">Save</button>
                    </div>
                </div>
            </form>
        </div>
    </div>
  )
}

export default PlaylistForm
