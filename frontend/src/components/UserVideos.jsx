import VideoCard from "./VideoCard";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
function UserVideos() {
    const [videos, setVideos] = useState([]);
    const username = JSON.parse(localStorage.getItem("username"));
  useEffect(() => {
    axios
      .get(`http://localhost:8000/acount_videos${(username) ? `?username=${username}` : ''}`)
      .then((response) => {
        setVideos(response.data);
      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (

    <div className="min-h-screen">
        <Navbar />
      {videos.map((video) => (
        <VideoCard key={video._id} video={video} />
      ))}
      <Footer />
    </div>
  );
}


export default UserVideos;