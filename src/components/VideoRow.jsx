import {
    FileOutlined,
    DeleteOutlined
} from "@ant-design/icons";
import { Link } from "react-router-dom";


function VideoRow( { video }) {
    return (
        <div>
            <FileOutlined/>
            <Link to={`/analysis/${video.name}`}>{video.name}</Link>
            <DeleteOutlined/>
        </div>
    );
}




export default VideoRow;