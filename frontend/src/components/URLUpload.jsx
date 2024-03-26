import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState, useRef, useContext, useEffect } from "react";
import SingleVideoUpload from "./SingleVideoUpload";
import { VideoContext } from "./VideoUtil";
import axios from "axios";
import VideoCard from "./VideoCard";
import { FaYoutube } from 'react-icons/fa';

/**
 * 
 * @returns VideoUpload component
 * @description This component is used to upload videos to the server
 * 
 */


function URLUpload() {
    let { videos, setVideos } = useContext(VideoContext);
    let { _ , resultList} = useContext(VideoContext);
    const inputRef = useRef(null);
    const [url, setUrl] = useState("");
    const [youtubeVideoCount, setYoutubeVideoCount] = useState(0)

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
   

    const handleURL = async (e) =>{
        e.preventDefault();
        if (url.match(/^(?:https?:\/\/)?(?:m\.|www\.)?(?:youtu\.be\/|youtube\.com\/(?:embed\/|v\/|watch\?v=|watch\?.+&v=))((\w|-){11})(?:\S+)?$/)) {
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
            

            if (youtubeVideoCount >= 4) {
                alert("You can only upload 4 videos at a time");
            }
            else if (videos.length > 0) {
                setVideos([...videos, { file: checkURL, uploaded: false, analysed: false, name: title, youtube: true }]);
            }
            else {
                setVideos([{ file: checkURL, uploaded: false, analysed: false, name: title, youtube: true }]);
            }
        } else {
            alert("Please enter a valid youtube URL");
        }
    }

    useEffect(() => {
        let youtubeVideoCounts = 0
        for (let i = 0; i < videos.length; i++){
            if (videos[i].youtube){
                youtubeVideoCounts++
            }
        }
        setYoutubeVideoCount(youtubeVideoCounts)
    }, [videos]);

    const handleUploadClick = (e) => {
        e.preventDefault();
        inputRef.current?.click();
      };
    
    const handleChange = (event) => {
        event.persist();
        setUrl(event.target.value);
    }

    const deleteVideo = (videoName) => {
        let newResultList = resultList.filter((result) => {result.name !== videoName});
    }
    
    return (
       <div className="min-h-screen"> 
        <Navbar />
        
                <form autoComplete="off">
                <div className="text-center">
                        <div>
                            <label htmlFor="website" className="block my-4 text-3xl font-medium text-gray-900 bg-slate-200 p-4 rounded-xl inline-block"><FaYoutube className="text-red-600 text-6xl inline-block mx-2" />Youtube Video Analysis</label>
                            <div className="flex justify-center">
                            <input  
                                onChange={handleChange}
                                value={url || ""}
                                type="url" 
                                id="website"
                                className="my-4 w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" 
                                placeholder="Insert your youtube url" 
                                required 
                            />
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-2" onClick={(e) => handleURL(e)}>Upload from URL</button>
                        </div>
                </div>
                <div className="text-2xl text-center bg-gray-300 py-2 px-2 mt-12">
                    <div className="inline-block bg-slate-100 rounded-xl p-2">
                        Analysed videos <div className={`inline-block ${youtubeVideoCount == 4 ? 'text-red-600' : 'text-black'}`}>({youtubeVideoCount}/4)</div>
                    </div>
                </div>
                        <div className="grid grid-cols-1 gap-4 m-5">
                        {videos.length > 0
                        
                            ? 
                            <>
                                {
                                    [...videos].map((video, index) => {
                                        if (video.youtube){
                                            // @ts-ignore
                                            return (<SingleVideoUpload key={index} video={video} />)
                                        }
                                    })}
                                {// @ts-ignore
                                    [...resultList].map((result, index) => {
                                        if (videos[index] && videos[index].youtube) {
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
export default URLUpload;