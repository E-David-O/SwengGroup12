import { useState,  createContext } from "react";


export const VideoContext = createContext();
export const VideoProvider = ({children }) => {
    const [videos, setVideos] = useState([{
        file: null,
        uploaded: false,
        analysed: false,
        name: ""
    }]);
  

  return (
    <VideoContext.Provider value={{ videos, setVideos }}>
      {children}</VideoContext.Provider>
  );
};
