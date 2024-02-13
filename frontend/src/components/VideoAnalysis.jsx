import { useEffect} from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import { Player } from "video-react";
import axios from "axios";

function VideoAnalysis() {
    const title = useParams();
    const [video, setVideo] = useState(null);
    useEffect(() => {
        const url = `http://localhost:8000/${title.id}`;
        axios
            .get(url)
            .then((response) => {
                console.log(response);
                setVideo(response.data.filePath);
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                });
    }, [])
       
    return (
        <>
            <Navbar />
            <h3>Analysis for {title.id}</h3>
            <Player
                playsInline
                fluid={false}
                width={480}
                height={272}
            ><source src={`http://localhost:8000/${video}`}/></Player>
        </>
    );
}
export default VideoAnalysis;


