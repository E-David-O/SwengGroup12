// @ts-nocheck
import { useState,  createContext } from "react";
import './typedef'

export const VideoContext = createContext();
export const VideoProvider = ({children }) => {
    /**
     * @type {Video[]}
     */
    const [videos, setVideos] = useState([]);
    const [resultList, setResultList] = useState([{}])
    const [token, setToken] = useState("")

  return (
    <VideoContext.Provider value={{ videos, setVideos, resultList, setResultList, token, setToken }}>
      {children}</VideoContext.Provider>
  );
};
