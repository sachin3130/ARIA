import React, { useState, useRef } from 'react'
import classes from './Profile.module.css';
import logo from '../../assests/liked_song.jpeg';
import user from '../../assests/non-user.png';
import { useProfileContext } from '../../Context/ProfileContext';
import { useUserContext } from '../../Context/UserContext';
import Cookies from 'js-cookie';

const Profile = () => {
  const { profileName, profileImage, handleProfileChange, handleCloseProfile } = useProfileContext(); 
  const { handleSessionCard } = useUserContext();
  const [selectedImage, setSelectedImage] = useState(profileImage? `http://localhost:8080/default/${profileImage}`:user);
  const [name, setName] = useState(profileName);
  const [image, setImage] = useState("");
  const fileInputRef = useRef(null);

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setSelectedImage(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  const handleRemovePhoto = ()=>{
    setSelectedImage(user);
    setImage("");
    fileInputRef.current.value = null;
  }
  const handleSubmit = async (event) =>{
    event.preventDefault();
      const formData = new FormData();
      formData.append("name",name);
      formData.append("image",image);
      if(selectedImage == user) formData.append("isRemovePhoto",true);
      else formData.append("isRemovePhoto",false);
      try{
        const value = Cookies.get('session-token');
        let token = '';
        if(value) token = JSON.parse(value).value;

        const response = await fetch('http://localhost:8080/profile', {
          method: "PUT",
          body: formData,
          headers: {
            'Authorization': `Bearer ${token}`,
          }
        });
        if(response.ok){
          const data = await response.json();
          console.log("Profile updated");
          handleProfileChange(data.fullname,data.imageUrl);
          handleCloseProfile();
          // handleAddPlaylist(data.playlist)
          // handleClosePlaylistForm();
        } else{
          if(response.status === 402){
              handleSessionCard(true);
          }
      }
      }catch(error){
        console.log("Profile is not updated");
      }
  }
  return (
    <div className={classes.profilecontainer}>
        <div className={classes.heading}>Profile details<i class="bi bi-x" onClick={handleCloseProfile}></i></div>
        <div className={classes.profile}>
            <div className={classes.image}>
                <img src={selectedImage}></img>
            </div>
            <form onSubmit={handleSubmit}>
                <div className={classes.icon}>
                  <div><label htmlFor="image">Choose photo</label></div>
                    <div><i class="bi bi-pencil-square"></i></div>
                    <div><span onClick={handleRemovePhoto}>Remove photo</span></div>
                    <input type='file' id="image" name="image" style={{display:'none'}} onChange={handleImageChange} ref={fileInputRef}></input>
                </div>
                <div className={classes.form}>
                    <div className={classes.field}>
                        <div><input type="text" name="name" value={name} onChange={(e)=>setName(e.target.value)}/></div>
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

export default Profile
