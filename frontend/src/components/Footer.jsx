import { Link } from "react-router-dom";

function Footer() {
    const currentYear = new Date().getFullYear();

    return (
        <footer className="bg-white text-black text-lg font-bold py-4 mt-8">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <Link to="/about">
                    Made by SWENG Group 12 in 🍀
                </Link>
                <p className="px-2 text-sm italic font-normal hover:text-slate-400">{currentYear} SWENG Group 12. All rights reserved.</p>
            </div>
        </footer>
    );
}

export default Footer;
