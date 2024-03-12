import { Suspense } from 'react'
import './App.css'
import VideoUpload from './components/VideoUpload'
import { Route, Routes } from "react-router-dom";
import LiveVideo from './components/LiveVideo';
import LoginPage from './components/LoginPage';
import VideoAnalysis from './components/VideoAnalysis';
function App() {
  
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="*" element={<VideoUpload />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/video" element={<VideoUpload />} />
          <Route path="/live" element={<LiveVideo />} />
          <Route path="/analysis/:id" element={<VideoAnalysis />}/>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
