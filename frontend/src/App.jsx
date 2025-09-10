import { Routes, Route } from 'react-router-dom';
import './App.css';
import Landing from './pages/Landing';
import PHQ9 from './pages/PHQ9';
import Chatbot from './pages/Chatbot';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50">
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/landing" element={<Landing />} />
        <Route path="/phq9" element={<PHQ9 />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </div>
  );
}

export default App;
