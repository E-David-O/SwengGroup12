import Navbar from "./Navbar";
import Footer from "./Footer";

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
            <h1 className="text-center text-3xl font-bold py-4">SWENG Group 12</h1>
            <Footer />
        </>
    );
}

export default About;