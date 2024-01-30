
import Navbar from "./Navbar";
import { useEffect, useState, useRef} from "react";
import { notification } from "antd";
import axios from "axios";
import { UploadOutlined } from '@ant-design/icons';


function VideoUpload() {
    
    const [shouldSubmit, setShouldSubmit] = useState(false);
    const [values, setValues] = useState({});
    const [errors, setErrors] = useState({});
    const inputRef = useRef(null);
    const handleChange = (event) => {
        event.persist();
        setValues((values) => ({
            ...values,
            [event.target.name]: event.target.value,
        }));
        setErrors((errors) => ({ ...errors, [event.target.name]: "" }));
        };

    function handleFile(e) {
        e.persist();
        if (e.target.files && e.target.files[0]) setValues((values) => ({
            ...values,
            [e.target.name]: e.target.files[0],
        }));
    }
    const handleUploadClick = (e) => {
        e.preventDefault();
        inputRef.current?.click();
      };
   

    const handleSubmit = (e) => {
        e.preventDefault();
        setErrors(validate(values));
        console.log(values);
        console.log(errors);
        if (Object.keys(values).length === 1) {
            const formData = new FormData();
            formData.append("video", values.video);
          
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


   
    
    useEffect(() => {
        if (shouldSubmit) {
          setValues("");
          openCheckoutNotficiation();
          
        }
      }, [shouldSubmit]);
    
      const openCheckoutNotficiation = () => {
        notification.open({
          message: "Success",
          description: "Your product post was successful",
          placement: "topLeft",
        });
      };

    const ValidationType = ({ type }) => {
        const ErrorMessage = errors[type];
        return (
          <>
            <span className="span" erros={errors[type]}>{ErrorMessage}</span>
         </>
        );
      };
    
        
    
    const notificationBelowZero = () => {
        notification.open({
          message: "Sorry",
          description: "Cannot set number of sizes available below 0.",
          placement: "topLeft",
        });
      };

    
    
    return (
       <> 
        <Navbar />
        
                <form autoComplete="off" >
                
              
                <div>
                        <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={(e) => handleUploadClick(e)}>Choose video</button>
                        <h3>{values.video ?`${values.video.name}` : 'Nothing selected'}</h3>
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
                    

                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleSubmit}>{"Submit"}</button>
                </form>
         
   
    </>

    );
}
export default VideoUpload;


