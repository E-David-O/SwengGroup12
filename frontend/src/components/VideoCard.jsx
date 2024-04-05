import { useContext, useCallback} from "react";
import { useLocation} from "react-router-dom";
import { VideoContext } from "./VideoUtil";
import { Link } from "react-router-dom";
import NavbarButton from "./NavbarButton";

function VideoCard(props) {
    const test = useLocation();
    const title = decodeURI(test.pathname.split("/").slice(-1).toString() + test.search);
    const { videos, setVideos, resultList, setResultList } = useContext(VideoContext)

    const videoName = props.result.name;
    const duration = props.video ? props.video.duration : "23 seconds";
 
    let base64ImageData = ""
    if (props.result.results[0].frames.length > 0) {
        base64ImageData = props.result.results[0].frames[0].image;
    }
    const imageDataUrl = `data:image/jpeg;base64,${base64ImageData}`;

    const deleteVideo = useCallback(() => {
        
        setVideos(videos.filter(video => video.name !== videoName));
        setResultList(resultList.filter(result => result.name !== videoName))
        
    }, [videos, setVideos, resultList, setResultList])
    
    return (
        <div className="max-w-xl mx-auto bg-slate-200 p-6 rounded-xl shadow-lg flex items-center space-x-4">
            <img 
                src={imageDataUrl} 
                alt={videoName}
                className="object-cover w-48 h-48 rounded-lg shadow-sm"
            />
            <div className="flex flex-col justify-between space-y-2">
                <p className="text-2xl font-semibold text-gray-800">
                    {videoName}
                </p>
                {/* <p className="text-gray-600">Video Length: {duration}</p> */}
                <div className="flex space-x-2">
                    <Link 
                        to={`/comparison/${videoName}`}
                        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Comparison
                    </Link>
                    <button 
                        onClick={deleteVideo}
                        className="bg-red-500 hover:bg-red-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-200"
                    >
                        Delete
                    </button>
                </div>
            </div>
        </div>
    );
}

export default VideoCard;

export function getFileFromBase64(string64, fileName) {
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