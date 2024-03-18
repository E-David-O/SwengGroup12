import Navbar from "./Navbar";
import Footer from "./Footer";
import GetStartedButton from "./GettingStartedButton";
import { Link } from "react-router-dom";

/**
 * 
 * @returns LandingPage component
 * @description This component will be the home page of our website. This is the first page users will see before logging in.
 * 
 */

function LandingPage() {
    return (
        <>
            <Navbar />
            <div className="container text-center mx-auto px-4">
                <h1 className="text-center text-3xl font-bold px-4 py-2 inline-block rounded-2xl mt-10 mb-5 bg-slate-200 hover:bg-slate-100 hover:shadow-lg transition ease-in duration-200">
                    Welcome to Video Analytics by SWENG Group 12!
                </h1>
                <img 
                    src="https://upload.wikimedia.org/wikipedia/commons/3/38/Detected-with-YOLO--Schreibtisch-mit-Objekten.jpg" 
                    alt="Desk object visualisation" 
                    className="block mx-auto rounded-xl"
                    width="60%"
                    height="auto"
                />
                <p className="text-center mt-5 text-lg">
                    Revolutionizing content safety with advanced video analysis. Upload your videos and let our AI-driven platform detect objects and assess content safety, ensuring a secure environment for advertisers on social media platforms.
                </p>
                <div className="mt-10 text-center">
                    <h2 className="text-2xl font-semibold mb-4">Features:</h2>
                    <ul className="list-disc list-inside mb-6">
                        <li>Automatic video analysis to identify objects and themes.</li>
                        <li>Precise confidence estimates for each detection.</li>
                        <li>Streamline content moderation and make your media safe for advertising.</li>
                        <li>User-friendly dashboard to review and manage analyses.</li>
                    </ul>
                    <Link to="/login" className="py-2 px-4">
                        <GetStartedButton />
                    </Link>
                </div>
            </div>
            <Footer/>
        </>
    );
}

export default LandingPage;
