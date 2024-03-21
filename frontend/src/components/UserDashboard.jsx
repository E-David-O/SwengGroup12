import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardCard from "./Card";
import { VideoContext } from "./VideoUtil";
import { useContext } from "react";

/**
 * 
 * @returns UserDashboard component
 * @description This component is a given user's dashboard. They will be re-directed to this page upon
 * successful log-in or registration.
 * 
 */
function LandingPage() {
    const { token, logout } = useContext(VideoContext);

    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="text-center">
                <h1 className="text-2xl font-bold text-center mb-2 mt-8 bg-white inline-block rounded py-2 px-4">Welcome to your dashboard <p className="inline-block rotating-username-text">{token}</p>!</h1>
                
                <div className="flex flex-wrap justify-center gap-4 mx-auto py-4 px-4">
                    <DashboardCard
                        cardTitle="Upload your own video"
                        cardDescription="Upload your own video to our machine learning powered algorithm for analysis! You will receive instantaneous analytics as to what objects your video contains in addition to locating objects within frames"
                        imgUrl="https://universalcaptions.files.wordpress.com/2016/05/upload-video.png?w=1200"
                        buttonText="Upload video"
                        buttonLink="/video"
                    />

                    <DashboardCard 
                        cardTitle="Enter a video url"
                        cardDescription="Insert your url to a youtube video and have our machine learning algorithm analyse the video. This will work for any video on the youtube website."
                        imgUrl="https://cdn.mos.cms.futurecdn.net/8gzcr6RpGStvZFA2qRt4v6-1200-80.jpg.webp"
                        buttonText="Enter URL"
                        buttonLink="/url"
                    />

                    <DashboardCard
                        cardTitle="Record and analyse a live video"
                        cardDescription="Analyse a live video in real time using your webcam! Once you stop recording our algorithm will begin to analyse your video and give you an overview of all the objects present in your recording."
                        imgUrl="https://t4.ftcdn.net/jpg/05/09/96/71/360_F_509967154_SxP5oGfK7imqJXezihVIbWq9k0i21gwE.jpg"
                        buttonText="Record Live video"
                        buttonLink="/live"
                    />
                </div>
            </div>
            <Footer />
        </div>
    );
}

export default LandingPage;
