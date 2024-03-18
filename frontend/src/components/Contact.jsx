import Navbar from "./Navbar";
import Footer from "./Footer";

/**
 * 
 * @returns Contact component
 * @description This component will make up the page for our "Contact" page. This component contains a form where
 * users can reach out to us along with other contact information.
 * 
 */

function Contact() {
    return (
        <>
            <Navbar />
            <h1 className="text-center text-xl">Contact Us</h1>
            <Footer />
        </>
    );
}

export default Contact;