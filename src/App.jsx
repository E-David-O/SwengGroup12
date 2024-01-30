import { Suspense } from 'react'
import './App.css'
import VideoUpload from './components/VideoUpload'
import { Route, Routes } from "react-router-dom";
import LiveVideo from './components/LiveVideo';
function App() {
  
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="*" element={<VideoUpload />} />
          <Route path="/video" element={<VideoUpload />} />
          <Route path="/live" element={<LiveVideo />} />
        </Routes>
   </Suspense>
    </>
  )
}

export default App
