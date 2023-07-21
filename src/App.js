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

function App() {
  return (
    <div className="">
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='aboutus' element={<AboutUs />} />
        <Route path='settings' element={<Settings />} />
        <Route index  element={<Home />} />
        <Route path='play'  element={<Mode />} >
          <Route path='double'  element={<Multi/>}/>
          <Route path='double/roomId/:roomId'  element={<Double/>}/>
          <Route path='challenge'  element={<Challenge/>}/>
          <Route path='demo'  element={<Demo/>}/>
          <Route path='tournament'  element={<Tournament/>}/>
        </Route>
        <Route
          path='menu'
          element={<Game />} />
      </Routes>
    </div>
  );
}

export default App;
