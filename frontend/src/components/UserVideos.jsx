// @ts-nocheck
import axios from "axios";
import { useEffect, useState, useRef, useMemo,  } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import './typedef';
import VideoJS from "./VideoPlayer";
import videojs from "video.js";
import "videojs-youtube";
import '@devmobiliza/videojs-vimeo/dist/videojs-vimeo.esm';
import "videojs-sprite-thumbnails";
import {
    LeftOutlined,
    RightOutlined,
} from "@ant-design/icons";

function UserVideos() {
    /**
     * @type {UserVideo[]}
     */
    const [videos, setVideos] = useState([]);
    const username = JSON.parse(localStorage.getItem("username"));
    const [indexComparison, setIndexComparison] = useState(null);
    const [indexAnalysis, setIndexAnalysis] = useState(null);
    const [loading, setLoading] = useState(false);
    /**
     * 
     * @param {*} res 
     * @returns {Result[]}
     */

    const parseFrames = (res) => {
        let results = [];
        console.log(res);
        if(res.homogeny !== undefined) {
            if(res.homogeny !== null) {
                let result = {
                    selector: "Structural Similarity + Homogeny",
                    frames: res.Frames.filter((f) => f.selectionMethod === 1),
                    run_time: res.homogeny,
                    analysis_time: res.homogeny_analysis
                }
                results.push(result);
            }
        } 
        if(res.structural !== undefined) {
            if(res.structural !== null) {
                let result = {
                    selector: "Structural Similarity",
                    frames: res.Frames.filter((f) => f.selectionMethod === 0),
                    run_time: res.structural,
                    analysis_time: res.structural_analysis
                }
                results.push(result);
            }
        } 
        if(res.frame_selection !== undefined ) {
            if(res.frame_selection !== null) {
                let result = {
                    selector: "Frame by Frame",
                    frames: res.Frames.filter((f) => f.selectionMethod === 2),
                    run_time: res.frame_selection,
                    analysis_time: res.frame_selection_analysis
                }
                results.push(result);
            }
        }
        return results;
    }

    /**
     * 
     * 
     */


    const parseVideos = (videos) => {
        let newVideos = [];
        for(let res of videos){
            console.log(res);
            if(res.encoded_video.includes("youtube.com") || res.encoded_video.includes("youtu.be") || res.encoded_video.includes("vimeo") ){
                if(res.Frames.length !== 0) {
                    let results = parseFrames(res);
                    newVideos.push({name: res.video_name, url: res.encoded_video, results: results, fps: res.frameRate});
                }
            } else if (res.encoded_video.includes("tiktok")) {
                if(res.Frames.length !== 0) {
                    let results = parseFrames(res);
                    newVideos.push({name: res.video_name, url: res.encoded_video, results: results, fps: res.frameRate});
                }
            } else {
                if(res.Frames.length !== 0) {
                    let blob = b64toBlob(res.encoded_video, "video/mp4", res.video_name.split(".")[0] + ".mp4");
                    let results = parseFrames(res);
                    newVideos.push({name: res.video_name, url: URL.createObjectURL(blob), results: results, fps: res.frameRate});
                }
            }
        }
        console.log(newVideos);
        setVideos(newVideos);
    }
  useEffect(() => {
    setLoading(true);
    axios
    .get(`http://localhost:8000/account_videos${(username) ? `?username=${username}` : ''}`)
    .then((response) => {
        console.log(response.data);
        parseVideos(response.data);
        setLoading(false);
    })
    .catch((error) => {
        console.log(error);
        alert(error.response.data.message)
    });
  }, []);


  const setComparison = (index) => {
    console.log(index);
    setIndexComparison(index);
  }

  const setAnalysis = (index) => {
    console.log(index);
    setIndexAnalysis(index);
  }


  return (
    <div className="min-h-screen">
        <Navbar />
        {loading ? 
        <div className="flex justify-center items-center h-screen">
            <div
                    className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"
                    role="status">
                    <span
                    className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]"
                    >Loading...</span>
            </div>
        </div> :
        (console.log(videos),indexComparison === null ? (
            videos.length !== 0 ? videos?.map((video, i) => (
                <UserVideoCard key={i} video={video} setComparison={setComparison}/>
                
            )) : <p>No videos uploaded</p>
        ) : (
            indexAnalysis === null ? (
                <Comparison results={videos.find((v) => v.name === indexComparison).results} setComparison={setComparison} setAnalysis={setAnalysis}/>
            ) : (
                <Analysis video={videos.find((v) => v.name === indexComparison)} setAnalysis={setAnalysis} selector={indexAnalysis} />
            )
        ))
        }
        <Footer />
    </div>
  );
}


export default UserVideos;


function UserVideoCard({video, setComparison}) {
return (
    <div className="max-w-xl m-2 bg-slate-200 p-6 rounded-xl shadow-lg flex items-center space-x-4">
    <img 
        src={`data:image/jpeg;base64,${video.results[0].frames[0].frameData}`} 
        alt={video.name}
        className="object-cover w-48 h-48 rounded-lg shadow-sm"
    />
    <div className="flex flex-col justify-between space-y-2">
        <p className="text-2xl font-semibold text-gray-800">
            {video.name}
        </p>
        <div className="flex space-x-2">
            <button
                onClick={() => setComparison(video.name)}
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
            >
                Comparison
            </button>
        </div>
    </div>
</div>
);
}

function Comparison({results, setComparison, setAnalysis}) {
    return (
    <div className="flex flex-col justify-center gap-4 m-4">
                <div>
                <button
                onClick={() => setComparison(null)}
                className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                >
                    Back to your videos
                </button>
                    {results.length !== 0 ? (
                        <>
                            {console.log(results),results.map((result, index) => (
                                <div key={index} className="w-full md:max-w-lg mx-auto bg-slate-200 p-6 mb-2 rounded-xl shadow-lg flex items-center space-x-4">
                                    <img 
                                        src={`data:image/jpeg;base64,${result.frames[0].frameData}`} 
                                        alt={result.selector}
                                        className="object-cover w-48 h-48 rounded-lg shadow-sm"
                                    />
                                    <div className="flex flex-col justify-between space-y-2">
                                        <p className="text-2xl font-semibold text-blue-500">
                                            {result.selector} 
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-800">
                                            {result.frames.length} frames analysed
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-800">
                                            Frame Selection: <br></br>{result.run_time.toFixed(2)} seconds
                                        </p>
                                        <p className="text-2xl font-semibold text-gray-800">
                                            Frame Analysis: <br></br>{result.analysis_time.toFixed(2)} seconds
                                        </p>
                                        <p className="text-2xl font-bold text-gray-800">
                                            Total: <br></br>{(result.run_time + result.analysis_time).toFixed(2)} seconds
                                        </p>

                                        <div className="flex space-x-2">
                                            <button
                                                onClick={(() => setAnalysis(result.selector))}
                                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                                            >
                                                Show Analytics
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </>
                    ) : (
                        <p>No results</p>
                    )}
                </div>
            </div>
         );
   }




   
   function Analysis({video, setAnalysis, selector}) {
           const results = video.results.find((r) => r.selector === selector).frames;
           const fps = video.fps;
           console.log(video);
           console.log(results)
           const playerRef = useRef(null);
           const [currentTime, setCurrentTime] = useState(0);
           const [percentComplete, setPercentComplete] = useState(0);
           const [currentFrame, setCurrentFrame] = useState(results[0] || null);
           const [closest, setClosest] = useState(null);
           const calculateData = () => {
               let data = {};
               results.forEach((f) => {
                   f.Objects.forEach((r) => {
                       if (data[r.objectDetected]) {
                               data[r.objectDetected] += 1;
                       } else {
                               data[r.objectDetected] = 1;
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
                           data.push(URL.createObjectURL(getFileFromBase64(f.frameData, `thumbnail${i}.jpg`)));
                   });
                   return data;
           }
           const data = useMemo(() => calculateData(), [results]);
           const images = useMemo(() => createThumbnails(), [results]);
        
           const handlePlayerReady = (player) => {
                   playerRef.current = player;
   
                   player.on("play", () => {
                           player.spriteThumbnails({
                                   width: 192,
                                   height: 108,
                                   columns: 1,
                                   rows: 1,
                                   urlArray: images,
                                   interval: ((player.duration() * fps) / results.length)/fps,
                           });
                   });
   
                  
                   player.on("timeupdate", () => {
                           const time = player.currentTime();
                           // @ts-ignore
                           setCurrentTime(time);
                           setPercentComplete((time / player.duration()) * 100);
                           const closestFrame = results.map(f => f.frameNumber).reduce((a,b) => {
                                   return Math.abs(b -(time * fps)) < Math.abs(a - (time * fps)) ? b : a;
                           });
                           setClosest(closestFrame);
                           setCurrentFrame(results.find(f => f.frameNumber === closestFrame));
                           
                           
                           
                   });
                   player.on("waiting", () => {
                       console.log("player is waiting");
                   });
           
                   player.on("dispose", () => {
                       console.log("player will dispose");
                   });
               };
           let videoJsOptions;
           if(!video.url.includes("youtube") && !video.url.includes("vimeo") && !video.url.includes("tiktok") && !video.url.includes("youtu.be")) {
                   videoJsOptions = {
                           controls: true,
                           preload: 'auto',
                           responsive: true,
                           fluid: true,
                           sources: [{
                                   src: video.url,
                                   type: 'video/mp4'
                           }]
                   }
           } else {
                   if(video.url.includes("youtube") || video.url.includes("youtu.be")) {
                           videoJsOptions = {
                                   controls: true,
                                   preload: 'auto',
                                   responsive: true,
                                   fluid: true,
                                   sources: [
                                           {
                                           type: "video/youtube",
                                           src: video.url
                                           }
                                   ],
                                   techOrder: ["youtube"]
                           }
                   } else if(video.url.includes("vimeo")) {
                           videoJsOptions = {
                                   controls: true,
                                   preload: 'auto',
                                   responsive: true,
                                   fluid: true,
                                   sources: [
                                           {
                                           type: "video/vimeo",
                                           src: video.url
                                           }
                                   ],
                                   techOrder: ["vimeo"]
                           }
                   }
                                           
           }
           return (
                   <div>
                           <button
                            onClick={() => setAnalysis(null)}
                            className="bg-blue-500 m-2 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                            >
                                Back to comparison
                            </button> 
                           <div className="flex justify-evenly ">
                                   <p className="mr-[92px]">Analysis of {video.name} for {selector}</p>
                                   <p className="mr-[64px]">Total Frames Analysed: {results.length}</p>
                           </div>
                           {!video.url.includes("tiktok") ? <VideoJS  options={videoJsOptions} onReady={handlePlayerReady} />:null}
                           {videojs.getPlayer('my-player') ? 
                                   <div>
                                           <div className="flex justify-evenly m-1">
                                                   <p>{currentTime.toFixed(2)} seconds elapsed</p>
                                                   <p>{percentComplete.toFixed(2)}%</p>
                                                   <p>Current frame {(currentTime * 
                                                   fps).toPrecision(6)}</p>
                                           </div>
                                           <div className="flex justify-center">
                                                   <img className="object-fill" src={`data:image/jpeg;base64,${currentFrame.frameData}`}/>
                                           </div> 
                                           <p className="m-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Closest Frame Analysis: frame {closest} </p>
                                           <div className="grid grid-cols-3 gap-1 m-2">
                                           { currentFrame.Objects.length !== 0 ? currentFrame.Objects?.map((f, i) => {
                                                   return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f.objectDetected}, confidence: {f.confidence}</div>
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
                           video.url.includes("tiktok") ? (
                                   <TiktokSlider props={{ results, video, data }} />
                           ) : null
                           
                           }
                </div>
           );
   }

  
function TiktokSlider({props}) {
       const [index, setIndex] = useState(0);
       const [width, setWidth] = useState(0);
       const [xPosition, setXPosition] = useState(0);
       const createImages = () => {
           let data = [];
           props.results.forEach((f, i) => {
               data.push(f.frameData);
           });
           return data;
       }
       const images = useMemo(() => createImages(), [props.results]);
       const handleClickPrev = () => { 
           if (index === 0) {
               setIndex(images.length - 1);
               return;
           }
           setIndex(index - 1);
           //setXPosition(xPosition + width);
           };
   
       const handleClicknext = () => {
           if (index === images.length - 1) {
               setIndex(0);
               //setXPosition(0);
           } else {
               setIndex(index + 1);
              // setXPosition(xPosition - width);
           }
           };
       const currentFrame = props.results[index];
   
       return (
           <div className="">
               <div className="flex justify-evenly">
                   <div className="m-2">
                       <iframe  src={`https://www.tiktok.com/embed/v2/${props.video.url.split("/").slice(-1).toString().split("?")[0]}`} title="tiktok" height="700" ></iframe>
                   </div>
                   <div className="m-2" >
                       <div className="rounded-full bg-gray-600 px-2 text-center text-sm text-white">
                       <span>{index + 1}</span>/<span>{images.length}</span>
                       </div>  
                       <Carousel
                           images={images}
                           setWidth={setWidth}
                           xPosition={xPosition}
                           handleClickPrev={handleClickPrev}
                           handleClicknext={handleClicknext}
                           index={index}
                       />
                   </div>
               </div>  
                   <p className="m-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Closest Frame Analysis: frame {currentFrame.frame_number} </p>
                   <div className="grid grid-cols-3 gap-1 m-2">
                   { currentFrame !== null ? currentFrame.Objects?.map((f, i) => {
                           return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f.objectDetected}, confidence: {f.confidence}</div>
                   }) : <p>No objects detected</p>}
                   </div>
                   <p className="m-2 bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Aggregate Video Analysis</p>
                   <div className="grid grid-cols-3 gap-1 m-2">
                   { props.data.length !== 0 ? props.data?.map((f, i) => {
                           return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f[0]}, Occurances: {f[1]}</div>
                   }) : <p>No Total Results</p>}
                   </div>
           </div>
       );
       }
   
   function Carousel({
       images,
       setWidth,
       xPosition,
       handleClickPrev,
       handleClicknext,
       index,
     }) {
       const slideRef = useRef();
       useEffect(() => {
       if (slideRef.current) {
         // @ts-ignore
         const width = slideRef.current.clientWidth;
         setWidth(width);
       }
     }, [setWidth]);
       return (
       <div className="relative w-full h-5/6">
         <div className='transition-transform ease-in-out duration-500' style={{ transform: `translateX(${xPosition}px)`}} ref={slideRef}>
           {images.length !== 0 ? 
             <img className="h-[600px]" src={`data:image/jpeg;base64,${images[index]}`} />
           : 
           <p>No images</p>}
         </div>
         <Buttons
           handleClickPrev={handleClickPrev}
           handleClicknext={handleClicknext}
         />
       </div>
     );
   }
   
   function Buttons ({handleClickPrev, handleClicknext}) {
       return (
       <div className="absolute ml-4 mr-4 z-10 top-1/2 left-0 cursor-pointer right-0 flex justify-between" style={{ transform: `translateY(-50}%)`}}>
         <button onClick={handleClickPrev} ><LeftOutlined style={{ fontSize: '150%', color: 'white'}}></LeftOutlined></button>
         <button onClick={handleClicknext} ><RightOutlined style={{ fontSize: '150%', color: 'white'}}></RightOutlined></button>
       </div>
     );
   }
   
   

   
   
 function getFileFromBase64(string64, fileName) {
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
function b64toBlob(b64Data, contentType, filename) {
contentType = contentType || '';
const sliceSize = 512;

var byteCharacters = atob(b64Data);
var byteArrays = [];

for (var offset = 0; offset < byteCharacters.length; offset += sliceSize) {
    var slice = byteCharacters.slice(offset, offset + sliceSize);

    var byteNumbers = new Array(slice.length);
    for (var i = 0; i < slice.length; i++) {
    byteNumbers[i] = slice.charCodeAt(i);
    }

    var byteArray = new Uint8Array(byteNumbers);

    byteArrays.push(byteArray);
}

var blob = new Blob(byteArrays, {type: contentType});

return new File([blob], filename, {type: contentType});
}