
import Navbar from "./Navbar";
import { useEffect, useState, useRef, useContext} from "react";
import axios from "axios";
import SingleVideoUpload from "./SingleVideoUpload";
import { VideoContext } from "./VideoUtil";
import VideoRow from "./VideoRow";
/**
 * 
 * @returns VideoUpload component
 * @description This component is used to upload videos to the server
 * 
 */


function VideoUpload() {
    const { videos, setVideos } = useContext(VideoContext);
    const [cachedVideos, setCachedVideos] = useState([]);
    const inputRef = useRef(null);

    // useEffect(() => {
    //   axios
    //       .get("http://localhost:8080/videos")
    //       .then((response) => {
    //           setCachedVideos(response.data);
    //       })
    //       .catch(function (error) {
    //           // handle error
    //           console.log(error);
    //           });
    //       }, []);



    /**
     * @typedef {Object} ChangeEvent
     * @param {ChangeEvent} e
     * @returns {void}
     * @description This function is used to handle the file upload 
     */
    function handleFile(e) {
        e.preventDefault();
        if (videos.length > 0 && videos.length < 4) {
            setVideos([...videos, { file: e.target.files[0], uploaded: false, analysed: false, name: e.target.files[0].name }]);
        } else if (videos.length === 0) {
            setVideos([{ file: e.target.files[0], uploaded: false, analysed: false, name: e.target.files[0].name }]);
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
       
    
    return (
       <> 
        <Navbar />
        
                <form autoComplete="off" >
                <div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full m-2" onClick={(e) => handleUploadClick(e)}>Choose video</button>
                        <input className="ui"
                            type="file"
                            name="video"
                            accept="video/mp4, video/mov"
                            placeholder="Video to analyse"
                            value={""}
                            onChange={handleFile}
                            ref={inputRef}
                            hidden
                            />
                        </div>
                        <div className="grid grid-cols-1 gap-4 m-5">
                        {videos.length > 0? [...videos].map((video, index) => (<SingleVideoUpload key={index} 
// @ts-ignore
                        video={video} />))
                        : null}
                        </div>
                       { videos.length > 0 ? <hr className="my-12 h-0.5 border-t-0 bg-neutral-100 opacity-100 dark:opacity-50" /> : null }
                <div className="grid grid-flow-row auto-rows-max">
                    {[...cachedVideos].map((video, index) => (
                      <VideoRow key={index} video={video} 
                      />))}
                </div>
                </form>
         
   
    </>

    );
}
export default VideoUpload;


