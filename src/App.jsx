import { Routes, Route } from 'react-router-dom';
import './App.css';
import Home from './pages/Home';
import Mode from './pages/Mode';
import Multi from './menu/Multiplayer'
import { Demo } from './menu/Demo';
import Double from './mode/Double';
import DragDrop from './menu/DragDrop';
import io from "socket.io-client";
import { useState } from 'react';
import Quick from './menu/Quick';

const socket = io.connect("http://localhost:5000");

function App() {
  const [name, setName] = useState("name");
  return (
    <div className="">
      <Routes>
        <Route index element={<Home />} />
        <Route path='play' element={<Mode />}>
          <Route path='quick' element={<Quick />} />
          <Route path='drag-drop' element={<DragDrop />} />
          <Route path='double' element={<Multi socket={socket} setName={setName} name={name} />} />
          <Route path='double/roomId/:roomId' element={<Double socket={socket} setName={setName} name={name} />} />
          <Route path='demo' element={<Demo />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
