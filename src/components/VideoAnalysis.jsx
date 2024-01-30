import { useEffect} from "react";
import Navbar from "./Navbar";
import { useParams } from "react-router-dom";
import axios from "axios";
import {
    WarningOutlined
} from "@ant-design/icons"
function VideoAnalysis() {
    const title = useParams();   
    useEffect(() => {
        const url = `http://localhost:8080/${title.title}`;
        axios
            .get(url)
            .then((response) => {
               
               
            })
            .catch(function (error) {
                // handle error
                console.log(error);
                });
    }, [])
       
    return (
        <>
            <Navbar />
            <h3>Analysis for {title}</h3>
            <div className="grid grid-cols-2 gap-4">
                <div><WarningOutlined /></div>
                <div><WarningOutlined /></div>
            </div>
        </>
    );
}
export default VideoAnalysis;


