import React, { useState } from "react";
import classes from './Signup.module.css';
import logo from '../../assests/playlist_image.png';
import { Link, useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import { useUserContext } from "../../Context/UserContext";


const Signup = () => {
    const [userid, setUserId] = useState("");
    const [fullname, setFullName] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const { isLogin, handleLogin } = useUserContext();

    const idChangeHandler = (event) => {
        setUserId(event.target.value);
    } 
    const fullnameChangeHandler = (event) => {
        setFullName(event.target.value);
    }
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/auth/signup', {
            method: 'POST',
            body: JSON.stringify({userid, fullname, password}),
            headers: { 'Content-Type': 'application/json' },
        });
        // console.log(response);
        const data = await response.json();
        if(response.ok){
            alert(data.message);
            const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000); 
            const currentTime = new Date().getTime();
            const expirationTime2 = new Date(currentTime +3600000); 
            // Cookies.set('session-token', data.session_token, { expires: expirationTime });
            // Cookies.set('session-token-expiration', expirationTime2.getTime());
            Cookies.set('session-token', JSON.stringify({ value : data.session_token , expiryTime : expirationTime2.getTime() }), {
                expires : expirationTime,
            })
            handleLogin();
            navigate('/');
            // localStorage.setItem('userid', userid);
        }
        else {
            window.scrollTo({ top: 0, behavior: 'smooth'});
            setErrorType(data.type);
            setErrorMessage(data.message);
            setShowMessage(true);
        }
    }

    // function of signup with third party
    
    const signupWithGoogle = () => {
        // console.log("Inside signup with google");
        window.open('http://localhost:8080/auth/google/callback', '_self');
    }
    return (
        <div className={classes.signupcomponent}>
            {
                showMessage && (
                <div className={classes.errorcontainer}>
                    <h1>{errorType}</h1>
                    <p>{errorMessage}</p>
                    <hr></hr>
                    <button onClick={() => setShowMessage(false)}>OK</button>
                </div>
                )
            }
            <div className={classes.signupcontainer}>
            <div className={classes.name}><img src={logo}></img><span className={classes.companyname}>aquavista</span></div>
            <div className={classes.signupoptions}><button onClick={signupWithGoogle}><i class="bi bi-google"></i><span>Login with google</span></button></div>
            <hr />
            <form method="POST" onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.field}>
                    <div><input type="text" name="userid" className={classes.inp} placeholder="Mobile Number or email" onChange={idChangeHandler}/></div>
                </div>
                <div className={classes.field}>
                    <div><input type="text" name="fullname" className={classes.inp} placeholder="Full Name" onChange={fullnameChangeHandler}/></div>
                </div>
                <div className={classes.field}>
                    <div><input type="password" name="password" className={classes.inp} placeholder="Password" onChange={passwordChangeHandler}/></div>
                </div>
                <div className={classes.btn}>
                    <button type="submit" className={classes.loginbutton}>Sign up</button>
                </div>
            </form>
            <p>Already have an account ?<Link to="/login" style={{textDecoration:'none'}}><span>Log in</span></Link></p>
        </div>
        </div>
        
    )
};

export default Signup;
