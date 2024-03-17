import { Suspense } from 'react'
import './App.css'
import HomePage from './components/HomePage';
import VideoUpload from './components/VideoUpload';
import { Route, Routes } from "react-router-dom";
import LiveVideo from './components/LiveVideo';
import VideoAnalysis from './components/VideoAnalysis';
import { VideoContext } from "./components/VideoUtil";
import { useContext } from "react";
import Login from './components/Login';
import Signup from './components/Signup';

function App() {
  const { token, deleteData, logout } = useContext(VideoContext);
  
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          { token == "" ? 
              <Route path="*" element={<HomePage />} />
              : 
              <Route path="*" element={<VideoUpload />} />
          }
          <Route path="/video" element={<VideoUpload />} />
          <Route path="/live" element={<LiveVideo />} />
          <Route path="/analysis/:id" element={<VideoAnalysis />}/>
          <Route path="/login" element={<Login />}/>
          <Route path="/register" element={<Signup />}/>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
