import React, { useState } from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";
import "./servicesSlider.css";

/**
 * @returns Services component
 * @description This component will make up the page for our "Services" page. This will explain in further detail the
 * services our website offers along with its functionality.
 */

function Services() {
    const fruits = [
        { 
          id: 0, 
          title: "Analyse your uploaded video", 
          history: "Uploading a video via a file is a seamless process with our platform. Simply navigate to the upload section, select your desired video file from your device, and let our advanced video analysis system do the rest. Our AI-driven technology swiftly examines the content, identifying objects and themes while providing precise confidence estimates for each detection. This streamlined approach not only ensures content safety but also facilitates a secure environment for advertisers on various social media platforms."
        },
        { 
          id: 1, 
          title: "Analyse a Live video", 
          history: "With the option to upload via live recorded video, our platform allows users to share content in real-time while maintaining stringent safety standards. AI-driven analysis swiftly assesses the content from anywhere with the ease of using live video. This feature not only enhances content moderation capabilities but also facilitates the creation of a secure media environment conducive to advertising on social platforms." 
        },
        { 
          id: 2, 
          title: "Analyse a Youtube video", 
          history: "Seamlessly integrate YouTube content analysis into your workflow by uploading a URL link directly to our platform. Our user-friendly dashboard simplifies the process, allowing you to effortlessly review and manage analyses. Whether it's a video from your own channel or curated content from other creators, our advanced video analysis technology meticulously examines the content, providing invaluable insights into object detection and theme identification. We recognise the potentintial for advertisers using platforms such as YouTube, therefor we felt it vital to include investigatoin of videos via url. By analyzing videos on social media platforms through URL links, our platform revolutionizes content safety, ensuring a secure space for advertisers and users alike." 
        }
      ];
      
  const [selectedFruit, setSelectedFruit] = useState(fruits[0]);

  const handleClick = (index) => {
    const selected = fruits[index];
    setSelectedFruit(selected);
  };

  return (
    <>
      <Navbar />
      <h1 className="text-center text-4xl font-bold py-4">Our Services</h1>
      <div className="text-center py-4">
        <h1 className="inline-block text-3xl font-bold"> Three dynamic ways to get your videos analysed! </h1>
      </div>

      <div className="main" style={{ marginTop: "30px" } }>
        <div className="box">
          <h2 className="box-title text-3xl font-bold">{selectedFruit.title}</h2>
          <div className="box-paragraph-container" style={{ backgroundColor: "white", padding: "10px", borderRadius: "25px", border: "1px solid black", width: "40%", margin: "0 auto" }}>
            <p className="box-paragraph" style={{ fontSize: "1.2rem" }} dangerouslySetInnerHTML={{ __html: selectedFruit.history }}></p>
          </div>
        </div>
        <div className="text-center" style={{ marginTop: "30px" }}>
          <p className="text-xl py-2" style={{ fontWeight: "bold", color: "black", border: "2px solid white", padding: "10px", display: "inline-block" }}>Click each logo below to learn <br />more about our services</p>
        </div>
        <div className="flex_row">
          {fruits.map((fruit, index) => (
            <button className="fruit-button" key={index} onClick={() => handleClick(index)} >
              {/* Black circle */}
              {index === 0 ? (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Octicons-file-text.svg/1200px-Octicons-file-text.svg.png"
                  alt="File Symbol"
                  style={{ width: "45px", height: "40px" }}
                />
              ) : index === 1 ? (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/thumb/1/15/Ic_camera_alt_48px.svg/2048px-Ic_camera_alt_48px.svg.png"
                  alt="Camera Symbol"
                  style={{ width: "45px", height: "40px" }}
                />
              ) : index === 2 ? (
                <img
                  src="https://upload.wikimedia.org/wikipedia/commons/e/ef/Youtube_logo.png"
                  alt="Youtube Logo"
                  style={{ width: "45px", height: "40px" }}
                />
              ) : (
                <div className="black-circle"></div>
              )}
            </button>
          ))}
        </div>
      </div>

      <Footer />
    </>
  );
}

export default Services;
