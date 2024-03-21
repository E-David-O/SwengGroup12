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
            <div className="text-center">
                <h1 className="text-3xl font-bold py-4">SWENG Group 12</h1>
                <h2 className="text-2xl font-bold py-4">The frontend team</h2>
                <ul>
                    <li>Louie Somers</li>
                    <li>Finn Cummins</li>
                    <li>Afaf Shadani</li>
                    <li>Daire Frankling</li>
                </ul>
                <h2 className="text-2xl font-bold py-4">The Database team</h2>
                <ul>
                    <li>Eimhin Heenan-Roberts</li>
                    <li>Conor Daly</li>
                </ul>
                <h2 className="text-2xl font-bold py-4">API team</h2>
                <ul>
                    <li>Ming Him Foun</li>
                    <li>Nicolas Moschenross</li>
                    <li>Rishi Manu</li>
                </ul>
                <h2 className="text-2xl font-bold py-4">Frame analysis team</h2>
                <ul>
                    <li>Emeka David Odoemelam</li>
                    <li>Ayushmaan Kumar Yadav</li>
                </ul>
                <Footer />
            </div>
        </>
    );
}

export default About;