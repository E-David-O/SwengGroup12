import React from "react";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Contact = () => {
    const backgroundImageUrl = "https://upload.wikimedia.org/wikipedia/commons/c/c6/Historical_plan_of_Trinity_College%2C_Cambridge_%281897%29_-_cambridgedescri00atkiuoft_0571.png";
    const linkedInLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/LinkedIn_icon_circle.svg/480px-LinkedIn_icon_circle.svg.png";
    const instagramLogoUrl = "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Instagram_icon.png/480px-Instagram_icon.png";

    return (
        <>
            <Navbar />
            <h1 className="text-center text-3xl font-bold py-4">Contact Us</h1>
            <div className="contact-background" style={{ 
                position: "relative", // Make the position relative
                minHeight: "550px", // Adjust the height as needed
                paddingLeft: "100px", // Move the text to the left
                paddingTop: "0px", // Move the text up
                paddingBottom: "100px", // Move the text up
                backgroundImage: `url(${backgroundImageUrl})`,
                backgroundSize:  "contain", // Change backgroundSize to "contain",
                backgroundPosition: "center",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                textAlign: "left", // Align text to the left
                color: "white",
                textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)",
                fontFamily: "Arial, sans-serif", // Change font family
                fontSize: "2rem", // Enlarge font size
            }}>
                <div className="navy-background" style={{
                    borderRadius: "50px",
                    position: "absolute", // Position the background absolutely
                    top: "50%", // Position from the top
                    right: "30%", // Position from the left
                    transform: "translate(-50%, -50%)", // Center the background
                    width: "43%", // Make the background cover most of the width
                    height: "80%", // Make the background cover most of the height
                    backgroundColor: "rgba(16,24,39,0.9)", // Navy background with 50% opacity
                }}></div>
                <h2 style={{ fontWeight: "bold", textAlign: "left", zIndex: 1, fontSize: "3rem", marginTop: "10" }}>Get in touch with us!</h2>
                <p style={{ textAlign: "left", zIndex: 1, fontSize: "1.5rem", marginTop: "100" }}>We'd love to hear user feedback, queries,</p>
                <p style={{ textAlign: "left", zIndex: 1, fontSize: "1.5rem", marginTop: "0" }}>or any thoughts on our service.</p>
                <p style={{ textAlign: "left", zIndex: 1, fontSize: "1.5rem", marginTop: "0" }}> ___________________________________________</p>
                <p style={{ textAlign: "left", zIndex: 1, fontSize: "1.5rem", marginTop: "0" }}>Feel free to contact us below: </p>
                <p style={{ textAlign: "left", zIndex: 1, fontSize: "1.5rem", marginTop: "0" }}>Address: <a href="https://maps.app.goo.gl/CuDymYTUYgNRFzjU9" target="_blank" rel="noopener noreferrer" style={{ cursor: "pointer", color: "blue" }}>College Green, Dublin 2 </a></p>
                <p style={{ textAlign: "left", zIndex: 1, fontSize: "1.5rem", marginTop: "0" }}>Phone : +353 08 100 1000 </p>
                <p style={{ textAlign: "left", zIndex: 1, fontSize: "1.5rem", marginTop: "0" }}>Email : SWENG12@tcd.ie</p>
                <div style={{ display: "flex", position: "absolute", left: "460px", bottom: "80px" }}>
                    <a href="https://www.linkedin.com/company/sweng-group-12/about/" target="_blank" rel="noopener noreferrer">
                        <img src={linkedInLogoUrl} alt="LinkedIn" style={{ width: "60px", height: "60px", borderRadius: "50%", marginRight: "20px" }} />
                    </a>
                    <a href="https://www.instagram.com/" target="_blank" rel="noopener noreferrer">
                        <img src={instagramLogoUrl} alt="Instagram" style={{ width: "60px", height: "60px", borderRadius: "50%" }} />
                    </a>
                </div>
            </div>
            <Footer />
        </>
    );
}

export default Contact;
