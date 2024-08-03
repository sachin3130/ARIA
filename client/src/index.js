import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import { UserProvider } from './Context/UserContext';
import { ProfileProvider } from './Context/ProfileContext';
import { PlaylistFormProvider } from './Context/PlaylistFormContext';
import { SideBarToggleProvider } from './Context/SideBarToggleContext';
import { PlayerProvider } from './Context/PlayerContext';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <UserProvider>
      <ProfileProvider>
        <PlaylistFormProvider>
          <SideBarToggleProvider>
            <PlayerProvider>
              <App />
            </PlayerProvider>
          </SideBarToggleProvider>
        </PlaylistFormProvider>
      </ProfileProvider>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
