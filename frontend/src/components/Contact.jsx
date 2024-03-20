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
        <div className="min-h-screen">
            <Navbar />
            <h1 className="text-center text-3xl font-bold py-4">Contact Us</h1>
            <Footer />
        </div>
    );
}

export default Contact;