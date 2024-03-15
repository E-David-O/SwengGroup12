
import Navbar from "./Navbar";
import { useState, useRef, useContext} from "react";
import SingleVideoUpload from "./SingleVideoUpload";
import { VideoContext } from "./VideoUtil";
import axios from "axios";
/**
 * 
 * @returns VideoUpload component
 * @description This component is used to upload videos to the server
 * 
 */


function VideoUpload() {
    const { videos, setVideos } = useContext(VideoContext);
    const inputRef = useRef(null);
    const [url, setUrl] = useState("");
   

    /**
     * @typedef {Object} ChangeEvent
     * @param {ChangeEvent} e
     * @returns {void}
     * @description This function is used to handle the file upload 
     */
    function handleFile(e) {
        e.preventDefault();
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
    
    return (
       <> 
        <Navbar />
        
                <form autoComplete="off">
                <div className="text-center">
                    <div>
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
                        <p>or</p>
                        <div>
                            <label htmlFor="website" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Youtube URL</label>
                            <div className="flex justify-center">
                            <input  
                                onChange={handleChange}
                                value={url || ""}
                                type="url" 
                                id="website"
                                className="w-3/4 bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="youtube.com" required />
                            </div>
                            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-2" onClick={(e) => handleURL(e)}>Upload from URL</button>
                        </div>
                </div>
                        <div className="grid grid-cols-1 gap-4 m-5">
                        {videos.length > 0? [...videos].map((video, index) => (<SingleVideoUpload key={index} 
// @ts-ignore
                        video={video} />))
                        : null}
                        </div>
                       { videos.length > 0 ? <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" /> : null }
                </form>
         
   
    </>

    );
}
export default VideoUpload;


