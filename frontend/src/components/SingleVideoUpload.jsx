import {
    FileOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import axios from "axios";
import { VideoContext} from "./VideoUtil";
import { useContext, useState, useEffect } from "react";
import io from 'socket.io-client';
import { Link } from "react-router-dom";
import DropDown from "./DropDown";
import './typedef'
/** 
 * @param {Video} video
 * @returns SingleVideoUpload component
 * @description This component is used to upload a single video to the server
 * @example 
 * <SingleVideoUpload video={{file:testFile, uploaded : false, analysed: false, name: "test.mp4"}} />
 */
// @ts-ignore
function SingleVideoUpload({ video }) {
    const { videos, setVideos } = useContext(VideoContext)
    const [uploadProgress, setUploadProgress] = useState(null)
    const [frameRate, setFrameRate] = useState("")
    const [resolution, setResolution] = useState("")
    const [isUploaded, setIsUploaded] = useState(false)
    const [isAnalyzed, setIsAnalyzed] = useState(false)
    {
    // useEffect(() => {
    //     const socket = io("")
    //     socket.on("uploadProgress", (data) => {
    //       s  setUploadProgress(data) 
    //     })
    // }, [])
}
    useEffect(() => {
    console.log(uploadProgress);
    if(video.analysed !== true && video.uploaded === true) {
        const intervalId = setInterval(() => {
        setUploadProgress((uploadProgress) => {
            if (uploadProgress >= 100) {
            clearInterval(intervalId);
            return 0;
            } else {
            return uploadProgress + 2;
            }
        });
        }, 1000);
        return () => clearInterval(intervalId);
    }
    }, [isUploaded])

   
    

    /**
     * @param {MouseEvent} e
     * @returns {void}
     * @description This function is used to handle the file upload 
     */
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(video);
        if (video) {
            const formData = new FormData();
            formData.append("video", video.file);
            formData.append("resolution", resolution);
            formData.append("frameRate", frameRate);
            video.uploaded = true;
            setIsUploaded(true);
            axios({
                method: 'post',
                url: "http://localhost:8000/upload",
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(() => {
                console.log("Video uploaded");
                video.analysed = true;
                
                })
            .catch(function (error) {
                // handle error
                console.log(error);
            });  
            
        }
      }

    /**
     * @typedef {Object} MouseEvent
     * @param {MouseEvent} e
     * @returns {void}
     * @description This function is used to delete the video from the list of videos 
     */

    const deleteVideo = (e) => {
        e.preventDefault();
        console.log(videos);
        setVideos(videos.filter(videos => videos.name !== video.name));
    }
    return (
        <div>
        { video.uploaded ? ( (video.analysed || (uploadProgress === 100)) ? ( 
           <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-4 text-xl">
                <Link className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" to={`/analysis/${video.name}`}>Click Here to View Analysis of {video.name}</Link>
                <button onClick={e => deleteVideo(e)}><DeleteOutlined className="hover:bg-blue-700" style={{ fontSize: '250%'}}/></button>
            </div> ) : (
            (
                <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-4 text-xl">
            <div className="w-full bg-gray-200 content-centre rounded-full h-2.5 dark:bg-gray-700 shadow-lg">
                {uploadProgress ?
                <><div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${uploadProgress}%` }}>
                </div><span>Analysing {video.name} ...</span></> : 
                <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `0%` }}>
                </div> }
            </div> 
            </div>)))
         : (
        <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-4 text-xl">
            <FileOutlined style={{ fontSize: '250%'}}/>
            <h3 className="pt-3">{video.name}</h3>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmit}>{"Submit"}</button>
            <DropDown label={"Select Resolution"} options={["Auto","1080","720","480"]} selected={resolution} setSelected={setResolution} />
            <DropDown label={"Select Frame Rate"} options={["Auto","60","30","15"]} selected={frameRate} setSelected={setFrameRate} />
            <button onClick={e => deleteVideo(e)}><DeleteOutlined className="hover:bg-blue-700" style={{ fontSize: '250%'}}/></button>
        </div> )}
        </div>
    );
}




export default SingleVideoUpload;