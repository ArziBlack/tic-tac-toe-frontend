import { Routes, Route } from 'react-router-dom';
import './App.css';
import Game from './pages/Game';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AboutUs from './pages/AboutUs';
import Settings from './pages/Settings';
import Home from './pages/Home';
import Mode from './pages/Mode';
import Multi from './menu/Multiplayer'
import { Challenge } from './menu/Challenge';
import { Demo } from './menu/Demo';
import Tournament from './menu/Tornament'
import Double from './mode/Double';
import io from "socket.io-client";
import { useEffect, useState } from 'react';
import DoublePlayer from './games/DoublePlayer';
import Quick from './menu/Quick';

const socket = io.connect("http://localhost:5000");

function App() {
  // useEffect(()=>{
  //   socket
  // },[socket])
  const [name, setName] = useState("name");
  return (
    <div className="">
      <Routes>
        <Route path='login' element={<Login />} /> 
        <Route path='signup' element={<SignUp />} />
        <Route path='aboutus' element={<AboutUs />} />
        <Route path='settings' element={<Settings />} />
        <Route index  element={<Home />} />
        <Route path='play'  element={<Mode />} >
          <Route path='quick'  element={<Quick socket={socket} setName={setName} name={name}/>}/>
          <Route path='double'  element={<Multi socket={socket} setName={setName} name={name}/>}/>
          <Route path='double/roomId/:roomId'  element={<Double socket={socket} setName={setName} name={name}/>}/>
          <Route path='challenge'  element={<Challenge/>}/>
          <Route path='demo'  element={<Demo/>}/>
          <Route path='tournament'  element={<Tournament/>}/>
        </Route>
        <Route
          path='menu'
          element={<Game />} />
        <Route
          path='test'
          element={<DoublePlayer />} />
      </Routes>
    </div>
  );
}

export default App;
