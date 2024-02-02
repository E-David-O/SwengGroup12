import {
    FileOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import axios from "axios";
import { VideoContext} from "./VideoUtil";
import { useContext } from "react";

function SingleVideoUpload({ video }) {
    const { videos, setVideos } = useContext(VideoContext)
    const handleSubmit = (e) => {
        e.preventDefault();
        console.log(video);
        if (video) {
            const formData = new FormData();
            formData.append("video", video);
            axios({
                method: 'post',
                url: 'http://127.0.0.1:5000/upload',
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(() => {
                console.log("Video uploaded");
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
        <div className="flex content-center justify-between shadow-lg rounded-full hover:shadow-lg hover:bg-blue-300">
            <FileOutlined style={{ fontSize: '250%'}}/>
            <p>{video.name}</p>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmit}>{"Submit"}</button>
            <button onClick={e => deleteVideo(e)}><DeleteOutlined style={{ fontSize: '250%'}}/></button>
           
        </div>
    );
}




export default SingleVideoUpload;