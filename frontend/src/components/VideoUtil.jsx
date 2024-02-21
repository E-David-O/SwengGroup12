// @ts-nocheck
import { useState,  createContext } from "react";
import './typedef'

export const VideoContext = createContext();
export const VideoProvider = ({children }) => {
    /**
     * @type {Video[]}
     */
    const [videos, setVideos] = useState([]);
  

  return (
    <VideoContext.Provider value={{ videos, setVideos }}>
      {children}</VideoContext.Provider>
  );
};
