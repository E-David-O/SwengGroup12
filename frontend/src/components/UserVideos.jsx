// @ts-nocheck
import VideoCard from "./VideoCard";
import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
function UserVideos() {
    const [videos, setVideos] = useState([]);
    const username = JSON.parse(localStorage.getItem("username"));


    const parseVideos = async (videos) => {
        let newVideos = [];
        for(let res of videos){
            console.log(res);
            if(res.encoded_video.includes("youtube.com") || res.encoded_video.includes("youtu.be") || res.encoded_video.includes("vimeo")){
                let title;
                await axios.get(`https://noembed.com/embed?dataType=json&url=${res.encoded_video}`)
                .then(res => {
                    console.log(res);
                    title = res.data.title
                })
                .catch(err => console.log(err));
                console.log(title);
                newVideos.push({title: title, url: res.encoded_video});
            } else if (res.encoded_video.includes("tiktok")) {
                newVideos.push({title: res.encoded_video.split("/").slice(-1).toString(), url: res.encoded_video});
            } else {
                var blob = new Blob([atob(res.encoded_video)], { type: "video/mp4" });
                newVideos.push({title: res.encoded_video, url: URL.createObjectURL(blob)});
            }
        }
        return newVideos;
    }
  useEffect(() => {
    axios
      .get(`http://localhost:8000/account_videos${(username) ? `?username=${username}` : ''}`)
      .then((response) => {
        console.log(response.data);
        const newVideo = parseVideos(response.data);
        console.log(newVideo);
        setVideos([...newVideo]);

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (

    <div className="min-h-screen">
        <Navbar />
      {videos.length !== 0 ? videos?.map((video, i) => (
        <p>{video.encoded_video}</p>
      ))
        : <p>No videos uploaded</p>}
      <Footer />
    </div>
  );
}


export default UserVideos;