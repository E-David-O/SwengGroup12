import Navbar from "./Navbar";

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
            <h1>Welcome to the user dashboard</h1>
            <h2>Here you can see all the videos you've analysed along with all of our video analysis services</h2>
        </>
    );
}

export default LandingPage;