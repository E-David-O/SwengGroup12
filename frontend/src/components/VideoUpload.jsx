import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState, useRef, useContext, useEffect} from "react";
import SingleVideoUpload from "./SingleVideoUpload";
import VideoCard from "./VideoCard";
import { VideoContext } from "./VideoUtil";
import axios from "axios";
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
        
        if (videos.length > 0 && videos.length < 4) {
            setVideos([...videos, { file: e.target.files[0], uploaded: false, analysed: false, name: e.target.files[0].name, youtube: false}]);
        } else if (videos.length === 0) {
            setVideos([{ file: e.target.files[0], uploaded: false, analysed: false, name: e.target.files[0].name, youtube: false}]);
        } else {
            alert("You can only upload 4 videos at a time");
        }
        console.log(videos);
        console.log(videos.length);
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

                    <div className="text-2xl text-center bg-gray-300 py-2 px-2 mt-12">
                        <p className="inline-block bg-slate-100 rounded-xl p-2">
                            Analysed videos <p className={`inline-block ${videos.length == 4 ? 'text-red-600' : 'text-black'}`}>({videos.length}/4)</p>
                        </p>
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

                                    if (!videos[index].youtube) {
                                        // @ts-ignore
                                        return <VideoCard key={index} result={result} />
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


