// @ts-nocheck
import { useState,  createContext, useEffect } from "react";
import './typedef'

export const VideoContext = createContext();
export const VideoProvider = ({children }) => {
    /**
     * @type {Video[]}
     */
    const [videos, setVideos] = useState(() => {
        const saved = JSON.parse(localStorage.getItem("videos"));
        return saved || [];
    });
    const [resultList, setResultList] = useState(() => {
      const saved = JSON.parse(localStorage.getItem("results"));
      return saved || [];
  });
    const [token, setToken] = useState(() => {
      const saved = JSON.parse(localStorage.getItem("username"));
      return saved || "";  
  });

    useEffect(() => {
        localStorage.setItem("username", JSON.stringify(token));
    }, [token]);


    useEffect(() => {
        try {
          localStorage.setItem("results", JSON.stringify(resultList));
        } catch (e) {
          console.log(e);
        }
      
    }, [resultList]);


    useEffect(() => {
      localStorage.setItem("videos", JSON.stringify(videos));
    }, [videos]);


     const deleteData = () => {
        localStorage.removeItem("results");
        localStorage.removeItem("videos");
     }

     const logout = () => {
      localStorage.removeItem("username");
      deleteData();
      setToken("");
     }

  return (
    <VideoContext.Provider value={{ videos, setVideos, resultList, setResultList, token, setToken, logout, deleteData }}>
      {children}</VideoContext.Provider>
  );
};
