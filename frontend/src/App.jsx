import { Suspense } from 'react'
import './App.css'
import LandingPage from './components/LandingPage';
import UserDashboard from './components/UserDashboard';
import VideoUpload from './components/VideoUpload';
import { Route, Routes } from "react-router-dom";
import LiveVideo from './components/LiveVideo';
import VideoAnalysis from './components/VideoAnalysis';
import { VideoContext } from "./components/VideoUtil";
import { useContext } from "react";
import Login from './components/Login';
import Signup from './components/Signup';
import Services from './components/Services';
import About from './components/About';
import Contact from './components/Contact';

function App() {
  const { token, deleteData, logout } = useContext(VideoContext);
  
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          
          <Route path="/services" element={<Services />}/>
          <Route path="/about" element={<About />}/>
          <Route path="/contact" element={<Contact />}/>
        
          { token == "" ? 
              <>
                <Route path="*" element={<LandingPage />} />
                <Route path="/login" element={<Login />}/>
                <Route path="/register" element={<Signup />}/>
              </>
              : 
              <>
                <Route path="*" element={<UserDashboard />} />
                <Route path="/video" element={<VideoUpload />} />
                <Route path="/live" element={<LiveVideo />} />
                <Route path="/analysis/:id" element={<VideoAnalysis />}/>
              </>
          }
        </Routes>
      </Suspense>
    </>
  )
}

export default App
