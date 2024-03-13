import { Suspense } from 'react'
import './App.css'
import VideoUpload from './components/VideoUpload'
import { Route, Routes } from "react-router-dom";
import LiveVideo from './components/LiveVideo';
import LoginPage from './components/LoginPage';
import VideoAnalysis from './components/VideoAnalysis';
import ObjectAccuracy from './components/ObjectAccuracy';
function App() {
  
  return (
    <>
      <Suspense fallback={null}>
        <Routes>
          <Route path="*" element={<VideoUpload />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/objectaccuracy" element={
            <ObjectAccuracy objectAccuracyData={[
              { object: 'Cat', accuracy: 98.5 },
              { object: 'Dog', accuracy: 89.7 }
            ]}/>
          }/>

          <Route path="/video" element={<VideoUpload />} />
          <Route path="/live" element={<LiveVideo />} />
          <Route path="/analysis/:id" element={<VideoAnalysis />}/>
        </Routes>
      </Suspense>
    </>
  )
}

export default App
