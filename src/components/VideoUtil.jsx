import { useState, useEffect, createContext } from "react";


export const VideoContext = createContext();
export const VideoProvider = ({children }) => {
    const [videos, setVideos] = useState([]);
  

  return (
    <VideoContext.Provider value={{ videos, setVideos }}>
      {children}</VideoContext.Provider>
  );
};
