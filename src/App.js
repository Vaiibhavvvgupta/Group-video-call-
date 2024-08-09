import { BrowserRouter, Route, Routes } from 'react-router-dom';
import VideoCallRoom from './components/VideoCallRoom';
import Home from './components/Home';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/room/:roomId" element={<VideoCallRoom />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
