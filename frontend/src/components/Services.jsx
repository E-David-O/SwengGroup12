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
        <>
            <Navbar />
            <h1 className="text-center text-2xl font-bold">Our Services</h1>
            <Footer />
        </>
    );
}

export default Services;