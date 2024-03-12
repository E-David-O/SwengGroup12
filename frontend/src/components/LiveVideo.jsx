import Webcam from "react-webcam";
import Navbar from "./Navbar";
import { useState, useRef, useCallback, useMemo, useEffect}from "react";
import axios from "axios";




function LiveVideo() {
  const webcamRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);
  const [results, setResults] = useState([]);
  const [mostRecent, setMostRecent] = useState([]);
  let data = [];
  let images = [];
  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
  }, [setCapturing]);

  const calculateData = () => {
    let data = {};
      results.forEach((f) => {
              f.forEach((r) => {
                r.results.forEach((r) => {
                  if (data[r.class_id]) {
                      data[r.class_id] += 1;
                  } else {
                      data[r.class_id] = 1;
                  }
                });
              });
            });
            let sortable = [];
            for(let object in data) {
              sortable.push([object, data[object]])
            };
            sortable.sort(function(a,b) {
              return b[1] - a[1];
            })
            return sortable;
  
        }
        const calculateDataArray = () => {
          let data = [];
          results.forEach((f) => {
              console.log(f)
              data.push(f.image);
            });
            return data;
        }
        data = useMemo(() => calculateData(), [results]);
        images = useMemo(() => calculateDataArray(), [results]);
          useEffect(() => {
            const interval = setInterval(() => {
              if(capturing) {
              
                if(recordedChunks.length <= 100) {
                setRecordedChunks([...recordedChunks, webcamRef.current.getScreenshot()])
                } else {
                  const formData = new FormData();
                  console.log(recordedChunks);
                  for (let i = 0; i < recordedChunks.length; i++) {
                    formData.append("files",  recordedChunks[i]);
                  }
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
                  setResults([...results, response.data]);
                  setMostRecent(response.data);
                })
                .catch(function (error) {
                  // handle error
                  console.log(error);
                });  
            }
          }
      }, 50);
      return () => clearInterval(interval);
  }, [capturing, recordedChunks, results, data, setResults, setMostRecent, setRecordedChunks]); 

  

  const handleStopCaptureClick = useCallback(() => {
    setCapturing(false);
  }, [setCapturing]);


  const webcamBool = useCallback(() => {
        setCamEnabled(!camEnabled);
  }, [camEnabled]);

  return (
    <>
    <Navbar/>
    <div>
    {camEnabled ? (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2" onClick={webcamBool}>Disable Webcam</button>
    ) : (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full my-2" onClick={webcamBool}>Enable Webcam</button>
    )}
    {camEnabled && <Webcam audio={false} ref={webcamRef}/>}
    </div>
    <div>
    {capturing ? (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleStopCaptureClick}>Stop Capture</button>
    ) : (
    <button className=" bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full"onClick={handleStartCaptureClick}>Start Capture</button>
    )}
    </div>
    <p>Closest Analysed Chunk</p>
    <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Most Recent Chunk Analysis</p>
    <div className="grid grid-cols-3 gap-1 m-1">
    {mostRecent.length !== 0 ? mostRecent?.map((f, i) => (
      
      <img src={`data:image/jpeg;base64,${f.image}`} key={i}/>
      
    )) 
    : <p>No Recent Results</p>}
    
    </div>
    <p className="bg-blue-500 text-white font-bold py-2 px-4 rounded-full">Aggregate Video Analysis</p>
    <div className="grid grid-cols-3 gap-1 m-1">
    { data.length !== 0 ? data?.map((f, i) => {
            return <div className="flex content-center justify-between shadow-lg rounded-full hover:bg-blue-900 p-1 text-s" key={i}>Object: {f[0]}, Occurances: {f[1]}</div>
    }) : <p>No Total Results</p>}
    </div>

    </>
  );
}

export default LiveVideo;