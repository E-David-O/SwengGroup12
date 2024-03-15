// @ts-nocheck
import { useState,  createContext, useEffect } from "react";
import './typedef'

export const VideoContext = createContext();
export const VideoProvider = ({children }) => {
    /**
     * @type {Video[]}
     */
    const [videos, setVideos] = useState([]);
    const [resultList, setResultList] = useState([{}])
    const [token, setToken] = useState("")

    useEffect(() => {
        localStorage.setItem("username", JSON.stringify(token));
    }, [token]);

    useEffect(() => {
      const username = JSON.parse(localStorage.getItem("username"));
      if (username != "") {
        setToken(username);
      }
  }, [token]);

  return (
    <VideoContext.Provider value={{ videos, setVideos, resultList, setResultList, token, setToken }}>
      {children}</VideoContext.Provider>
  );
};
