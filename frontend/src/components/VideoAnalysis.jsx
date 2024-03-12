import { useContext, useMemo, useRef, useState} from "react";
import Navbar from "./Navbar";
import { useParams} from "react-router-dom";
import axios from "axios";
import { VideoContext } from "./VideoUtil";
import VideoJS from "./VideoPlayer";
import videojs from "video.js";


function VideoAnalysis() {
        const title = useParams();
        const { videos, resultList } = useContext(VideoContext);
        const results = resultList.find((r) => r.name === title.id).results || []; // Ensure results is an array
        const video = videos.find((video) => video.name === title.id);
        const playerRef = useRef(null);
        const [currentTime, setCurrentTime] = useState(0);
        const [percentComplete, setPercentComplete] = useState(0);
        const [currentFrame, setCurrentFrame] = useState(null);
        const [closest, setClosest] = useState(null);
        const calculateData = () => {
            let data = {};
            results.forEach((f) => {
                f.results.forEach((r) => {
                    if (data[r.class_id]) {
                            data[r.class_id] += 1;
                    } else {
                            data[r.class_id] = 1;
                    }
                });
            });
            let sortable = [];
            for(let object in data) {
                sortable.push([object, data[object]])
            };
            sortable.sort(function(a,b) {
                return b[1] - a[1];
            })
            return sortable;
        }
        const data = useMemo(() => calculateData(), [results]);
      
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
                    const time = player.currentTime();
                    setCurrentTime(time);
                    setPercentComplete((time / player.duration()) * 100);
                    const closestFrame = results.map(f => f.frame_number).reduce((a,b) => {
                        return Math.abs(b -(time * 59.97)) < Math.abs(a - (time * 59.97)) ? b : a;
                    });
                    setClosest(closestFrame);
                    console.log(closestFrame);
                    console.log(results.find(f => f.frame_number === closestFrame).results);
                    setCurrentFrame(results.find(f => f.frame_number === closestFrame));
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
                                        <p>Total frames analysed {results.length}</p>
                                        <p>Current frame {(currentTime * 59.97).toPrecision(6)}</p>
                                        <p>Closest Analysed Frame: {closest}</p>
                                        <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Closest Frame Analysis</p>
                                        <div className="grid grid-cols-3 gap-1 m-1">
                                        { currentFrame.results.length !== 0 ? currentFrame.results?.map((f, i) => {
                                                return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f.class_id}, confidence: {f.conf}</div>
                                        }) : <p>No objects detected</p>}
                                        </div>
                                        <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Aggregate Video Analysis</p>
                                        <div className="grid grid-cols-3 gap-1 m-1">
                                        { data.length !== 0 ? data?.map((f, i) => {
                                                return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f[0]}, Occurances: {f[1]}</div>
                                        }) : <p>No Total Results</p>}
                                        </div>
                                        <img src={`data:image/jpeg;base64,${currentFrame.image}`}/>
                                </div>
                        : null }
                </>
        );
}
export default VideoAnalysis;


