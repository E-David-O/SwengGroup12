import { Suspense } from 'react'
import './App.css'
import VideoUpload from './components/VideoUpload'
import { Route, Routes } from "react-router-dom";
import LiveVideo from './components/LiveVideo';
import VideoAnalysis from './components/VideoAnalysis';
import Login from './components/Login';
import Signup from './components/Signup';
function App() {
  
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="*" element={<VideoUpload />} />
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
