// @ts-nocheck

import axios from "axios";
import { useEffect, useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import './typedef'
function UserVideos() {
    /**
     * @type {UserVideo[]}}
     */

    const [videos, setVideos] = useState([]);
    const username = JSON.parse(localStorage.getItem("username"));

    /**
     * 
     * @param {*} res 
     * @returns {Result[]}
     */

    const parseFrames = (res) => {
        let results = [];
        if(res.homogeny !== undefined) {
            let result = {
                selector: "Structural Similarity + Homogeny",
                frames: res.frames.filter((f) => f.selectionMethod === 0),
                run_time: res.homogeny
            }
            results.push(result);
        } 
        if(res.structural !== undefined) {
            let result = {
                selector: "Structural Similarity",
                frames: res.frames.filter((f) => f.selectionMethod === 1),
                run_time: res.structural
            }
            results.push(result);
        } 
        if(res.tradtional !== undefined) {
            let result = {
                selector: "Frame by Frame",
                frames: res.frames.filter((f) => f.selectionMethod === 2),
                run_time: res.tradtional
            }
            results.push(result);
        }
        return results;
    }

    /**
     * 
     * 
     */


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
                let results = parseFrames(res);
                newVideos.push({name: title, url: res.encoded_video, resuts: results, fps: res.fps});
            } else if (res.encoded_video.includes("tiktok")) {
                let results = parseFrames(res);
                newVideos.push({name: res.encoded_video.split("/").slice(-1).toString(), url: res.encoded_video, results: results, fps: res.fps});
            } else {
                var blob = new Blob([atob(res.encoded_video)], { type: "video/mp4" });
                let results = parseFrames(res);
                newVideos.push({name: res.encoded_video, url: URL.createObjectURL(blob), results: results, fps: res.fps});
            }
        }
        console.log(newVideos);
        setVideos(newVideos);
    }
  useEffect(() => {
    axios
      .get(`http://localhost:8000/account_videos${(username) ? `?username=${username}` : ''}`)
      .then((response) => {
        console.log(response.data);
        parseVideos(response.data);

      })
      .catch((error) => {
        console.log(error);
      });
  }, []);


  return (

    <div className="min-h-screen">
        <Navbar />
      {videos.length !== 0 ? videos?.map((video, i) => (

        <p key={i}>{video.title}</p>
      ))
        : <p>No videos uploaded</p>}
      <Footer />
    </div>
  );
}


export default UserVideos;