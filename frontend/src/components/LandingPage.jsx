import Navbar from "./Navbar";

/**
 * 
 * @returns HomePage component
 * @description This component will be the home page of our website. This is the first page users will see before logging in.
 * 
 */


function LandingPage() {
    return (
        <>
            <Navbar />
            <h1 className="text-center text-xl">Welcome to Video Analytics by SWENG Group 12!</h1>
            <img 
                src="https://upload.wikimedia.org/wikipedia/commons/3/38/Detected-with-YOLO--Schreibtisch-mit-Objekten.jpg" 
                alt="Camera" 
                width="40%"
                height="350"
            />
        </>
    );
}

export default LandingPage;