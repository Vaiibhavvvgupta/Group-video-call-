import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VideoCallRoom from './components/VideoCallRoom';
import VoiceController from './components/VoiceController';
import Home from './components/Home';
import AgoraCloud from './components/AgoraCloud';
import AgorAJoinWithRoom from './components/AgoraJoinWithRoom';
import VoiceAgora from './components/VoiceAgora';


function App() {
  return (
    <BrowserRouter>
      <Routes>
      <Route path="/" element={<AgorAJoinWithRoom />} />
        <Route path="/voice" element={<VoiceAgora />} />
        <Route path="/room/:roomId" element={<VoiceController />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
