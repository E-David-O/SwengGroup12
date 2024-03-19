import { Link } from "react-router-dom";
import { useContext } from "react";
import { VideoContext } from "./VideoUtil";
import NavbarButton from "./NavbarButton";
function Footer() {
    const currentYear = new Date().getFullYear();
    const { deleteData } = useContext(VideoContext);


    const handleClearCache = (e) => {
        e.preventDefault();
        deleteData();
       
    }

    return (
        <footer className="bg-white text-black text-lg font-bold py-4 mt-8">
            <div className="container mx-auto px-4 flex justify-between items-center">
                <p className="px-2 text-sm italic font-normal hover:text-slate-400">{currentYear} SWENG Group 12. All rights reserved.</p>
                <Link to="/about">
                    Made by SWENG Group 12 in 🍀
                </Link>
                <p>
                    <Link onClick={(e) => handleClearCache(e)} to="/video" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-white md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"><NavbarButton buttonText="Clear Local Data" /></Link>
                </p>

            </div>
        </footer>
    );
}

export default Footer;
