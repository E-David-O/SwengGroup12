import {
    VideoCameraOutlined
} from "@ant-design/icons";
import { useContext, useState } from "react";
import { VideoContext } from "./VideoUtil";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "./LogoutButton";
import LoginButton from "./LoginButton";
import NavbarButton from "./NavbarButton";

function Navbar() {
    const [open, setOpen] = useState(false);
    const { token, logout } = useContext(VideoContext);
    const handleClick = () => {
        setOpen(!open);
    };

    const navigate = useNavigate();

    const handleLogout = (e) => {
        e.preventDefault();

        axios.post("http://localhost:8000/auth/logout")
        .then((response) => {
            if(response.status === 200) {
                logout();
            }
            navigate("/");
            console.log("Successful Log-out")
        })
        .catch(function (error) {
            alert("Error logging out");
            console.log(error);
        });
        
    }

    const handleMode = (e) => {
        if (localStorage.theme === "dark" || !("theme" in localStorage)) {
            //add class=dark in html element
            document.documentElement.classList.add("dark");
          } else {
            //remove class=dark in html element
            document.documentElement.classList.remove("dark");
          }
      
          if (localStorage.theme === "dark") {
            localStorage.theme = "light";
          } else {
            localStorage.theme = "dark";
          }
        }
    




return (
    <nav className="bg-white border-gray-200 dark:bg-gray-900">
        <div className="max-w-screen flex flex-wrap items-center justify-between mx-2 pt-4 pb-4 pr-2 pl-2">
        <Link to="/" className="flex items-center space-x-3 rtl:space-x-reverse">
            <VideoCameraOutlined className="h-3 max-w-xl" alt=" Logo" />
            <span className="self-center text-black text-2xl font-semibold whitespace-nowrap dark:text-white">Video Analytics</span>
        </Link>
        <button type="button" className="inline-flex items-center w-10 h-10 justify-center text-sm text-gray-500 rounded-lg hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-default" aria-expanded="false" onClick={handleClick}>
            <span className="sr-only">Open main menu</span>
            <svg className="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 1h15M1 7h15M1 13h15"/>
            </svg>
        </button>
        <div className={
            "w-full " +
            (open ? "flex " : " hidden")
        }>
            <ul className={"absolute z-10 top-[72px] right-0 font-medium flex flex-col p-4 border border-slate-400 rounded-lg shadow-lg bg-gray-50 space-x-8 rtl:space-x-reverse bg-white dark:bg-gray-800 dark:bg-gray-900 dark:border-gray-700"}>
                { token == "" ? 
                    <>
                        <li>
                            <Link to="/services" className="block py-2 px-10 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><NavbarButton buttonText="Services" /></Link>
                        </li>

                        <li>
                            <Link to="/about" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><NavbarButton buttonText="About" /></Link>
                        </li>

                        <li>
                            <Link to="/contact" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><NavbarButton buttonText="Contact" /></Link>
                        </li>

                        <li>
                            <Link to="/login" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><LoginButton /></Link>
                        </li>
                    </>
                    : 
                    <>
                        <li>
                            <Link to="/video" className="block py-2 px-10 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><NavbarButton buttonText="Video Upload" /></Link>
                        </li>

                        <li>
                            <Link to="/url" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><NavbarButton buttonText="Video URL" /></Link>
                        </li>

                        <li>
                            <Link to="/live" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><NavbarButton buttonText="Live Video" /></Link>
                        </li>
                        <li>
                            <Link to="/your-videos" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><NavbarButton buttonText="Previously Analysed" /></Link>
                        </li>
                        <li>
                            <div onClick={handleMode} className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparen">
                                <NavbarButton buttonText={"Theme"} />
                            </div>
                        </li>
                        <li>
                            <Link onClick={(e) => handleLogout(e)} to="/video" className="block py-2 px-3 text-gray-900 rounded hover:bg-gray-100 hover:bg-transparent border-0 hover:text-blue-700 p-0 dark:text-white dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white dark:hover:bg-transparent"><LogoutButton /></Link>
                        </li>
                        
                    </>
                }

            </ul>
        </div>
  </div>
</nav>
    );
}
export default Navbar;
