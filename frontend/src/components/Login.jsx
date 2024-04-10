import axios from 'axios';
import { useState, useContext} from 'react';
import {Link, useNavigate } from 'react-router-dom';
import { VideoContext } from './VideoUtil';
import Navbar from './Navbar';
import Footer from "./Footer";

export default function Login() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [inputError, setInputError] = useState({ username: false, password: false });
    const [noUserFound, setNoUserFound] = useState(false)
    const [passwordVisible, setPasswordVisible] = useState(false);
    const {setToken} = useContext(VideoContext);

    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        setInputError({ username: false, password: false });

        if (!username) {
            setInputError((prev) => ({ ...prev, username: true }));
            return;
        }
        else if (!password) {
            setInputError((prev) => ({ ...prev, password: true }));
            return;
        }

        const formData = new FormData();
        formData.append("username", username);
        formData.append("password", password);

        axios({
            method: 'post',
            url: "http://localhost:8000/auth/login",
            data: formData,
            headers: {'Content-Type': 'multipart/form-data' }
        })
        .then((response) => {
            console.log("Successful Log-in");
            setToken(response.data.username);
            navigate("/");
        })
        .catch(function (error) {
            // handle error
            alert(error.response.data.message)
            console.log(error);
            setNoUserFound(true);
        }); 
    }

    const normalStyle = `bg-gray-50 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 focus:ring-primary-600 focus:border-primary-600 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500`;
    const errorStyle = `bg-gray-50 border-red-500 border text-gray-900 sm:text-sm rounded-lg block w-full p-2.5 dark:bg-gray-700 dark:border-red-500 dark:placeholder-red-300 dark:text-white`;

    return (
        <>
            <style>{`
                @keyframes backgroundChange {
                    0% { background-color: rgba(16,24,39,1); }
                    20% { background-color: rgba(16,24,39,0.8); }
                    40% { background-color: rgba(16,24,39,0.6); }
                    50% { background-color: rgba(16,24,39,0.5); }
                    60% { background-color: rgba(16,24,39,0.6); }
                    80% { background-color: rgba(16,24,39,0.8); }
                    100% { background-color: rgba(16,24,39,1); }
                }

                .dynamic-background {
                    animation: backgroundChange 10s ease-in-out infinite;
                }
            `}</style>
            <Navbar/>
            <div className="bg-gray-50 dark:bg-gray-900 dynamic-background">
                <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
                    <div className="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700">
                        <div className="p-6 space-y-4 md:space-y-6 sm:p-8">
                            <h1 className="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white">
                                Sign in to your account
                            </h1>
                            {noUserFound && <p className="text-red-500 text-s italic mb-2">Incorrect username or password.</p>}
                            <form>
                                <div>
                                    <label htmlFor="inputUsername" className="block mb-2 text-sm font-medium text-gray-900 dark:text-white" >Username</label>
                                    {inputError.username && <p className="text-red-500 text-xs italic mb-2">Please enter your username.</p>}
                                    <input 
                                        className={`${inputError.username ? errorStyle : normalStyle}`}  
                                        id="inputUsername" 
                                        name="username" 
                                        placeholder="Enter Username"
                                        onChange={(e) => {
                                            setUsername(e.target.value)
                                            setNoUserFound(false)
                                            setInputError((prev) => ({ ...prev, password: false }));
                                        }}
                                    ></input>
                                </div>
                                <div >
                                    <label htmlFor="inputPassword" className="block mt-4 mb-2 text-sm font-medium text-gray-900 dark:text-white">Password</label>
                                    {inputError.password && <p className="text-red-500 text-xs italic mb-2">Please enter your password.</p>}
                                    <div className="relative">
                                        <input 
                                            className={`pr-10 ${inputError.password ? errorStyle : normalStyle}`}  
                                            id="inputPassword" 
                                            name="password" 
                                            placeholder="Enter Password"
                                            type={passwordVisible ? 'text' : 'password'}
                                            onChange={(e) => {
                                                setPassword(e.target.value)
                                                setNoUserFound(false)
                                                setInputError((prev) => ({ ...prev, password: false }));
                                            }}
                                            required
                                        ></input>
                                        <button
                                            type="button"
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5"
                                            onClick={togglePasswordVisibility}
                                        >
                                            {passwordVisible ? <p className="text-black">Hide</p> : <p className="text-black">Show</p>}
                                        </button>
                                    </div>
                                </div>
                                <button onClick={(e) => handleSubmit(e)} id="submit-button" type="submit" 
                                        className="mt-4 w-full text-white bg-blue-500 hover:bg-blue-600 focus:ring-4 
                                        focus:outline-none focus:ring-blue-300 dark:focus:ring-blue-800 font-medium 
                                        rounded-lg text-sm px-5 py-2.5 text-center transition duration-150 ease-in-out">
                                    Sign in
                                </button>
                            </form>
                            
                            <p className="text-sm font-light text-gray-500 dark:text-gray-400">
                                Don’t have an account yet? <Link to="/register" className="font-medium text-primary-600 hover:underline dark:text-primary-500">Sign up</Link>
                            </p>
                            
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        </>
    )
}
