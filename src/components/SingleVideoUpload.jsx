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
        if (Object.keys(values).length === 1) {
            const formData = new FormData();
            formData.append("video", getVideo());
            axios({
                method: 'post',
                url: '',
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
            })
            .then(() => {
                setShouldSubmit(true);
                })
            .catch(function (error) {
                // handle error
                console.log(error);
            });  
            
        }
      }

    const getVideo = () => {
        console.log(videos);
        for(v in videos) {
            if(videos.name === video.name) {
                return v;
            }
        }
    }

    const deleteVideo = (e) => {
        e.preventDefault();
        console.log(videos);
        setVideos(videos.filter(videos => videos.name !== video.name));
    }
    return (
        <div className="flex gap-2 content-center shadow-lg ">
            <FileOutlined style={{ fontSize: '250%'}}/>
            <span>{video.name}</span>
            <button onClick={e => deleteVideo(e)}><DeleteOutlined style={{ fontSize: '250%'}}/></button>
            <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmit}>{"Submit"}</button>
        </div>
    );
}




export default SingleVideoUpload;