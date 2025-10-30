import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Mode from './pages/Mode';
import Multi from './menu/Multiplayer';
import Double from './mode/Double';
import DragDrop from './menu/DragDrop';
import Quick from './menu/Quick';
import Tournament from './menu/Tournament';
import Invite from './menu/Invite';
import socketService from './services/socketService';
import { useState, useEffect } from 'react';

function App() {
  const [name, setName] = useState("name");

  useEffect(() => {
    // Initialize socket connection
    socketService.connect();

    return () => {
      // Cleanup on unmount
      socketService.disconnect();
    };
  }, []);

  return (
    <div className="">
      <Routes>
        <Route index element={<Home />} />
        <Route path='play' element={<Mode />}>
          <Route path='quick' element={<Quick />} />
          <Route path='drag-drop' element={<DragDrop />} />
          <Route path='invite' element={<Invite />} />
          <Route path='tournament' element={<Tournament />} />
          <Route path='double' element={<Multi socket={socketService.getSocket()} setName={setName} name={name} />} />
          <Route path='double/roomId/:roomId' element={<Double socket={socketService.getSocket()} setName={setName} name={name} />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
