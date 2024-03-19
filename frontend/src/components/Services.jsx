import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * 
 * @returns Services component
 * @description This component will make up the page for our "Services" page. This will explain in further detail the
 * services our website offers along with its functionality.
 * 
 */

function Services() {
    return (
        <div className="min-h-screen">
            <Navbar />
            <h1 className="text-center text-3xl font-bold py-4">Our Services</h1>
            <Footer />
        </div>
    );
}

export default Services;