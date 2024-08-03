import React from "react";
import classes from './Login.module.css';
import logo from '../../assests/playlist_image.png';
import { useState } from "react";
import { Link } from "react-router-dom";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import { useUserContext } from "../../Context/UserContext";

const Login = () => {
    const [userid, setUserId] = useState("");
    const [password, setPassword] = useState("");
    const [errorMessage, setErrorMessage] = useState("");
    const [errorType, setErrorType] = useState("");
    const [showMessage, setShowMessage] = useState(false);
    const navigate = useNavigate();
    const { isLogin, handleLogin } = useUserContext();

    const idChangeHandler = (event) => {
        setUserId(event.target.value);
    } 
    const passwordChangeHandler = (event) => {
        setPassword(event.target.value);
    }

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('http://localhost:8080/auth/login', {
            method: 'POST',
            body: JSON.stringify({userid, password}),
            headers: { 'Content-Type' : 'application/json'},
            credentials: 'include',
        });
        // console.log(response);
        const data = await response.json();
        if(response.ok){
            alert(data.message);
            // console.log(data.session_token);
            const expirationTime = new Date(new Date().getTime() + 60 * 60 * 1000); 
            const currentTime = new Date().getTime();
            const expirationTime2 = new Date(currentTime + 3600000); 
            // Cookies.set('session-token', data.session_token, { expires: expirationTime });
            // Cookies.set('session-token-expiration', expirationTime2.getTime());
            Cookies.set('session-token', JSON.stringify({ value : data.session_token , expiryTime : expirationTime2.getTime() }), {
                expires : expirationTime,
            })
            handleLogin();
            navigate('/');
        }
        else{
            window.scrollTo({ top: 0, behavior: 'smooth'});
            setErrorType(data.type);
            setErrorMessage(data.message);
            setShowMessage(true);
        }
    }

    // function of signup with third party
    
    const loginWithGoogle = async () => {
        // console.log("Inside signup with google");
        window.open('http://localhost:8080/auth/google/callback', '_self');
        
        // const response = await fetch('/session');
        // console.log(response);
        // const data = response.json();
        // props.loginChangeHandler();
        // console.log(data);
    }
    return (
        <div className={classes.logincomponent}>
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
        
        <div className={classes.logincontainer}>
            <div className={classes.name}>
                <img src={logo}></img><span className={classes.companyname}>aquavista</span>
            </div>
            <div className={classes.loginoptions}><button onClick={loginWithGoogle}><i class="bi bi-google"></i><span>Login with google</span></button></div>
            <div className={classes.partation}><div className={classes.side}></div><span>OR</span><div className={classes.side}></div></div>
            <form method="POST" onSubmit={handleSubmit} className={classes.form}>
                <div className={classes.field}>
                    <div><input type="text" name="userid" placeholder="Phone number or email" onChange={idChangeHandler}/></div>
                </div>
                <div className={classes.field}>
                    <div><input type="password" name="password" placeholder="Password" onChange={passwordChangeHandler}/></div>
                </div>
                <div className={classes.btn}>
                    <button type="submit" className={classes.loginbutton}>Log in</button>
                </div>
            </form>
            <p>Don't have an account ? <Link to="/signup" style={{textDecoration:'none'}}><span>Sign up</span></Link></p>
        </div>
        </div>

    )
};

export default Login;
