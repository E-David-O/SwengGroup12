import Navbar from "./Navbar";

/**
 * 
 * @returns About component
 * @description This component will make up the page for our "About Us" page. This will feature every member of our team
 * along with a short description of what they've been working on.
 * 
 */

function About() {
    return (
        <>
            <Navbar />
            <h1 className="text-center text-xl">About the team</h1>
        </>
    );
}

export default About;