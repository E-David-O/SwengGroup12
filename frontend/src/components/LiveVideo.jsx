import Webcam from "react-webcam";
import Navbar from "./Navbar";
import { useState, useRef, useCallback}from "react";


function LiveVideo() {
  const webcamRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const [capturing, setCapturing] = useState(false);
  const [camEnabled, setCamEnabled] = useState(false);
  const [recordedChunks, setRecordedChunks] = useState([]);

  const handleStartCaptureClick = useCallback(() => {
    setCapturing(true);
    mediaRecorderRef.current = new MediaRecorder(webcamRef.current.stream, {
      mimeType: "video/webm"
    });
    mediaRecorderRef.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    mediaRecorderRef.current.start();
  }, [webcamRef, setCapturing, mediaRecorderRef]);

  const handleDataAvailable = useCallback(
    ({ data }) => {
      if (data.size > 0) {
        setRecordedChunks((prev) => prev.concat(data));
      }
    },
    [setRecordedChunks]
  );

  const handleStopCaptureClick = useCallback(() => {
    mediaRecorderRef.current.stop();
    setCapturing(false);
  }, [mediaRecorderRef, webcamRef, setCapturing]);

  const handleDownload = useCallback(() => {
    if (recordedChunks.length) {
      const blob = new Blob(recordedChunks, {
        type: "video/webm"
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      document.body.appendChild(a);
      a.style = "display: none";
      a.href = url;
      a.download = "react-webcam-stream-capture.webm";
      a.click();
      window.URL.revokeObjectURL(url);
      setRecordedChunks([]);
    }
  }, [recordedChunks]);

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
    {recordedChunks.length > 0 && (
    <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full" onClick={handleDownload}>Download</button>
    )}
    </div>
    
    </>
  );
}

export default LiveVideo;