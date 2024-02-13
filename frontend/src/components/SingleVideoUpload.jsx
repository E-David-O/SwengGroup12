import {
    FileOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import axios from "axios";
import { VideoContext} from "./VideoUtil";
import { useContext, useState, useEffect } from "react";
import io from 'socket.io-client';
import { Link } from "react-router-dom";


function SingleVideoUpload({ video }) {
    const { videos, setVideos } = useContext(VideoContext)
    const [uploadProgress, setUploadProgress] = useState(null)
    {
    // useEffect(() => {
    //     const socket = io("")
    //     socket.on("uploadProgress", (data) => {
    //         setUploadProgress(data) 
    //     })
    // }, [])
}
    useEffect(() => {
    if(!video.analysed) {
        const intervalId = setInterval(() => {
        setUploadProgress((uploadProgress) => {
            if (uploadProgress >= 100) {
            clearInterval(intervalId);
            return 100;
            } else {
            return uploadProgress + 10;
            }
        });
        }, 1000);
        return () => clearInterval(intervalId);
    }
    }, [video.uploaded])

    useEffect(() => {
        console.log(uploadProgress);
        if (uploadProgress === 100) {
            video.analysed = true;
        }
    }, [uploadProgress])

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(video);
        if (video) {
            const formData = new FormData();
            formData.append("video", video);
            axios({
                method: 'post',
                url: "http://localhost:8000/upload",
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(() => {
                console.log("Video uploaded");
                video.uploaded = true;
                })
            .catch(function (error) {
                // handle error
                console.log(error);
            });  
            
        }
      }

    

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
                <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${uploadProgress}%` }}>
                </div>
                <span>Analysing {video.name} ...</span>
            </div> 
            </div>)))
         : (
        <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-4 text-xl">
            <FileOutlined style={{ fontSize: '250%'}}/>
            <h3 className="pt-3">{video.name}</h3>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmit}>{"Submit"}</button>
            <button onClick={e => deleteVideo(e)}><DeleteOutlined className="hover:bg-blue-700" style={{ fontSize: '250%'}}/></button>
        </div> )}
        </div>
    );
}




export default SingleVideoUpload;