import { useContext, useEffect, useRef, useState} from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import { VideoContext } from "./VideoUtil";
import VideoJS from "./VideoPlayer";
import videojs from "video.js";
function VideoAnalysis() {
    const title = useParams();
    const { videos } = useContext(VideoContext);
    const video = videos.find((video) => video.name === title.id);
    const playerRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(0);
    const [percentComplete, setPercentComplete] = useState(0);
    // useEffect(() => {
    //     const url = `http://localhost:8000/${title.id}`;
    //     axios
    //         .get(url)
    //         .then((response) => {
    //             console.log(response);
    //             setVideo(response.data.filePath);
    //         })
    //         .catch(function (error) {
    //             // handle error
    //             console.log(error);
    //             });
    // }, [])
   
    const handlePlayerReady = (player) => {
        playerRef.current = player;
        player.on("timeupdate", () => {
          setCurrentTime(player.currentTime());
          setPercentComplete((player.currentTime() / player.duration()) * 100);
        });
        player.on("waiting", () => {
          console.log("player is waiting");
        });
    
        player.on("dispose", () => {
          console.log("player will dispose");
        });
      };
    const videoJsOptions = {
        controls: true,
        preload: 'auto',
        responsive: true,
        fluid: true,
        sources: [{
            src: URL.createObjectURL(video.file),
            type: 'video/mp4'
        }]
    }

    return (
        <>
            <Navbar />
            <h3>Analysis for {title.id}</h3>
            <VideoJS  options={videoJsOptions} onReady={handlePlayerReady} />
            {videojs.getPlayer('my-player') ? 
            <div>
                <p>{currentTime.toFixed(2)} seconds elapsed</p>
                <p>{percentComplete.toFixed(2)}%</p>
                <p>Current frame {(currentTime * 29.97).toPrecision(6)}</p>
            </div>
            
            : null }
        </>
    );
}
export default VideoAnalysis;


