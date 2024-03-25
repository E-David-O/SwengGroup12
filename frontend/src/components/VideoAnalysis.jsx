import { useContext, useMemo, useRef, useState} from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useLocation} from "react-router-dom";
import { VideoContext } from "./VideoUtil";
import VideoJS from "./VideoPlayer";
import videojs from "video.js";
import "videojs-youtube";
import '@devmobiliza/videojs-vimeo/dist/videojs-vimeo.esm';
import "videojs-sprite-thumbnails";
import TiktokSlider from "./TiktokSlider";


function VideoAnalysis() {
        const test = useLocation();
        const title = decodeURI(test.pathname.split("/").slice(-1).toString() + test.search);
        const { videos, resultList } = useContext(VideoContext);
        const results = resultList.find((r) => r.name === title).results || []; // Ensure results is an array
        let fps;
        if (resultList.find((r) => r.name === title).fps !== undefined) {
                fps = Number(resultList.find((r) => r.name === title).fps);
        } else {
                fps = 59.97;
        }
        const video = videos.find((video) => video.name === title);
        let url = ""
        if(video.youtube) {
                url = video.file;
        }
        const playerRef = useRef(null);
        const [currentTime, setCurrentTime] = useState(0);
        const [percentComplete, setPercentComplete] = useState(0);
        const [currentFrame, setCurrentFrame] = useState(results[0] || null);
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
        const createThumbnails = () => {
                let data = [];
                results.forEach((f, i) => {
                        data.push(URL.createObjectURL(getFileFromBase64(f.image, `thumbnail${i}.jpg`)));
                });
                return data;
        }
        const data = useMemo(() => calculateData(), [results]);
        const images = useMemo(() => createThumbnails(), [results]);
     
        const handlePlayerReady = (player) => {
                playerRef.current = player;
               
                player.on("timeupdate", () => {
                        const time = player.currentTime();
                        // @ts-ignore
                        setCurrentTime(time);
                        setPercentComplete((time / player.duration()) * 100);
                        const closestFrame = results.map(f => f.frame_number).reduce((a,b) => {
                                return Math.abs(b -(time * fps)) < Math.abs(a - (time * fps)) ? b : a;
                        });
                        setClosest(closestFrame);
                        setCurrentFrame(results.find(f => f.frame_number === closestFrame));
                        
                        player.spriteThumbnails({
                                width: 192,
                                height: 108,
                                columns: 1,
                                rows: 1,
                                urlArray: images,
                                interval: ((player.duration() * fps) / results.length)/fps,
                        });
                        
                });
                player.on("waiting", () => {
                    console.log("player is waiting");
                });
        
                player.on("dispose", () => {
                    console.log("player will dispose");
                });
            };
        let videoJsOptions;
        console.log(video);
        if(!video.youtube) {
                videoJsOptions = {
                        controls: true,
                        preload: 'auto',
                        responsive: true,
                        fluid: true,
                        sources: [{
                                src: URL.createObjectURL(video.file),
                                type: 'video/mp4'
                        }]
                }
        } else {
                if(video.file.includes("youtube")) {
                        videoJsOptions = {
                                controls: true,
                                preload: 'auto',
                                responsive: true,
                                fluid: true,
                                sources: [
                                        {
                                        type: "video/youtube",
                                        src: video.file
                                        }
                                ],
                                techOrder: ["youtube"]
                        }
                } else if(video.file.includes("vimeo")) {
                        videoJsOptions = {
                                controls: true,
                                preload: 'auto',
                                responsive: true,
                                fluid: true,
                                sources: [
                                        {
                                        type: "video/vimeo",
                                        src: video.file
                                        }
                                ],
                                techOrder: ["vimeo"]
                        }
                }
                                        
        }

        return (
                <div className="min-h-screen">
                        <Navbar />
                        <div className="flex justify-evenly">
                                <p>Analysis for {title} </p>
                                <p>Total Frames Analysed: {results.length}</p>
                        </div>
                        {!url.includes("tiktok") ? <VideoJS  options={videoJsOptions} onReady={handlePlayerReady} />:null}
                        {videojs.getPlayer('my-player') ? 
                                <div>
                                        <div className="flex justify-evenly m-1">
                                                <p>{currentTime.toFixed(2)} seconds elapsed</p>
                                                <p>{percentComplete.toFixed(2)}%</p>
                                                <p>Current frame {(currentTime * 
                                                fps).toPrecision(6)}</p>
                                        </div>
                                        <div className="flex justify-center">
                                                <img className="object-fill" src={`data:image/jpeg;base64,${currentFrame.image}`}/>
                                        </div> 
                                        <p className="m-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Closest Frame Analysis: frame {closest} </p>
                                        <div className="grid grid-cols-3 gap-1 m-2">
                                        { currentFrame.results.length !== 0 ? currentFrame.results?.map((f, i) => {
                                                return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f.class_id}, confidence: {f.conf}</div>
                                        }) : <p>No objects detected</p>}
                                        </div>
                                        <p className="m-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Aggregate Video Analysis</p>
                                        <div className="grid grid-cols-3 gap-1 m-2">
                                        { data.length !== 0 ? data?.map((f, i) => {
                                                return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f[0]}, Occurances: {f[1]}</div>
                                        }) : <p>No Total Results</p>}
                                        </div>
                                        
                                </div>
                        // @ts-ignore
                        : 
                        url.includes("tiktok") ? (
                                <TiktokSlider props={{ results, video, data }} />
                        ) : null
                        
                        }
                        <Footer />
                </div>
        );
}
export default VideoAnalysis;


export function getFileFromBase64(string64, fileName) {
        const trimmedString = string64.replace('dataimage/jpegbase64', '');
        const imageContent = atob(trimmedString);
        const buffer = new ArrayBuffer(imageContent.length);
        const view = new Uint8Array(buffer);
      
        for (let n = 0; n < imageContent.length; n++) {
          view[n] = imageContent.charCodeAt(n);
        }
        const type = 'image/jpeg';
        const blob = new Blob([buffer], { type });
        return new File([blob], fileName, { lastModified: new Date().getTime(), type });
      }
      