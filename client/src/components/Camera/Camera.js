import React, { useState, useRef, useEffect } from 'react';
import classes from './Camera.module.css';
import { useLocation } from 'react-router-dom';
import TopNav from '../TopNav/TopNav';

const Camera = () => {
    const [imageDataURL, setImageDataURL] = useState(null);
    const videoRef = useRef(null);
    const canvasRef = useRef(null);
    const location = useLocation();

    useEffect(() => {
        startCamera();
        return () => {
            stopCamera();
        };
    }, [location.pathname]);

    const startCamera = () => {
        navigator.mediaDevices.getUserMedia({ video: true })
        .then(stream => {
            videoRef.current.srcObject = stream;
            videoRef.current.onloadedmetadata = () => {
                videoRef.current.play();
            };
        })
        .catch(error => console.error('Error accessing camera:', error));
    };

    const stopCamera = () => {
        const video = videoRef.current;
        if (video && video.srcObject) {
            const stream = video.srcObject;
            const tracks = stream.getTracks();
            tracks.forEach(track => track.stop());
        }
    };

    const takePicture = () => {
        const video = videoRef.current;
        const canvas = canvasRef.current;
        const context = canvas.getContext('2d');
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        setImageDataURL(canvas.toDataURL('image/jpeg'));
        stopCamera();
    };

    const retakePicture = () => {
        setImageDataURL(null);
        startCamera(); // Restart the camera
    };

    const uploadImage = async () => {
        const data = {
            file: imageDataURL,
            filename: 'example.jpg',
        }
        try {
            const response = await fetch('http://localhost:5000/mood', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            if (response.ok) {
                const data = await response.json();
                // console.log('Image uploaded successfully.');
                console.log(data);
            } else {
                console.error('Failed to upload image:', response.statusText);
            }
        } catch (error) {
            console.error('Error uploading image:', error);
        }
    };

    return (
        <div>
            <TopNav/>
            <div className={classes.cameracomponent}>
                {imageDataURL ? (
                    <div className={classes.container}>
                        <img src={imageDataURL} alt="Captured" className={classes.image}/>
                        <div className={classes.btn}>
                            <button onClick={uploadImage}>Upload</button>
                            <button onClick={retakePicture}>Retake</button>
                        </div>
                    </div>
                ) : (
                    <div className={classes.container}>
                        <video ref={videoRef} autoPlay className={classes.image}></video>
                        <canvas ref={canvasRef} style={{ display: 'none' }}></canvas>
                        <div className={classes.btn}>
                            <button onClick={takePicture}>Take Picture</button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Camera;
