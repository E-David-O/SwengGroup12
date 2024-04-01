
import Webcam from "react-webcam";
import Navbar from "./Navbar";
import Footer from "./Footer";
import { useState, useRef, useCallback, useEffect}from "react";
import axios from "axios";
import { FaCamera } from 'react-icons/fa';
import { RiLiveFill } from 'react-icons/ri'
import MultiDropDown from "./MultiDropDown";
import LiveVideoAnalysis from "./LiveVideoAnalysis";

function LiveVideo() {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [results, setResults] = useState([]);
  const [mostRecent, setMostRecent] = useState([]);
  const [algorithm, setAlgorithm] = useState([]);
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
  }, [setCapturing]);


        useEffect(() => {
          const interval = setInterval(() => {
            if(capturing) {
            
              if(recordedChunks.length <= 50) {
              setRecordedChunks([...recordedChunks, webcamRef.current.getScreenshot()])
              } else {
                const formData = new FormData();
                console.log(recordedChunks);
                for (let i = 0; i < recordedChunks.length; i++) {
                  formData.append("files",  recordedChunks[i]);
                }
                let selector = [...algorithm].join(", ");
                if(selector === "") {
                  selector = "Structural Similarity";
                }
                formData.append("frameselector", selector);
              setRecordedChunks([]);
              axios({
                method: 'post',
                url: "http://localhost:8000/uploadLive",
                data: formData,
                headers: {'Content-Type': 'multipart/form-data' }
              })
              .then((response) => {
                console.log("Chunks uploaded");
                console.log(response.data);
                let newResults = [...results]; 
                if(newResults.length !== 0) {
                  switch(response.data.length) {
                    case 1:
                      if(newResults.find((r) => r.selector === response.data[0].selector)) {
                        newResults.find((r) => r.selector === response.data[0].selector).frames.push(response.data[0].frames);
                      } else {
                        newResults.push(response.data[0]);
                      }
                      break;
                    case 2:
                      if(newResults.find((r) => r.selector === response.data[0].selector)) {
                        newResults.find((r) => r.selector === response.data[0].selector).frames.push(response.data[0].frames);
                      } else {
                        newResults.push(response.data[0]);
                      }
                      if(newResults.find((r) => r.selector === response.data[1].selector)) {
                        newResults.find((r) => r.selector === response.data[1].selector).frames.push(response.data[1].frames);
                      } else {
                        newResults.push(response.data[1]);
                      }
                      break;
                    case 3: 
                      if(newResults.find((r) => r.selector === response.data[0].selector)) {
                        newResults.find((r) => r.selector === response.data[0].selector).frames.push(response.data[0].frames);
                      } else {
                        newResults.push(response.data[0]);
                      }
                      if(newResults.find((r) => r.selector === response.data[1].selector)) {
                        newResults.find((r) => r.selector === response.data[1].selector).frames.push(response.data[1].frames);
                      } else {
                        newResults.push(response.data[1]);
                      }
                      if(newResults.find((r) => r.selector === response.data[2].selector)) {
                        newResults.find((r) => r.selector === response.data[2].selector).frames.push(response.data[2].frames);
                      } else {
                        newResults.push(response.data[2]);
                      }
                      break;
                    default:
                      break;
                  }
                  setResults(newResults);
                } else {
                  setResults(response.data);
                }
                if(response.data.length === 2 && (mostRecent.length === 2 || mostRecent.length === 0) 
                || response.data.length === 3  
                || response.data.length === 1 && (mostRecent.length === 1 || mostRecent.length === 0) ) {
                  setMostRecent(response.data);
                } else {
                  let newMostRecent = [...mostRecent];
                  switch(response.data.length) {
                    case 1:
                      if(newMostRecent.find((r) => r.selector === response.data[0].selector)) {
                        const index = newMostRecent.findIndex((r) => r.selector === response.data[0].selector);
                        newMostRecent[index] = response.data[0];
                      } else {
                        newMostRecent.push(response.data[0]);
                      }
                      break;
                    case 2:
                      if(newMostRecent.find((r) => r.selector === response.data[0].selector)) {
                       const index = newMostRecent.findIndex((r) => r.selector === response.data[0].selector);
                        newMostRecent[index] = response.data[0];
                      } else {
                        newMostRecent.push(response.data[0]);
                      }
                      if(newMostRecent.find((r) => r.selector === response.data[1].selector)) {
                        const index = newMostRecent.findIndex((r) => r.selector === response.data[1].selector);
                        newMostRecent[index] = response.data[1];
                      } else {
                        newMostRecent.push(response.data[1]);
                      }
                      break;
                    default:
                      break;
                  }
                  setMostRecent(newMostRecent);
                }
              })
              .catch(function (error) {
                // handle error
                console.log(error);
              });  
          }
        }
    }, 50);
    return () => clearInterval(interval);
}, [capturing, recordedChunks, results, setResults, setMostRecent, setRecordedChunks]); 



  const handleStopCaptureClick = useCallback(() => {
    setCapturing(false);
  }, [setCapturing]);


  const webcamBool = useCallback(() => {
        setCamEnabled(!camEnabled);
        if (camEnabled)
          setCapturing(false)
  }, [camEnabled, capturing]);

  return (
    <div className="min-h-screen text-center">
      <Navbar/>
      <div className="text-center">
        <div className="flex flex-col items-center m-4">
          {camEnabled 
            ? (
                <Webcam audio={false} ref={webcamRef}/>
              )
            :
              (
                <div className="h-96 w-1/2 border-4 border-dashed border-slate-500 flex justify-center items-center">
                  <FaCamera className="text-slate-400 text-6xl inline-block mx-2" />
                </div>
              )
          }
          {capturing
            ?
              (
                <div className="bg-white p-1.5 rounded-xl"><RiLiveFill className="text-red-600 text-2xl inline-block mx-2" />Recording in progress...</div>
              )
            :
              (
                <div></div>
              )
          }
        </div>
        {camEnabled 
          ? (
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full mb-2" 
                onClick={webcamBool}>
                  Disable Webcam
              </button>
            ) 
          : 
            (
              <button 
                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2" 
                onClick={webcamBool}>
                  Enable Webcam
              </button>
            )
        }
        <div className="inline-block px-4 mb-6">
          {capturing 
            ? (
                <button 
                  className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" 
                  onClick={handleStopCaptureClick}>
                    Stop Capture
                </button>
              ) 
            : 
              (
                <button 
                  className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"
                  onClick={handleStartCaptureClick}>
                    Start Capture
                </button>
              )
          }
        </div>
        <div className="mb-2 flex justify-center">
          <MultiDropDown
              formFieldName={"Select the frame selection algorithm"}
              options={["Structural Similarity", "Structural Similarity + Homogeny", "Frame by Frame"]}
              onChange={(selected) => {
                  console.log(selected)
                  setAlgorithm(selected)
              }}
              prompt={"Select frame selection algorithm(s)"}
          />
        </div>

      </div>
      {results.length !==0 ? 
          results?.map((result, index) => (
            // @ts-ignore
            <LiveVideoAnalysis key={index} results={result} mostRecent={mostRecent.find((r) => r.selector === result.selector)} />
          )) 
        : 
          <p>No results</p>
      }
      <Footer />
    </div>
  );
}

export default LiveVideo;
