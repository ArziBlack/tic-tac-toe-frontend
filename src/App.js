import { Routes, Route } from 'react-router-dom';
import './App.css';
import Game from './pages/Game';
import Login from './pages/Login';
import SignUp from './pages/SignUp';
import AboutUs from './pages/AboutUs';
import Settings from './pages/Settings';
import Dashboard from './pages/Dashboard';
import Home from './pages/Home';

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path='login' element={<Login />} />
        <Route path='signup' element={<SignUp />} />
        <Route path='aboutus' element={<AboutUs />} />
        <Route path='settings' element={<Settings />} />
        <Route index  element={<Home />} />
        <Route
          path='demo'
          element={<Game />} />
      </Routes>
      {/* <Game/> */}
    </div>
  );
}

export default App;
