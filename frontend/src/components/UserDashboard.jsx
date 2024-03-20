import Navbar from "./Navbar";
import Footer from "./Footer";
import DashboardCard from "./Card";

/**
 * 
 * @returns UserDashboard component
 * @description This component is a given user's dashboard. They will be re-directed to this page upon
 * successful log-in or registration.
 * 
 */


function LandingPage() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <div className="text-center">
            <div className="text-center">
                <h1 className="text-2xl font-bold text-center mb-8 mt-8 bg-white inline-block rounded py-2 px-4">Welcome to the user dashboard</h1>
            </div>
            <h2>Here you can see all the videos you've analysed along with all of our video analysis services...</h2>
                <div className="flex flex-row justify-evenly mx-4 py-4">
                    <DashboardCard
    
                        cardTitle="Upload your own video"
                        cardDescription="Upload your own video to our machine learning powered algorithm for analysis! You will receive instantaneous analytics as to what objects your video contains in addition to locating objects within frames"
                        imgUrl="https://universalcaptions.files.wordpress.com/2016/05/upload-video.png?w=1200"
                        buttonText="Upload video"
                        buttonLink="/video"
                    />

                    <DashboardCard 
                        cardTitle="Enter a video url"
                        imgUrl="https://cdn.mos.cms.futurecdn.net/8gzcr6RpGStvZFA2qRt4v6-1200-80.jpg.webp"
                        buttonText="Enter URL"
                        buttonLink="/video"
                    />

                    <DashboardCard
                        cardTitle="Record and analyse a live video"
                        imgUrl="https://t4.ftcdn.net/jpg/05/09/96/71/360_F_509967154_SxP5oGfK7imqJXezihVIbWq9k0i21gwE.jpg"
                        buttonText="Record Live video"
                        buttonLink="/live"
                    />
                
            </div>
            </div>
           
            <Footer/>
        </div>
    );
}

export default LandingPage;