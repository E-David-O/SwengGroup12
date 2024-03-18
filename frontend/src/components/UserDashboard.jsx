import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * 
 * @returns UserDashboard component
 * @description This component is a given user's dashboard. They will be re-directed to this page upon
 * successful log-in or registration.
 * 
 */


function LandingPage() {
    return (
        <>
            <Navbar />
            <h1 className="text-2xl font-bold text-center mb-8 mt-8 bg-white ">Welcome to the user dashboard</h1>
            <div className="container flex ">

            </div>
            <h2>Here you can see all the videos you've analysed along with all of our video analysis services</h2>
            <Footer />
        </>
    );
}

export default LandingPage;