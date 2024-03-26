import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState, useRef, useContext, useEffect} from "react";
import SingleVideoUpload from "./SingleVideoUpload";
import VideoCard from "./VideoCard";
import { VideoContext } from "./VideoUtil";
import axios from "axios";
import MultiDropDown from "./MultiDropDown";
import { useLocation} from "react-router-dom";

/**
 * 
 * @returns VideoUpload component
 * @description This component is used to upload videos to the server
 * 
 */


function VideoUpload() {
    let { videos, setVideos } = useContext(VideoContext);
    let { _ , resultList} = useContext(VideoContext);

    const dragRef = useRef(null);
    const inputRef = useRef(null);
    const [url, setUrl] = useState("");

    const [isDragging, setIsDragging] = useState(false);
    const [uploadVideoCount, setUploadVideoCount] = useState(0);
    useEffect(() => {
        let uploadedVideoCount = 0
        for (let i = 0; i < videos.length; i++){
            if (!videos[i].youtube){
                uploadedVideoCount++
            }
        }
           console.log({uploadedVideoCount})
          console.log(`videos.length: ${videos.length}`)
          console.log(JSON.stringify(videos))
          setUploadVideoCount(uploadedVideoCount)
      }, [videos]);
    const formatDuration = (seconds) => {
        let hours = -1
        let minutes = -1
        let newSeconds = -1
        if (seconds > 3600) {
            hours = (seconds / 3600)
            seconds -= (hours*3600)
        }

        if (seconds > 60) {
            minutes = (seconds / 60)
            seconds -= (minutes*60)
        }

        if (hours >= 0){
            return `${hours}:${minutes}:${seconds.toFixed(2)}`
        }
        else if (minutes >= 0) {
            return `${minutes}:${seconds.toFixed(2)}`
        }
        else {
            return `${seconds.toFixed(0)} seconds`
        }

    }
   

    /**
     * @typedef {Object} ChangeEvent
     * @param {ChangeEvent} e
     * @returns {void}
     * @description This function is used to handle the file upload 
     */
    function handleFile(e) {
        if (typeof e.preventDefault === "function") {
            e.preventDefault();
        }

        if (uploadVideoCount >= 4) {
            alert("You can only upload 4 videos at a time");
        }
        else if (e.target.files.length > 0) {
            const file = e.target.files[0];
            const videoElement = document.createElement("video");
            videoElement.preload = 'metadata';
            
            videoElement.onloadedmetadata = () => {
                window.URL.revokeObjectURL(videoElement.src);
                const duration = videoElement.duration;
                const newVideo = {
                    file: file,
                    uploaded: false,
                    analysed: false,
                    name: file.name,
                    youtube: false,
                    duration: formatDuration(duration)
                };
    
                if (videos.length > 0) {
                    setVideos([...videos, newVideo]);
                } else {
                    setVideos([newVideo]);
                }
            };
    
            videoElement.onerror = () => {
                window.URL.revokeObjectURL(videoElement.src);
                console.error("Error loading video file.");
            };
    
            videoElement.src = URL.createObjectURL(file);
        }

    }


    const handleURL = async (e) =>{
        e.preventDefault();
        if (url.match(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/) || url.match(/^(?:https?:\/\/)?(?:m\.|www\.)?vimeo.com\/(\d+)($|\/)/)) {
            let checkURL = url;
            if(!/^https?:\/\//i.test(checkURL)) {
                checkURL = "https://" + url;
            }
            let title;
            await axios.get(`https://noembed.com/embed?dataType=json&url=${checkURL}`)
                .then(res => {
                    console.log(res);
                    title = res.data.title
                })
                .catch(err => console.log(err));
            console.log(title);
            if (videos.length > 0 && videos.length < 4) {
                setVideos([...videos, { file: checkURL, uploaded: false, analysed: false, name: title, youtube: true }]);
            } else if (videos.length === 0) {
                setVideos([{ file: checkURL, uploaded: false, analysed: false, name: title, youtube: true }]);
            } else {
                alert("You can only upload 4 videos at a time");
            }
            console.log(videos);
            console.log(videos.length);
        } else if(url.match(/^.*https:\/\/(?:m|www|vm)?\.?tiktok\.com\/((?:.*\b(?:(?:usr|v|embed|user|video)\/|\?shareId=|\&item_id=)(\d+))|\w+)/)) {
            let checkURL = url;
            if(!/^https?:\/\//i.test(checkURL)) {
                checkURL = "https://" + url;
            }
            if (videos.length > 0 && videos.length < 4) {
                setVideos([...videos, { file: checkURL, uploaded: false, analysed: false, name: url.split("/").slice(-1).toString(), youtube: true }]);
            } else if (videos.length === 0) {
                setVideos([{ file: checkURL, uploaded: false, analysed: false, name: url.split("/").slice(-1).toString(), youtube: true }]);
            } else {
                alert("You can only upload 4 videos at a time");
            }
            console.log(videos);
            console.log(videos.length);

        } else {
            alert("Please enter a valid youtube URL");
        }
    
  
        }
      
    
    const handleUploadClick = (e) => {
        e.preventDefault();
        inputRef.current?.click();
      };
    
    const handleChange = (event) => {
        event.persist();
        setUrl(event.target.value);
    }

    const onDragEnter = (e) => {
        e.preventDefault();
        setIsDragging(true);
    };
    
    const onDragOver = (e) => {
        e.preventDefault();
        if (!isDragging) setIsDragging(true);
    };
    
    const onDragLeave = (e) => {
        e.preventDefault();
        setIsDragging(false);
    };
    

    const onDrop = (e) => {
        e.preventDefault();
        const files = e.dataTransfer.files;
        setIsDragging(false);
        if (files && files.length > 0) {
            const simulatedEvent = {
                target: {
                    files: files
                }
            };
            handleFile(simulatedEvent);
        }
    };
    
    return (
        <div className="min-h-screen"> 
            <Navbar />
            <form autoComplete="off" className="mt-8">
                <div className="text-center">

                    <div 
                        className={`border-2 inline-block ${isDragging ? "border-blue-500 bg-blue-100" : "border-dashed border-gray-500"} rounded-lg py-10 px-10 text-center my-2`}
                        ref={dragRef}
                        onDragEnter={onDragEnter}
                        onDragOver={onDragOver}
                        onDragLeave={onDragLeave}
                        onDrop={(e) => onDrop(e)}
                    >
                        <p>Drag and drop your videos here, or click the button below to select files.</p>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-2" onClick={(e) => handleUploadClick(e)}>Choose video</button>
                        <input className="ui"
                            type="file"
                            name="video"
                            accept="video/*"
                            placeholder="Video to analyse"
                            onChange={handleFile}
                            ref={inputRef}
                            hidden

                            />
                        </div>
                        
                        <div className="grid grid-cols-2">
                            <MultiDropDown
                                formFieldName={"Select the frame selection algorithm"}
                                options={["Structural Similarity", "Homography + Structural Similarity"]}
                                onChange={(selected) => console.log(selected)}
                                prompt={"Select one or more frame selection algorithm"}
                            />
                            <MultiDropDown
                                formFieldName={"Select the frame analysis model"}
                                options={["Small", "Large"]}
                                onChange={(selected) => console.log(selected)}
                                prompt={"Select one or more frame analysis model"}
                            />

                        </div>
                        />
                    </div>

                    <div className="text-2xl text-center bg-gray-300 py-2 px-2 mt-12">
                        <div className="inline-block bg-slate-100 rounded-xl p-2">
                            Analysed videos <p className={`inline-block ${uploadVideoCount == 4 ? 'text-red-600' : 'text-black'}`}>({uploadVideoCount}/4)</p>
                        </div>
                    </div>
                </div>
                <div className="grid grid-cols-1 gap-4 m-5 mt-2">
                    {
                        videos.length > 0
                        ? 
                        <>
                            {
                                [...videos].map((video, index) => {
                                
                                if (!video.youtube){
                                    // @ts-ignore
                                    return <SingleVideoUpload key={index} video={video} />
                                }
                                
                            })}
                            {
                                [...resultList].map((result, index) => {
                                    if (videos[index] && !videos[index].youtube) {
                                        // @ts-ignore
                                        return <VideoCard key={index} result={result} video={videos[index]}/>
                                    }
                            })}

                        </>
                        : 
                        null
                    }
                </div>
                { videos.length < 0 ? <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" /> : null }
            </form>
            <Footer />
        </div>

    );
}
export default VideoUpload;


